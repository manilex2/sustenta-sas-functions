/* eslint-disable max-len */
require("dotenv").config("./.env");
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const {getFirestore, FieldPath} = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const bcrypt = require("bcrypt");

admin.initializeApp();
setGlobalOptions({
  maxInstances: 10,
  timeoutSeconds: 540,
  memory: "1GiB",
});

const registerUser = async (req, res) => {
  const auth = admin.auth();
  const db = getFirestore();
  try {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLECLIENTID,
        process.env.GOOGLESECRETCODE,
        process.env.GOOGLEREDIRECTURI,
    );

    /**
    * Crear una cadena de caracteres aleatoria.
    * @return {string} La cadena aleatoria de caracteres.
    */
    const claveProv = () => {
      const saltRounds = 10;
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            reject(err);
          } else {
            resolve(salt);
          }
        });
      });
    };

    oAuth2Client.setCredentials({refresh_token: process.env.GOOGLEREFRESHTOKEN});
    const consRef = (await db.collection("consultora").doc(`${req.body.consultId}`).get()).ref;
    const users = (await db.collection("users").where("consultId", "==", consRef).get()).docs.map((user) => {
      return user.data();
    });
    const instRef = (await db.collection("institucion").where(FieldPath.documentId(), "in", req.body.instId).get()).docs.map((emp) => {
      return emp.ref;
    });
    const noCreated = users.some((resp) => resp.email === req.body.email);
    if (!noCreated) {
      const newUserRef = db.collection("users").doc();
      const user = {
        email: req.body.email,
        displayName: req.body.display_name,
        password: `${claveProv}`,
      };
      try {
        const userFirebase = await auth.createUser({...user, uid: `${newUserRef.id}`});
        console.log("Usuario creado con éxito:", userFirebase.uid);
        const usuario = {
          email: req.body.email,
          display_name: req.body.display_name,
          photo_url: req.body.photo_url,
          phone_number: req.body.phone_number,
          cargo: req.body.cargo,
          rol: req.body.rol,
          tipoOrg: req.body.tipoOrg,
          uid: userFirebase.uid,
          created_time: new Date(userFirebase.metadata.creationTime),
          consultId: consRef,
          instId: instRef,
          firstLogin: true,
        };
        console.log(usuario);
        newUserRef.set(usuario);

        const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
          service: process.env.GMAILSERVICE,
          auth: {
            type: "OAuth2",
            user: process.env.GMAILUSER,
            clientId: process.env.GOOGLECLIENTID,
            clientSecret: process.env.GOOGLESECRETCODE,
            refreshToken: process.env.GOOGLEREFRESHTOKEN,
            accessToken: ACCESS_TOKEN,
          },
          tls: {
            rejectUnauthorized: true,
          },
        });

        const from = `Notificaciones <${process.env.MAILFROM}>`;
        const subject = "Su usuario fue creado exitósamente";
        // eslint-disable-next-line max-len
        const message = `Estimado ${req.body.display_name}
        Le comunicamos que su usuario se creó correctamente, abajo encontrará los datos para ingresar a la plataforma https://sustenta.flutterflow.app/ .
        Usuario = ${req.body.email}
        Contraseña = ${claveProv}.`;

        // eslint-disable-next-line max-len
        const messageHtml = `<p>Estimado ${req.body.display_name} <br/>Le comunicamos que su usuario se creó correctamente, abajo encontrará los datos para ingresar a la <a href="https://sustenta.flutterflow.app/">plataforma</a>. <br/>Usuario: ${req.body.email} <br/>Contraseña: ${claveProv}</p>`;

        const mailOptions = {
          from: from,
          to: req.body.email,
          subject: subject,
          text: message,
          html: messageHtml,
        };

        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          throw new Error(`Se creó el usuario ${req.body.email} pero no se pudó notificar por correo por favor suministrele al usuario su correo registrado y la contraseña provisional: ${claveProv} \nError: ${error}`);
        }
      } catch (error) {
        console.error("Error al crear usuario:", error);
        throw new Error(error);
      }
    } else {
      throw new Error("El usuario ya se encuentra creado.");
    }
    res.status(200).send({status: "Success", message: "Usuario creado exitósamente."});
  } catch (error) {
    res.status(403).send({status: "Error", message: `Ocurrió el siguiente error: ${error}`});
  }
};

exports.registerUser = onRequest(registerUser);
