//npm i pg

const { Pool } = require("pg");

const config = {
  host: "localhost",
  database: "skatepark",
  user: "postgres",
  password: "postgres",
  port: 5432,
};

const pool = new Pool(config);

const agregar = async (
  email,
  nombre,
  password,
  anos_experiencia,
  especialidad,
  foto,
  estado
) => {
  console.log(
    "Valores recibidos: ",
    email,
    nombre,
    password,
    anos_experiencia,
    especialidad,
    foto,
    estado
  );
  try {
    const result = await pool.query({
      text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      values: [
        email,
        nombre,
        password,
        anos_experiencia,
        especialidad,
        foto,
        estado,
      ],
    });
    return result.rows[0];
  } catch (err) {
    console.error("Codigo del error: ", err.code);
  }
};
//home y Admin lista de participantes
const todos = async () => {
  try {
    const result = await pool.query({
      text: "SELECT * FROM skaters",
    });
    return result.rows;
  } catch (err) {
    console.error("Codigo del error: ", err.code);
  }
};

//funcion para login un skater
const login = async (email, password) => {
  try {
    const result = await pool.query({
      text: "SELECT * FROM skaters WHERE email = $1 AND password = $2 ",
      values: [email, password],
    });
    return result.rows[0];
  } catch (err) {
    console.error("Codigo del error: ", err.code);
  }
};
//funcion para eliminar un skater
const eliminar = async (id) => {
  try {
    const result = await pool.query({
      text: "DELETE FROM skaters WHERE id = $1 RETURNING *",
      values: [id],
    });
    return result.rows[0];
  } catch (err) {
    console.error("Codigo del error: ", err.code);
  }
};

//funcion para editar un skater de perfil
const editar = async (id, nombre, anos_experiencia, especialidad) => {
  try {
    const result = await pool.query({
      text: "UPDATE skaters SET nombre = $2, anos_experiencia = $3, especialidad =$4 WHERE id = $1 RETURNING *",
      values: [id, nombre, anos_experiencia, especialidad],
    });
    return result.rows[0];
  } catch (err) {
    console.error("Codigo del error: ", err.code);
  }
};

//funcion para editar estado de skater
const editarestado = async (id, estado) => {
  try {
    const result = await pool.query({
      text: "UPDATE skaters SET estado = $2 WHERE id = $1 RETURNING *",
      values: [id, estado],
    });
    return result.rows[0];
  } catch (err) {
    console.error("Codigo del error: ", err.code);
  }
};

module.exports = { agregar, todos, eliminar, editar, editarestado, login };
