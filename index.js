const { Client } = require("pg");
const express = require("express");
const app = express();
const cors = require("cors");
const client = require("./client");

//Middlewere
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//import routes
const testRoute = require("./routes/test");
const registroUsuarioRoute = require("./routes/registroUsuario");
const gestionCuentaRoute = require("./routes/gestionCuenta");
const categoryRoute = require("./routes/categoriesManagement");
const favoriteInstitutionRoute = require("./routes/favoriteInstitutionsManagement");
const tenderSavedRoute = require("./routes/tenderManagement");
const notificationsCenterRoute = require("./routes/notificationsCenter");

app.use("/category", categoryRoute);
app.use("/institutions", favoriteInstitutionRoute);
app.use("/test", testRoute);
app.use("/registroUsuario", registroUsuarioRoute);
app.use("/gestionCuenta", gestionCuentaRoute);
app.use("/tenders", tenderSavedRoute);
app.use("/notificationsCenter", notificationsCenterRoute);

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log(
      "connected to postgresql database. Listen in port localhost:3000"
    );
  }
});

// server listing in port 3000
app.listen(3000);
