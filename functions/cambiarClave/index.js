/* eslint-disable max-len */
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();
setGlobalOptions({
  maxInstances: 10,
  timeoutSeconds: 540,
  memory: "1GiB",
});

const cambiarClave = async (req, res) => {
  const auth = admin.auth();
  try {
    await auth.updateUser(`${req.body.uid}`, {
      password: `${req.body.clave}`,
    });
    res.status(200).send({status: "Success", message: `Contraseña cambiada exitosamente para el usuario: ${req.body.email}`});
  } catch (error) {
    res.status(403).send({status: "Error", message: `Ocurrió el siguiente error: ${error}`});
  }
};

exports.cambiarClave = onRequest({
  cors: ["https://sustenta.flutterflow.app"],
}, cambiarClave);
