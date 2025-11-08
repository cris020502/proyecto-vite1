import mongoose from 'mongoose';

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
  telefonoTrabajo: String
});

export default mongoose.model('Persona', personaSchema);
