/* eslint-disable max-len */
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const {GeoPoint, getFirestore} = require("firebase-admin/firestore");
const proj4 = require("proj4");

admin.initializeApp();
setGlobalOptions({
  maxInstances: 10,
  timeoutSeconds: 540,
  memory: "1GiB",
});

const utmToGeo = async (req, res) => {
  try {
    admin.auth();
    const db = getFirestore();
    proj4.defs("EPSG:32717", "+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs");
    const utm = proj4("EPSG:32717");
    const idProy = req.body.idProy;
    const proyDoc = (await db.collection("proyectos").doc(idProy).get()).data();
    const xUtm = proyDoc.coordWSG84.utmX;
    const yUtm = proyDoc.coordWSG84.utmY;
    const [lon, lat] = utm.inverse([xUtm, yUtm]);
    const geoPoint = new GeoPoint(lat, lon);
    console.log(geoPoint);
    const coordGeo = {
      coordGeo: geoPoint,
    };
    await db.collection("proyectos").doc(idProy).update(coordGeo);
    res.send({status: "Success!", message: coordGeo});
  } catch (error) {
    console.error(error);
    res.send({status: "Error!", message: error});
  }
};

exports.utmToGeo = onRequest(utmToGeo);
