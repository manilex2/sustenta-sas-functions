/* eslint-disable max-len */
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const {getFirestore, GeoPoint} = require("firebase-admin/firestore");
const XLSX = require("xlsx");
const proj4 = require("proj4");

admin.initializeApp();
setGlobalOptions({
  maxInstances: 10,
  timeoutSeconds: 540,
  memory: "1GiB",
});

const initApp = async (req, res) => {
  proj4.defs("EPSG:32717", "+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs");
  const utm = proj4("EPSG:32717");
  const auth = admin.auth();
  const db = getFirestore();
  const batch = db.batch();
  const excel = XLSX.read(await (await fetch(`${req.body.excelURL}`)).arrayBuffer());
  //  const excel = XLSX.readFile("/Users/danneira/Desktop/Proyectos/sustenta-sas-functions/functions/initApp/Plan de Manejo Ambiental Plantilla (Dev).xlsx", {});
  const nombreHoja = excel.SheetNames;
  let consultoras = [];
  let instituciones;
  let responsables;
  let proyectos;
  let planes;
  let programas;
  let medidas;
  let tareas;
  let iconos;
  let consultDoc;
  if (!req.body.consultId) {
    consultoras = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);
    instituciones = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[1]]);
    responsables = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[2]]);
    proyectos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[3]]);
    planes = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[4]]);
    programas = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[5]]);
    medidas = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[6]]);
    tareas = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[7]]);
    iconos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[9]]);
    for (let j = consultoras.length - 1; j >= 0; j--) {
      delete consultoras[j].LEYENDA;
      delete consultoras[j].__EMPTY_1;
      if (Object.entries(consultoras[j]).length === 0) {
        delete consultoras[j];
      }
      if (consultoras[j] === undefined) {
        consultoras.splice(j, 1);
      }
    }
  } else {
    consultDoc = await db.collection("consultora").doc(`${req.body.consultId}`).get();
    consultoras.push(consultDoc);
    instituciones = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);
    responsables = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[1]]);
    proyectos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[2]]);
    planes = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[3]]);
    programas = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[4]]);
    medidas = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[5]]);
    tareas = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[6]]);
    iconos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[8]]);
  }
  const users = (await db.collection("users").get()).docs.map((user) => {
    return user.data();
  });
  for (let j = instituciones.length - 1; j >= 0; j--) {
    delete instituciones[j].LEYENDA;
    delete instituciones[j].__EMPTY_1;
    if (Object.entries(instituciones[j]).length === 0) {
      delete instituciones[j];
    }
    if (instituciones[j] === undefined) {
      instituciones.splice(j, 1);
    }
  }
  for (let j = proyectos.length - 1; j >= 0; j--) {
    delete proyectos[j].LEYENDA;
    delete proyectos[j].__EMPTY_1;
    if (Object.entries(proyectos[j]).length === 0) {
      delete proyectos[j];
    }
    if (proyectos[j] === undefined) {
      proyectos.splice(j, 1);
    }
  }
  for (let j = responsables.length - 1; j >= 0; j--) {
    delete responsables[j].LEYENDA;
    delete responsables[j].__EMPTY_1;
    if (Object.entries(responsables[j]).length === 0) {
      delete responsables[j];
    }
    if (responsables[j] === undefined) {
      responsables.splice(j, 1);
    }
  }
  for (let j = planes.length - 1; j >= 0; j--) {
    delete planes[j].LEYENDA;
    delete planes[j].__EMPTY_1;
    if (Object.entries(planes[j]).length === 0) {
      delete planes[j];
    }
    if (planes[j] === undefined) {
      planes.splice(j, 1);
    }
  }
  for (let j = programas.length - 1; j >= 0; j--) {
    delete programas[j].LEYENDA;
    delete programas[j].__EMPTY_1;
    if (Object.entries(programas[j]).length === 0) {
      delete programas[j];
    }
    if (programas[j] === undefined) {
      programas.splice(j, 1);
    }
  }
  for (let j = medidas.length - 1; j >= 0; j--) {
    delete medidas[j].LEYENDA;
    delete medidas[j].__EMPTY_1;
    if (Object.entries(medidas[j]).length === 0) {
      delete medidas[j];
    }
    if (medidas[j] === undefined) {
      medidas.splice(j, 1);
    }
  }
  for (let j = tareas.length - 1; j >= 0; j--) {
    delete tareas[j].LEYENDA;
    delete tareas[j].__EMPTY_1;
    if (Object.entries(tareas[j]).length === 0) {
      delete tareas[j];
    }
    if (tareas[j] === undefined) {
      tareas.splice(j, 1);
    }
  }
  for (let consultora of consultoras) {
    consultora = {
      ...consultora,
      instConf: 0,
      InstNoConfBaja: 0,
      InstNoConfAlta: 0,
      instSinCalif: 0,
      califInterna: "Sin Calificación",
    };
    let newConsultRef;
    if (!req.body.consultId) {
      newConsultRef = db.collection("consultora").doc();
      batch.set(newConsultRef, consultora);
    }
    for (let institucion of instituciones) {
      if (consultora.nombre == institucion.consultora) {
        delete institucion.consultora;
        institucion = {
          ...institucion,
          idConsultora: newConsultRef? newConsultRef : consultDoc.ref,
          proyConf: 0,
          proyNoConfBaja: 0,
          proyNoConfAlta: 0,
          proySinCalif: 0,
          califInterna: "Sin Calificación",
        };
        const newInstRef = db.collection("institucion").doc();
        batch.set(newInstRef, institucion);
        for (let responsable of responsables) {
          responsable = {
            ...responsable,
            consultId: newConsultRef? newConsultRef : consultDoc.ref,
            contingencia: false,
          };
          const user = {
            email: responsable.email,
            displayName: responsable.display_name,
            password: "sustenta2023",
          };
          if (institucion.nombre == responsable.empresa) {
            responsable = {
              ...responsable,
              instId: newInstRef,
            };
            const created = users.some((resp) => resp.email === user.email);
            if (!created && responsable.rol == "empresa") {
              const newRespRef = db.collection("users").doc();
              try {
                const usuario = await auth.createUser({...user, uid: `${newRespRef.id}`});
                console.log("Usuario creado con éxito:", usuario.uid);
                responsable = {
                  ...responsable,
                  uid: usuario.uid,
                  created_time: new Date(usuario.metadata.creationTime),
                };
                users.push({id: newRespRef, ...responsable});
                batch.set(newRespRef, responsable);
              } catch (error) {
                console.error("Error al crear usuario:", error);
              }
            }
          }
          const created = users.some((resp) => resp.email === user.email);

          if (!created && responsable.rol != "empresa") {
            const newRespRef = db.collection("users").doc();
            try {
              const usuario = await auth.createUser({...user, uid: `${newRespRef.id}`});
              console.log("Usuario creado con éxito:", usuario.uid);
              responsable = {
                ...responsable,
                uid: usuario.uid,
                created_time: new Date(usuario.metadata.creationTime),
              };
              users.push({id: newRespRef, ...responsable});
              batch.set(newRespRef, responsable);
            } catch (error) {
              console.error("Error al crear usuario:", error);
            }
          }
        }
        for (let proyecto of proyectos) {
          if (institucion.nombre == proyecto.empresa) {
            delete proyecto.empresa;
            const listaLatLong = proyecto.coordGeo.split(" ");
            const arrayFiltrado = listaLatLong.filter((valor) => {
              if (valor === null || valor === undefined || valor === 0 || valor === false) {
                return false;
              }
              if (typeof valor === "string" && valor.trim() === "") {
                return false;
              }
              return true;
            });
            const newlistaLatLong = arrayFiltrado.map((latlong) => {
              return parseFloat(latlong.trim());
            });
            const xUtm = newlistaLatLong[0];
            const yUtm = newlistaLatLong[1];
            const [lon, lat] = utm.inverse([xUtm, yUtm]);
            const geoPoint = new GeoPoint(lat, lon);
            const utcDays = Math.floor((proyecto.fechaFinProy + 1) - 25569);
            proyecto = {
              ...proyecto,
              institucionId: newInstRef,
              consultoraId: newConsultRef? newConsultRef : consultDoc.ref,
              planConf: 0,
              planNoConfBaja: 0,
              planNoConfAlta: 0,
              planSinCalif: 0,
              califInterna: "Sin Calificación",
              idUniProy: `${proyecto.idUniProy}`,
              fechaFinProy: new Date(utcDays * 86400 * 1000),
              coordGeo: geoPoint,
            };
            for (const icon of iconos) {
              if (proyecto.icon == icon.nombre) {
                proyecto = {
                  ...proyecto,
                  icon: icon.url,
                };
              }
            }
            const newProyRef = db.collection("proyectos").doc();
            batch.set(newProyRef, proyecto);
            for (let plan of planes) {
              if (proyecto.nombre == plan.proyecto) {
                delete plan.proyecto;
                plan = {
                  ...plan,
                  institucionId: newInstRef,
                  consultoraId: newConsultRef? newConsultRef : consultDoc.ref,
                  proyId: newProyRef,
                  progConf: 0,
                  progNoConfBaja: 0,
                  progNoConfAlta: 0,
                  progSinCalif: 0,
                  numDocs: 0,
                  numVid: 0,
                  numImg: 0,
                  califInterna: "Sin Calificación",
                  navPosition: plan.posicion,
                };
                delete plan.posicion;
                for (const icon of iconos) {
                  if (plan.icon == icon.nombre) {
                    plan = {
                      ...plan,
                      icon: icon.url,
                    };
                  }
                }
                const newPlanRef = db.collection("planMedAmb").doc();
                batch.set(newPlanRef, plan);
                for (let programa of programas) {
                  if (plan.nombre == programa.plan) {
                    const listaLugares = programa.lugar.split(",");
                    const newlistaLugares = listaLugares.map((lugar) => {
                      return lugar.trim();
                    });
                    programa = {
                      ...programa,
                      institucionId: newInstRef,
                      consultoraId: newConsultRef? newConsultRef : consultDoc.ref,
                      proyId: newProyRef,
                      planId: newPlanRef,
                      presupuesto: programa.tipoPresupuesto == "programa"? parseFloat(programa.presupuesto) : 0.00,
                      medConf: 0,
                      medNoConfBaja: 0,
                      medNoConfAlta: 0,
                      medSinCalif: 0,
                      numDocs: 0,
                      numVid: 0,
                      numImg: 0,
                      califInterna: "Sin Calificación",
                      lugar: newlistaLugares,
                    };
                    for (let i = 0; i < users.length; i++) {
                      const user = users[i];
                      if (programa.responsable == user.display_name) {
                        programa = {
                          ...programa,
                          responsable: user.id,
                        };
                      }
                    }
                    const newProgRef = db.collection("programas").doc();
                    batch.set(newProgRef, programa);
                    for (let medida of medidas) {
                      if (programa.nombre == medida.programa) {
                        const utcDays = Math.floor((medida.fechaFin + 1) - 25569);
                        medida = {
                          ...medida,
                          institucionId: newInstRef,
                          consultoraId: newConsultRef? newConsultRef : consultDoc.ref,
                          proyId: newProyRef,
                          planId: newPlanRef,
                          programaId: newProgRef,
                          presupuesto: programa.tipoPresupuesto == "medida"? parseFloat(medida.presupuesto) : 0.00,
                          calificacionInterna: "Sin Calificación",
                          implementada: false,
                          fechaFinalizacion: new Date(utcDays * 86400 * 1000),
                          aspectoAmbiental: medida.aspAmb,
                          impactoIdentificado: medida.impIdent,
                          orden: medida.posicion,
                        };
                        for (let i = 0; i < users.length; i++) {
                          const user = users[i];
                          if (medida.responsable == user.display_name) {
                            medida = {
                              ...medida,
                              responsable: user.id,
                            };
                          }
                        }
                        const newMedRef = db.collection("medidas").doc();
                        batch.set(newMedRef, medida);
                        for (const tarea of tareas) {
                          if (medida.nombre == tarea.medida) {
                            const listaTareas = tarea.tareas.split("-");
                            listaTareas.shift();
                            const newlistaTareas = listaTareas.map((tarea) => {
                              return tarea.trim();
                            });
                            for (let i = 0; i < newlistaTareas.length; i++) {
                              let tareaElem = newlistaTareas[i];
                              tareaElem = {
                                nombre: tareaElem,
                                completada: false,
                                orden: i+1,
                                medidaId: newMedRef,
                                programaId: newProgRef,
                                planId: newPlanRef,
                                proyId: newProyRef,
                                institucionId: newInstRef,
                                consultoraId: newConsultRef? newConsultRef : consultDoc.ref,
                              };
                              if (tarea.presupuesto) {
                                const listaPresupuesto = tarea.presupuesto.split("-");
                                listaPresupuesto.shift();
                                const newlistaPresupuesto = listaPresupuesto.map((presupuesto) => {
                                  return presupuesto.trim();
                                });
                                tareaElem = {
                                  ...tareaElem,
                                  presupuesto: programa.tipoPresupuesto == "tarea"? parseFloat(newlistaPresupuesto[i]) : parseFloat(0.00),
                                };
                              } else {
                                tareaElem = {
                                  ...tareaElem,
                                  presupuesto: parseFloat(0.00),
                                };
                              }
                              const newTareaRef = db.collection("tareas").doc();
                              batch.set(newTareaRef, tareaElem);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  try {
    await batch.commit();
    console.log("Documentos agregados exitosamente");
    res.status(200).send({status: "Success!", message: "Función ejecutada correctamente"});
  } catch (error) {
    console.error("Error al agregar documentos:", error);
    res.status(423).send({status: "Error!", message: error.message});
  }
};

exports.initApp = onRequest(initApp);
