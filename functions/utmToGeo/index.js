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
  try {
    admin.auth();
    proj4.defs([
      ["EPSG:32615", "+proj=utm +zone=15 +datum=WGS84 +units=m +no_defs +type=crs"],
      ["EPSG:32715", "+proj=utm +zone=15 +south +datum=WGS84 +units=m +no_defs +type=crs"],
      ["EPSG:32616", "+proj=utm +zone=16 +datum=WGS84 +units=m +no_defs +type=crs"],
      ["EPSG:32716", "+proj=utm +zone=16 +south +datum=WGS84 +units=m +no_defs +type=crs"],
      ["EPSG:32617", "+proj=utm +zone=17 +datum=WGS84 +units=m +no_defs +type=crs"],
      ["EPSG:32717", "+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs +type=crs"],
      ["EPSG:32618", "+proj=utm +zone=18 +datum=WGS84 +units=m +no_defs +type=crs"],
      ["EPSG:32718", "+proj=utm +zone=18 +south +datum=WGS84 +units=m +no_defs +type=crs"],
    ]);
    let utm;
    if (req.body.zona == "15N") {
      utm = proj4("EPSG:32615");
    } else if(req.body.zona == "15S") {
      utm = proj4("EPSG:32715");
    } else if(req.body.zona == "16N") {
      utm = proj4("EPSG:32616");
    } else if(req.body.zona == "16S") {
      utm = proj4("EPSG:32716");
    } else if(req.body.zona == "17N") {
      utm = proj4("EPSG:32617");
    } else if(req.body.zona == "17S") {
      utm = proj4("EPSG:32717");
    } else if(req.body.zona == "18N") {
      utm = proj4("EPSG:32618");
    } else {
      utm = proj4("EPSG:32718");
    }
    const xUtm = parseFloat(req.body.xWSG84);
    const yUtm = parseFloat(req.body.yWSG84);
    const [lon, lat] = utm.inverse([xUtm, yUtm]);
    const geoPoint = new GeoPoint(lat, lon);
    console.log(geoPoint);
    const coordGeo = {
      coordGeo: geoPoint,
    };
    res.send({status: "Success!", message: coordGeo});
  } catch (error) {
    console.error(error);
    res.send({status: "Error!", message: error});
  }
};

exports.utmToGeo = onRequest({
  cors: ["https://sustenta.flutterflow.app"],
}, utmToGeo);
