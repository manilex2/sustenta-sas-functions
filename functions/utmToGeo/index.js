/* eslint-disable max-len */
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const {GeoPoint} = require("firebase-admin/firestore");
const proj4 = require("proj4");

admin.initializeApp();
setGlobalOptions({
  maxInstances: 10,
  timeoutSeconds: 540,
  memory: "1GiB",
});

const utmToGeo = async (req, res) => {
  admin.auth();
  proj4.defs("EPSG:32717", "+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs");
  const utm = proj4("EPSG:32717");
  const xUtm = req.body.utmX;
  const yUtm = req.body.utmY;
  const [lon, lat] = utm.inverse([xUtm, yUtm]);
  const geoPoint = new GeoPoint(lat, lon);
  console.log(geoPoint);
  res.send({status: "Success!", message: geoPoint});
};

exports.utmToGeo = onRequest(utmToGeo);