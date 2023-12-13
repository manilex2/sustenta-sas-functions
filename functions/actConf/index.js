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

const actConf = async (req, res) => {
  const db = getFirestore();
  const querySnapshot = await db.collection("medidas").get();
  const medidas = querySnapshot.docs.map((medida) => ({
    id: medida.id,
    ...medida.data(),
  }));
  const querySnapshot2 = await db.collection("programas").get();
  const programas = querySnapshot2.docs.map((programa) => ({
    id: programa.id,
    ...programa.data(),
  }));
  const querySnapshot3 = await db.collection("planMedAmb").get();
  const planes = querySnapshot3.docs.map((plan) => ({
    id: plan.id,
    ...plan.data(),
  }));
  const querySnapshot4 = await db.collection("proyectos").get();
  const proyectos = querySnapshot4.docs.map((proyecto) => ({
    id: proyecto.id,
    ...proyecto.data(),
  }));
  const querySnapshot5 = await db.collection("institucion").get();
  const empresas = querySnapshot5.docs.map((empresa) => ({
    id: empresa.id,
    ...empresa.data(),
  }));
  const querySnapshot6 = await db.collection("consultora").get();
  const consultoras = querySnapshot6.docs.map((consultora) => ({
    id: consultora.id,
    ...consultora.data(),
  }));
  let medConf = 0;
  let medNoConfBaja = 0;
  let medNoConfAlta = 0;
  let medSinCalif = 0;
  let progConf = 0;
  let progNoConfBaja = 0;
  let progNoConfAlta = 0;
  let progSinCalif = 0;
  let planConf = 0;
  let planNoConfBaja = 0;
  let planNoConfAlta = 0;
  let planSinCalif = 0;
  let proyConf = 0;
  let proyNoConfBaja = 0;
  let proyNoConfAlta = 0;
  let proySinCalif = 0;
  let instConf = 0;
  let InstNoConfBaja = 0;
  let InstNoConfAlta = 0;
  let instSinCalif = 0;
  let califInt = "";
  for (let i = 0; i < consultoras.length; i++) {
    const consultora = consultoras[i];
    for (let a = 0; a < empresas.length; a++) {
      const empresa = empresas[a];
      if (consultora.id == empresa.idConsultora._path.segments[1]) {
        for (let b = 0; b < proyectos.length; b++) {
          const proyecto = proyectos[b];
          if (empresa.id == proyecto.institucionId._path.segments[1]) {
            for (let c = 0; c < planes.length; c++) {
              const plan = planes[c];
              if (proyecto.id == plan.proyId._path.segments[1]) {
                for (let d = 0; d < programas.length; d++) {
                  const programa = programas[d];
                  if (plan.id == programa.planId._path.segments[1]) {
                    for (let e = 0; e < medidas.length; e++) {
                      const medida = medidas[e];
                      if (programa.id == medida.programaId._path.segments[1]) {
                        switch (medidas[e].calificacionInterna) {
                          case "Conformidad":
                            medConf++;
                            break;
                          case "No Conformidad Baja":
                            medNoConfBaja++;
                            break;
                          case "No Conformidad Alta":
                            medNoConfAlta++;
                            break;
                          default:
                            medSinCalif++;
                            break;
                        }
                      }
                    }
                    if (medNoConfAlta >= 1 && medNoConfBaja == 0 && medConf == 0) {
                      califInt = "No Conformidad Alta";
                    } else if (medNoConfAlta == 1) {
                      califInt = "No Conformidad Baja";
                    } else if (medNoConfAlta == 2) {
                      califInt = "No Conformidad Alta";
                    } else if (medNoConfBaja >= 1) {
                      califInt = "No Conformidad Baja";
                    } else if (medNoConfAlta == 0 && medNoConfBaja == 0 && medConf == 0) {
                      califInt = "Sin Calificación";
                    } else {
                      califInt = "Conformidad";
                    }
                    console.log(`Conf: ${medConf}, No Conf Baja: ${medNoConfBaja}, No Conf Alta: ${medNoConfAlta}, Sin calificación: ${medSinCalif}, Calificación Programa: ${califInt}`);
                    const data = {
                      medConf,
                      medNoConfBaja,
                      medNoConfAlta,
                      medSinCalif,
                      califInterna: califInt,
                    };
                    await db.collection("programas").doc(programa.id).update(data);
                    programas[d] = {...programa, ...data};
                    medConf = 0, medNoConfBaja = 0, medNoConfAlta = 0, medSinCalif = 0, califInt = "";
                    switch (programas[d].califInterna) {
                      case "Conformidad":
                        progConf++;
                        break;
                      case "No Conformidad Baja":
                        progNoConfBaja++;
                        break;
                      case "No Conformidad Alta":
                        progNoConfAlta++;
                        break;
                      default:
                        progSinCalif++;
                        break;
                    }
                  }
                }
                if (progNoConfAlta >= 1 && progNoConfBaja == 0 && progConf == 0) {
                  califInt = "No Conformidad Alta";
                } else if (progNoConfAlta == 1) {
                  califInt = "No Conformidad Baja";
                } else if (progNoConfAlta == 2) {
                  califInt = "No Conformidad Alta";
                } else if (progNoConfBaja >= 1) {
                  califInt = "No Conformidad Baja";
                } else if (progNoConfAlta == 0 && progNoConfBaja == 0 && progConf == 0) {
                  califInt = "Sin Calificación";
                } else {
                  califInt = "Conformidad";
                }
                console.log(`Conf: ${progConf}, No Conf Baja: ${progNoConfBaja}, No Conf Alta: ${progNoConfAlta}, Sin calificación: ${progSinCalif}, Calificación Plan: ${califInt}`);
                const data = {
                  progConf,
                  progNoConfBaja,
                  progNoConfAlta,
                  progSinCalif,
                  califInterna: califInt,
                };
                await db.collection("planMedAmb").doc(plan.id).update(data);
                planes[c] = {...plan, ...data};
                progConf = 0, progNoConfBaja = 0, progNoConfAlta = 0, progSinCalif = 0, califInt = "";
                switch (planes[c].califInterna) {
                  case "Conformidad":
                    planConf++;
                    break;
                  case "No Conformidad Baja":
                    planNoConfBaja++;
                    break;
                  case "No Conformidad Alta":
                    planNoConfAlta++;
                    break;
                  default:
                    planSinCalif++;
                    break;
                }
              }
            }
            if (planNoConfAlta >= 1 && planNoConfBaja == 0 && planConf == 0) {
              califInt = "No Conformidad Alta";
            } else if (planNoConfAlta == 1) {
              califInt = "No Conformidad Baja";
            } else if (planNoConfAlta == 2) {
              califInt = "No Conformidad Alta";
            } else if (planNoConfBaja >= 1) {
              califInt = "No Conformidad Baja";
            } else if (planNoConfAlta == 0 && planNoConfBaja == 0 && planConf == 0) {
              califInt = "Sin Calificación";
            } else {
              califInt = "Conformidad";
            }
            console.log(`Conf: ${planConf}, No Conf Baja: ${planNoConfBaja}, No Conf Alta: ${planNoConfAlta}, Sin calificación: ${planSinCalif}, Calificación Proyecto: ${califInt}`);
            const data = {
              planConf,
              planNoConfBaja,
              planNoConfAlta,
              planSinCalif,
              califInterna: califInt,
            };
            await db.collection("proyectos").doc(proyecto.id).update(data);
            proyectos[b] = {...proyecto, ...data};
            planConf = 0, planNoConfBaja = 0, planNoConfAlta = 0, planSinCalif = 0, califInt = "";
            switch (proyectos[b].califInterna) {
              case "Conformidad":
                proyConf++;
                break;
              case "No Conformidad Baja":
                proyNoConfBaja++;
                break;
              case "No Conformidad Alta":
                proyNoConfAlta++;
                break;
              default:
                proySinCalif++;
                break;
            }
          }
        }
        if (proyNoConfAlta >= 1 && proyNoConfBaja == 0 && proyConf == 0) {
          califInt = "No Conformidad Alta";
        } else if (proyNoConfAlta == 1) {
          califInt = "No Conformidad Baja";
        } else if (proyNoConfAlta == 2) {
          califInt = "No Conformidad Alta";
        } else if (proyNoConfBaja >= 1) {
          califInt = "No Conformidad Baja";
        } else if (proyNoConfAlta == 0 && proyNoConfBaja == 0 && proyConf == 0) {
          califInt = "Sin Calificación";
        } else {
          califInt = "Conformidad";
        }
        console.log(`Conf: ${proyConf}, No Conf Baja: ${proyNoConfBaja}, No Conf Alta: ${proyNoConfAlta}, Sin calificación: ${proySinCalif}, Calificación Institucion: ${califInt}`);
        const data = {
          proyConf,
          proyNoConfBaja,
          proyNoConfAlta,
          proySinCalif,
          califInterna: califInt,
        };
        await db.collection("institucion").doc(empresa.id).update(data);
        empresas[a] = {...empresa, ...data};
        proyConf = 0, proyNoConfBaja = 0, proyNoConfAlta = 0, proySinCalif = 0, califInt = "";
        switch (empresas[a].califInterna) {
          case "Conformidad":
            instConf++;
            break;
          case "No Conformidad Baja":
            InstNoConfBaja++;
            break;
          case "No Conformidad Alta":
            InstNoConfAlta++;
            break;
          default:
            instSinCalif++;
            break;
        }
      }
    }
    if (InstNoConfAlta >= 1 && InstNoConfBaja == 0 && instConf == 0) {
      califInt = "No Conformidad Alta";
    } else if (InstNoConfAlta == 1) {
      califInt = "No Conformidad Baja";
    } else if (InstNoConfAlta == 2) {
      califInt = "No Conformidad Alta";
    } else if (InstNoConfBaja >= 1) {
      califInt = "No Conformidad Baja";
    } else if (InstNoConfAlta == 0 && InstNoConfBaja == 0 && instConf == 0) {
      califInt = "Sin Calificación";
    } else {
      califInt = "Conformidad";
    }
    console.log(`Conf: ${instConf}, No Conf Baja: ${InstNoConfBaja}, No Conf Alta: ${InstNoConfAlta}, Sin calificación: ${instSinCalif}, Calificación Consultora: ${califInt}`);
    const data = {
      instConf,
      InstNoConfBaja,
      InstNoConfAlta,
      instSinCalif,
      califInterna: califInt,
    };
    await db.collection("consultora").doc(consultora.id).update(data);
    consultoras[i] = {...consultora, ...data};
    instConf = 0, InstNoConfBaja = 0, InstNoConfAlta = 0, instSinCalif = 0, califInt = "";
  }
  res.send({status: "Success!", message: "Completado"});
};

exports.actConf = onRequest(actConf);
