const { Client } = require("pg");
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./pool");

//Middlewere
app.use(cors({
  origin: 'http://localhost:4200' 
}));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());


//import routes
const registroUsuarioRoute = require("./routes/registroUsuario");
const gestionCuentaRoute = require("./routes/gestionCuenta");
const categoryRoute = require("./routes/categoriesManagement");
const favoriteInstitutionRoute = require("./routes/favoriteInstitutionsManagement");
const tenderSavedRoute = require("./routes/tenderManagement");
const notificationsCenterRoute = require("./routes/notificationsCenter");

app.use("/category", categoryRoute);
app.use("/institutions", favoriteInstitutionRoute);
app.use("/registroUsuario", registroUsuarioRoute);
app.use("/gestionCuenta", gestionCuentaRoute);
app.use("/tenders", tenderSavedRoute);
app.use("/notificationsCenter", notificationsCenterRoute);


pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
// server listing in port 3000
app.listen(3000);
