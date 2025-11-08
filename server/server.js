import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión con MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Definir el esquema de persona
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

// Modelo basado en el esquema
const Persona = mongoose.model("Persona", personaSchema);

// 📩 Crear (POST)
app.post("/api/personas", async (req, res) => {
  try {
    const persona = new Persona(req.body);
    await persona.save();
    res.status(201).json({ message: "Persona agregada con éxito", persona });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📋 Leer (GET)
app.get("/api/personas", async (req, res) => {
  const personas = await Persona.find();
  res.json(personas);
});

// 📝 Actualizar (PUT)
app.put("/api/personas/:id", async (req, res) => {
  try {
    const persona = await Persona.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🗑️ Eliminar (DELETE)
app.delete("/api/personas/:id", async (req, res) => {
  try {
    await Persona.findByIdAndDelete(req.params.id);
    res.json({ message: "Persona eliminada" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Servidor escuchando
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
