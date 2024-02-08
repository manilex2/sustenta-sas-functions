/* eslint-disable max-len */
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");

admin.initializeApp();
setGlobalOptions({
  maxInstances: 10,
  timeoutSeconds: 540,
  memory: "1GiB",
});

const fechaCronSegEdit = async (req, res) => {
  const db = getFirestore();
  const prog = (await db.collection("programas").doc(`${req.body.progId}`).get()).data();
  const plan = (await db.collection("planMedAmb").doc(`${req.body.planId}`).get()).data();
  let enero = 0;
  let febrero = 0;
  let marzo = 0;
  let abril = 0;
  let mayo = 0;
  let junio = 0;
  let julio = 0;
  let agosto = 0;
  let septiembre = 0;
  let octubre = 0;
  let noviembre = 0;
  let diciembre = 0;
  let anio = new Date(Date.now()).getFullYear();
  let index = 0;
  let indexPlan = 0;

  for (let i = 0; i < req.body.fechasSegAnt.length; i++) {
    const fecha = new Date(`${req.body.fechasSegAnt[i]}`);
    if (fecha.getMonth() == 0) {
      enero = 1;
    } else if (fecha.getMonth() == 1) {
      febrero = 1;
    } else if (fecha.getMonth() == 2) {
      marzo = 1;
    } else if (fecha.getMonth() == 3) {
      abril = 1;
    } else if (fecha.getMonth() == 4) {
      mayo = 1;
    } else if (fecha.getMonth() == 5) {
      junio = 1;
    } else if (fecha.getMonth() == 6) {
      julio = 1;
    } else if (fecha.getMonth() == 7) {
      agosto = 1;
    } else if (fecha.getMonth() == 8) {
      septiembre = 1;
    } else if (fecha.getMonth() == 9) {
      octubre = 1;
    } else if (fecha.getMonth() == 10) {
      noviembre = 1;
    } else {
      diciembre = 1;
    }
    anio = fecha.getFullYear();
    if (new Date(`${req.body.fechasSegAnt[i]}`).getFullYear() < new Date(`${req.body.fechasSegAnt[i + 1]}`).getFullYear()) {
      index = prog.fechasCron.findIndex((meses) => meses.anio == anio);

      prog.fechasCron[index].enero = prog.fechasCron[index].enero - enero;
      prog.fechasCron[index].febrero = prog.fechasCron[index].febrero - febrero;
      prog.fechasCron[index].marzo = prog.fechasCron[index].marzo - marzo;
      prog.fechasCron[index].abril = prog.fechasCron[index].abril - abril;
      prog.fechasCron[index].mayo = prog.fechasCron[index].mayo - mayo;
      prog.fechasCron[index].junio = prog.fechasCron[index].junio - junio;
      prog.fechasCron[index].julio = prog.fechasCron[index].julio - julio;
      prog.fechasCron[index].agosto = prog.fechasCron[index].agosto - agosto;
      prog.fechasCron[index].septiembre = prog.fechasCron[index].septiembre - septiembre;
      prog.fechasCron[index].octubre = prog.fechasCron[index].octubre - octubre;
      prog.fechasCron[index].noviembre = prog.fechasCron[index].noviembre - noviembre;
      prog.fechasCron[index].diciembre = prog.fechasCron[index].diciembre - diciembre;

      indexPlan = plan.fechasCron.findIndex((meses) => meses.anio == anio);

      plan.fechasCron[indexPlan].enero = plan.fechasCron[indexPlan].enero - enero;
      plan.fechasCron[indexPlan].febrero = plan.fechasCron[indexPlan].febrero - febrero;
      plan.fechasCron[indexPlan].marzo = plan.fechasCron[indexPlan].marzo - marzo;
      plan.fechasCron[indexPlan].abril = plan.fechasCron[indexPlan].abril - abril;
      plan.fechasCron[indexPlan].mayo = plan.fechasCron[indexPlan].mayo - mayo;
      plan.fechasCron[indexPlan].junio = plan.fechasCron[indexPlan].junio - junio;
      plan.fechasCron[indexPlan].julio = plan.fechasCron[indexPlan].julio - julio;
      plan.fechasCron[indexPlan].agosto = plan.fechasCron[indexPlan].agosto - agosto;
      plan.fechasCron[indexPlan].septiembre = plan.fechasCron[indexPlan].septiembre - septiembre;
      plan.fechasCron[indexPlan].octubre = plan.fechasCron[indexPlan].octubre - octubre;
      plan.fechasCron[indexPlan].noviembre = plan.fechasCron[indexPlan].noviembre - noviembre;
      plan.fechasCron[indexPlan].diciembre = plan.fechasCron[indexPlan].diciembre - diciembre;
      enero = 0;
      febrero = 0;
      marzo = 0;
      abril = 0;
      mayo = 0;
      junio = 0;
      agosto = 0;
      septiembre = 0;
      octubre = 0;
      noviembre = 0;
      diciembre = 0;
    }
  }

  index = prog.fechasCron.findIndex((meses) => meses.anio == anio);

  prog.fechasCron[index].enero = prog.fechasCron[index].enero - enero;
  prog.fechasCron[index].febrero = prog.fechasCron[index].febrero - febrero;
  prog.fechasCron[index].marzo = prog.fechasCron[index].marzo - marzo;
  prog.fechasCron[index].abril = prog.fechasCron[index].abril - abril;
  prog.fechasCron[index].mayo = prog.fechasCron[index].mayo - mayo;
  prog.fechasCron[index].junio = prog.fechasCron[index].junio - junio;
  prog.fechasCron[index].julio = prog.fechasCron[index].julio - julio;
  prog.fechasCron[index].agosto = prog.fechasCron[index].agosto - agosto;
  prog.fechasCron[index].septiembre = prog.fechasCron[index].septiembre - septiembre;
  prog.fechasCron[index].octubre = prog.fechasCron[index].octubre - octubre;
  prog.fechasCron[index].noviembre = prog.fechasCron[index].noviembre - noviembre;
  prog.fechasCron[index].diciembre = prog.fechasCron[index].diciembre - diciembre;

  indexPlan = plan.fechasCron.findIndex((meses) => meses.anio == anio);

  plan.fechasCron[indexPlan].enero = plan.fechasCron[indexPlan].enero - enero;
  plan.fechasCron[indexPlan].febrero = plan.fechasCron[indexPlan].febrero - febrero;
  plan.fechasCron[indexPlan].marzo = plan.fechasCron[indexPlan].marzo - marzo;
  plan.fechasCron[indexPlan].abril = plan.fechasCron[indexPlan].abril - abril;
  plan.fechasCron[indexPlan].mayo = plan.fechasCron[indexPlan].mayo - mayo;
  plan.fechasCron[indexPlan].junio = plan.fechasCron[indexPlan].junio - junio;
  plan.fechasCron[indexPlan].julio = plan.fechasCron[indexPlan].julio - julio;
  plan.fechasCron[indexPlan].agosto = plan.fechasCron[indexPlan].agosto - agosto;
  plan.fechasCron[indexPlan].septiembre = plan.fechasCron[indexPlan].septiembre - septiembre;
  plan.fechasCron[indexPlan].octubre = plan.fechasCron[indexPlan].octubre - octubre;
  plan.fechasCron[indexPlan].noviembre = plan.fechasCron[indexPlan].noviembre - noviembre;
  plan.fechasCron[indexPlan].diciembre = plan.fechasCron[indexPlan].diciembre - diciembre;

  enero = 0;
  febrero = 0;
  marzo = 0;
  abril = 0;
  mayo = 0;
  junio = 0;
  agosto = 0;
  septiembre = 0;
  octubre = 0;
  noviembre = 0;
  diciembre = 0;

  for (let i = 0; i < req.body.fechasSeg.length; i++) {
    const fecha = new Date(`${req.body.fechasSeg[i]}`);
    if (fecha.getMonth() == 0) {
      enero = 1;
    } else if (fecha.getMonth() == 1) {
      febrero = 1;
    } else if (fecha.getMonth() == 2) {
      marzo = 1;
    } else if (fecha.getMonth() == 3) {
      abril = 1;
    } else if (fecha.getMonth() == 4) {
      mayo = 1;
    } else if (fecha.getMonth() == 5) {
      junio = 1;
    } else if (fecha.getMonth() == 6) {
      julio = 1;
    } else if (fecha.getMonth() == 7) {
      agosto = 1;
    } else if (fecha.getMonth() == 8) {
      septiembre = 1;
    } else if (fecha.getMonth() == 9) {
      octubre = 1;
    } else if (fecha.getMonth() == 10) {
      noviembre = 1;
    } else {
      diciembre = 1;
    }
    anio = fecha.getFullYear();
    if (new Date(`${req.body.fechasSeg[i]}`).getFullYear() < new Date(`${req.body.fechasSeg[i + 1]}`).getFullYear()) {
      index = prog.fechasCron.findIndex((meses) => meses.anio == anio);

      prog.fechasCron[index].enero = prog.fechasCron[index].enero + enero;
      prog.fechasCron[index].febrero = prog.fechasCron[index].febrero + febrero;
      prog.fechasCron[index].marzo = prog.fechasCron[index].marzo + marzo;
      prog.fechasCron[index].abril = prog.fechasCron[index].abril + abril;
      prog.fechasCron[index].mayo = prog.fechasCron[index].mayo + mayo;
      prog.fechasCron[index].junio = prog.fechasCron[index].junio + junio;
      prog.fechasCron[index].julio = prog.fechasCron[index].julio + julio;
      prog.fechasCron[index].agosto = prog.fechasCron[index].agosto + agosto;
      prog.fechasCron[index].septiembre = prog.fechasCron[index].septiembre + septiembre;
      prog.fechasCron[index].octubre = prog.fechasCron[index].octubre + octubre;
      prog.fechasCron[index].noviembre = prog.fechasCron[index].noviembre + noviembre;
      prog.fechasCron[index].diciembre = prog.fechasCron[index].diciembre + diciembre;

      indexPlan = plan.fechasCron.findIndex((meses) => meses.anio == anio);

      plan.fechasCron[indexPlan].enero = plan.fechasCron[indexPlan].enero + enero;
      plan.fechasCron[indexPlan].febrero = plan.fechasCron[indexPlan].febrero + febrero;
      plan.fechasCron[indexPlan].marzo = plan.fechasCron[indexPlan].marzo + marzo;
      plan.fechasCron[indexPlan].abril = plan.fechasCron[indexPlan].abril + abril;
      plan.fechasCron[indexPlan].mayo = plan.fechasCron[indexPlan].mayo + mayo;
      plan.fechasCron[indexPlan].junio = plan.fechasCron[indexPlan].junio + junio;
      plan.fechasCron[indexPlan].julio = plan.fechasCron[indexPlan].julio + julio;
      plan.fechasCron[indexPlan].agosto = plan.fechasCron[indexPlan].agosto + agosto;
      plan.fechasCron[indexPlan].septiembre = plan.fechasCron[indexPlan].septiembre + septiembre;
      plan.fechasCron[indexPlan].octubre = plan.fechasCron[indexPlan].octubre + octubre;
      plan.fechasCron[indexPlan].noviembre = plan.fechasCron[indexPlan].noviembre + noviembre;
      plan.fechasCron[indexPlan].diciembre = plan.fechasCron[indexPlan].diciembre + diciembre;
      enero = 0;
      febrero = 0;
      marzo = 0;
      abril = 0;
      mayo = 0;
      junio = 0;
      agosto = 0;
      septiembre = 0;
      octubre = 0;
      noviembre = 0;
      diciembre = 0;
    }
  }

  index = prog.fechasCron.findIndex((meses) => meses.anio == anio);

  prog.fechasCron[index].enero = prog.fechasCron[index].enero + enero;
  prog.fechasCron[index].febrero = prog.fechasCron[index].febrero + febrero;
  prog.fechasCron[index].marzo = prog.fechasCron[index].marzo + marzo;
  prog.fechasCron[index].abril = prog.fechasCron[index].abril + abril;
  prog.fechasCron[index].mayo = prog.fechasCron[index].mayo + mayo;
  prog.fechasCron[index].junio = prog.fechasCron[index].junio + junio;
  prog.fechasCron[index].julio = prog.fechasCron[index].julio + julio;
  prog.fechasCron[index].agosto = prog.fechasCron[index].agosto + agosto;
  prog.fechasCron[index].septiembre = prog.fechasCron[index].septiembre + septiembre;
  prog.fechasCron[index].octubre = prog.fechasCron[index].octubre + octubre;
  prog.fechasCron[index].noviembre = prog.fechasCron[index].noviembre + noviembre;
  prog.fechasCron[index].diciembre = prog.fechasCron[index].diciembre + diciembre;

  indexPlan = plan.fechasCron.findIndex((meses) => meses.anio == anio);

  plan.fechasCron[indexPlan].enero = plan.fechasCron[indexPlan].enero + enero;
  plan.fechasCron[indexPlan].febrero = plan.fechasCron[indexPlan].febrero + febrero;
  plan.fechasCron[indexPlan].marzo = plan.fechasCron[indexPlan].marzo + marzo;
  plan.fechasCron[indexPlan].abril = plan.fechasCron[indexPlan].abril + abril;
  plan.fechasCron[indexPlan].mayo = plan.fechasCron[indexPlan].mayo + mayo;
  plan.fechasCron[indexPlan].junio = plan.fechasCron[indexPlan].junio + junio;
  plan.fechasCron[indexPlan].julio = plan.fechasCron[indexPlan].julio + julio;
  plan.fechasCron[indexPlan].agosto = plan.fechasCron[indexPlan].agosto + agosto;
  plan.fechasCron[indexPlan].septiembre = plan.fechasCron[indexPlan].septiembre + septiembre;
  plan.fechasCron[indexPlan].octubre = plan.fechasCron[indexPlan].octubre + octubre;
  plan.fechasCron[indexPlan].noviembre = plan.fechasCron[indexPlan].noviembre + noviembre;
  plan.fechasCron[indexPlan].diciembre = plan.fechasCron[indexPlan].diciembre + diciembre;

  await db.collection("programas").doc(`${req.body.progId}`).update(prog);
  await db.collection("planMedAmb").doc(`${req.body.planId}`).update(plan);
  res.send({status: "Success!", message: [prog, plan]});
};

exports.fechaCronSegEdit = onRequest({
  cors: ["https://sustenta.flutterflow.app"],
}, fechaCronSegEdit);
