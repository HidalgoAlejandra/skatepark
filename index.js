// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const secretKey = "Shhhh";

//Importando funcion desde el modulo consultas.js
const {
  agregar,
  todos,
  editar,
  eliminar,
  editarestado,
  login,
} = require("./consultas/consultas.js");
//middleware para recibir desde el front como json
app.use(express.json());

// Server
app.listen(3000, () => console.log("Servidor encendido PORT 3000!"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.use(
  expressFileUpload({
    limits: 5000000,
    abortOnLimit: true,
    responseOnLimit: "El tamaño de la imagen supera el límite permitido",
  })
);
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: `${__dirname}/views/mainLayout`,
  })
);
app.set("view engine", "handlebars");

// Home participantes
app.get("/", async (req, res) => {
  try {
    const skaters = await todos(); //trae todos los registros
    //console.log("Respuesta de la funcion todos: ", skaters);
    res.render("Home", { skaters });
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500,
    });
  }
});
//Registro formulario
app.get("/registro", (req, res) => {
  res.render("Registro");
});

app.get("/perfil", (req, res) => {
  const { token } = req.query;
  jwt.verify(token, secretKey, (err, skater) => {
    if (err) {
      res.status(500).send({
        error: `Algo salió mal...`,
        message: err.message,
        code: 500,
      });
    } else {
      res.render("Perfil", { skater });
    }
  });
});

//Login
app.get("/login", (req, res) => {
  res.render("Login");
});
//Login valida si existe
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("login: ", req.body);
    const skater = await login(email, password); //si existe
    console.log("Respuesta de login: ", skater);

    const token = jwt.sign(skater, secretKey);
    res.status(200).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500,
    });
  }
});
//Admin listado
app.get("/Admin", async (req, res) => {
  try {
    const skaters = await todos(); //trae todos los registros
    res.render("Admin", { skaters });
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500,
    });
  }
});

// API REST de Skaters
//Actualizada
app.get("/skaters", async (req, res) => {
  try {
    const skaters = await todos(); //trae todos los registros
    res.status(200).send(skaters);
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500,
    });
  }
});
//Registro en base datos
app.post("/skaters", async (req, res) => {
  const skater = req.body;
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No se encontro ningun archivo en la consulta");
  }
  const { files } = req;
  const { foto } = files;
  const { name } = foto;
  const pathPhoto = `/uploads/${name}`;

  console.log("Valor del req.body: ", skater);
  console.log("Nombre de imagen: ", name);
  console.log("Ruta donde subir la imagen: ", pathPhoto);

  foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
    try {
      if (err) throw err;
      skater.foto = pathPhoto;
      const skaters = await agregar(
        skater.email,
        skater.nombre,
        skater.password,
        skater.anos_experiencia,
        skater.especialidad,
        skater.foto,
        false
      );
      console.log("Valor devuelto por la funcion de base de datos: ", skaters);
      res.status(201).redirect("/");
    } catch (e) {
      console.log(e);
      res.status(500).send({
        error: `Algo salió mal... ${e}`,
        code: 500,
      });
    }
  });
});

//actualizar skater desde perfil
app.put("/skaters", async (req, res) => {
  const { id, nombre, anos_experiencia, especialidad } = req.body;
  console.log("Valor del body: ", id, nombre, anos_experiencia, especialidad);
  try {
    const skaterB = await editar(id, nombre, anos_experiencia, especialidad);
    res.status(200).send("Datos actualizados con éxito");
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500,
    });
  }
});
//Admin cambiar estado skater
app.put("/skaters/status/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  console.log("Valor de estado recibido por body: ", estado);
  try {
    const skaters = await editarestado(id, estado);
    console.log("Skater Actualizado: ", skaters);
    res.status(200).send("Estado Actualizado con éxito");
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500,
    });
  }
});
//Eliminar skater
app.delete("/skaters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const skaterB = await eliminar(id);
    if (skaterB !== -1) {
      res.status(200).send("Skater Eliminado con éxito");
    } else {
      res.status(400).send("No existe este Skater");
    }
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal... ${e}`,
      code: 500,
    });
  }
});
