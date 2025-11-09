import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// -----------------------------------------------------------
// 1. DEFINIR 'app' (Instanciar Express) - ¡DEBE SER LO PRIMERO!
const app = express();
// -----------------------------------------------------------

// -----------------------------------------------------------
// 2. MIDDLEWARE DE CONFIGURACIÓN
// -----------------------------------------------------------

// Middleware para procesar JSON en el cuerpo de las peticiones
app.use(express.json());

// Configuración ÚNICA y Específica de CORS
app.use(cors({
  // URL del frontend en Netlify (Asegura que solo este dominio pueda acceder)
  origin: "https://gestion1personas.netlify.app", 
  
  // Incluye todos los métodos que usas
  methods: ["GET", "POST", "PUT", "DELETE"], 
  
  // Permite el encabezado Content-Type que se usa para enviar JSON
  allowedHeaders: ["Content-Type"]
}));
// -----------------------------------------------------------


// Conexión con MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Esquema y modelo (Definición del Documento Persona)
const personaSchema = new mongoose.Schema({
  nombre: String,
  apellidoPaterno: String,
  apellidoMaterno: String,
  edad: Number,
  estatura: Number,
  nacionalidad: String,
  colorPiel: String,
  complejion: String,
  profesion: String,
  gradoEstudios: String,
  estadoCivil: String,
  lugarTrabajo: String,
  empresa: String,
  tieneINE: String,
  tienePasaporte: String,
  representante: String,
  telefonoTrabajo: String,
});

const Persona = mongoose.model("Persona", personaSchema);

// RUTAS CRUD DE LA API
// -----------------------------------------------------------------

// Ruta POST: Crear una nueva persona
// RUTA COMPLETA: /api/personas
app.post("/api/personas", async (req, res) => {
  try {
    const persona = new Persona(req.body);
    await persona.save();
    res.status(201).json({ message: "Persona agregada con éxito", persona });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta GET: Obtener todas las personas
app.get("/api/personas", async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Ruta PUT: Actualizar una persona por ID
app.put("/api/personas/:id", async (req, res) => {
  try {
    const persona = await Persona.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!persona) return res.status(404).json({ error: "Persona no encontrada" });
    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta DELETE: Eliminar una persona por ID
app.delete("/api/personas/:id", async (req, res) => {
  try {
    const result = await Persona.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Persona no encontrada para eliminar" });
    res.json({ message: "Persona eliminada con éxito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// -----------------------------------------------------------------

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));