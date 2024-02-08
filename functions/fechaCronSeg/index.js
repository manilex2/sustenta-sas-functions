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

const fechaCronSeg = async (req, res) => {
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
  let data = {};

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
      data = {
        enero: enero,
        febrero: febrero,
        marzo: marzo,
        abril: abril,
        mayo: mayo,
        junio: junio,
        julio: julio,
        agosto: agosto,
        septiembre: septiembre,
        octubre: octubre,
        noviembre: noviembre,
        diciembre: diciembre,
        anio: `${anio}`,
      };
      if (prog.fechasCron) {
        const index = prog.fechasCron.findIndex((meses) => meses.anio == data.anio);
        if (index == -1) {
          prog.fechasCron.push(data);
        } else {
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
        }
      } else {
        prog.fechasCron = [];
        prog.fechasCron.push(data);
      }
      if (plan.fechasCron) {
        const index = plan.fechasCron.findIndex((meses) => meses.anio == data.anio);
        if (index == -1) {
          plan.fechasCron.push(data);
        } else {
          plan.fechasCron[index].enero = plan.fechasCron[index].enero + enero;
          plan.fechasCron[index].febrero = plan.fechasCron[index].febrero + febrero;
          plan.fechasCron[index].marzo = plan.fechasCron[index].marzo + marzo;
          plan.fechasCron[index].abril = plan.fechasCron[index].abril + abril;
          plan.fechasCron[index].mayo = plan.fechasCron[index].mayo + mayo;
          plan.fechasCron[index].junio = plan.fechasCron[index].junio + junio;
          plan.fechasCron[index].julio = plan.fechasCron[index].julio + julio;
          plan.fechasCron[index].agosto = plan.fechasCron[index].agosto + agosto;
          plan.fechasCron[index].septiembre = plan.fechasCron[index].septiembre + septiembre;
          plan.fechasCron[index].octubre = plan.fechasCron[index].octubre + octubre;
          plan.fechasCron[index].noviembre = plan.fechasCron[index].noviembre + noviembre;
          plan.fechasCron[index].diciembre = plan.fechasCron[index].diciembre + diciembre;
        }
      } else {
        plan.fechasCron = [];
        plan.fechasCron.push(data);
      }
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
  data = {
    enero: enero,
    febrero: febrero,
    marzo: marzo,
    abril: abril,
    mayo: mayo,
    junio: junio,
    julio: julio,
    agosto: agosto,
    septiembre: septiembre,
    octubre: octubre,
    noviembre: noviembre,
    diciembre: diciembre,
    anio: `${anio}`,
  };
  if (prog.fechasCron) {
    const index = prog.fechasCron.findIndex((meses) => meses.anio == data.anio);
    if (index == -1) {
      prog.fechasCron.push(data);
    } else {
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
    }
  } else {
    prog.fechasCron = [];
    prog.fechasCron.push(data);
  }
  if (plan.fechasCron) {
    const index = plan.fechasCron.findIndex((meses) => meses.anio == data.anio);
    if (index == -1) {
      plan.fechasCron.push(data);
    } else {
      plan.fechasCron[index].enero = plan.fechasCron[index].enero + enero;
      plan.fechasCron[index].febrero = plan.fechasCron[index].febrero + febrero;
      plan.fechasCron[index].marzo = plan.fechasCron[index].marzo + marzo;
      plan.fechasCron[index].abril = plan.fechasCron[index].abril + abril;
      plan.fechasCron[index].mayo = plan.fechasCron[index].mayo + mayo;
      plan.fechasCron[index].junio = plan.fechasCron[index].junio + junio;
      plan.fechasCron[index].julio = plan.fechasCron[index].julio + julio;
      plan.fechasCron[index].agosto = plan.fechasCron[index].agosto + agosto;
      plan.fechasCron[index].septiembre = plan.fechasCron[index].septiembre + septiembre;
      plan.fechasCron[index].octubre = plan.fechasCron[index].octubre + octubre;
      plan.fechasCron[index].noviembre = plan.fechasCron[index].noviembre + noviembre;
      plan.fechasCron[index].diciembre = plan.fechasCron[index].diciembre + diciembre;
    }
  } else {
    plan.fechasCron = [];
    plan.fechasCron.push(data);
  }
  await db.collection("programas").doc(`${req.body.progId}`).update(prog);
  await db.collection("planMedAmb").doc(`${req.body.planId}`).update(plan);
  res.send({status: "Success!", message: [prog, plan]});
};

exports.fechaCronSeg = onRequest({
  cors: ["https://sustenta.flutterflow.app"],
}, fechaCronSeg);
