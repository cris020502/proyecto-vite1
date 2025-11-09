document.addEventListener('DOMContentLoaded', () => {
  const agregarBtn = document.getElementById('agregarPersonaBtn');
  const tableBody = document.getElementById('personaTableBody');
  const form = document.getElementById('personaForm');
  const camposRequeridos = document.querySelectorAll('[data-requerido="true"]');
  const seccionFiltros = document.getElementById('seccionFiltros');
  const filtroNacionalidadInput = document.getElementById('filtroNacionalidad');

  const todosLosCampos = [
    'nombre', 'apellidoPaterno', 'apellidoMaterno', 'edad', 'estatura',
    'nacionalidad', 'colorPiel', 'complejion', 'profesion', 'gradoEstudios',
    'estadoCivil', 'lugarTrabajo', 'empresa', 'tieneINE', 'tienePasaporte',
    'representante', 'telefonoTrabajo'
  ];

  function validarFormulario() {
    let esValido = true;
    camposRequeridos.forEach(input => input.classList.remove('campo-invalido'));

    camposRequeridos.forEach(input => {
      if (input.value.trim() === '' || (input.tagName === 'SELECT' && input.value === '')) {
        input.classList.add('campo-invalido');
        esValido = false;
      }
    });

    if (!esValido) alert('Rellene todos los campos marcados en rojo.');
    return esValido;
  }

  const API_URL = "https://gestion-personas-backend.onrender.com/api/personas";

async function agregarPersona() {
  if (!validarFormulario()) return;

  const data = {};
  todosLosCampos.forEach(id => data[id] = document.getElementById(id).value);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al guardar en la base de datos");

    const result = await res.json();
    alert("✅ Persona guardada correctamente");
    console.log("Guardado en MongoDB:", result);
  } catch (error) {
    console.error(error);
    alert("⚠️ Error al guardar los datos");
  }

  form.reset();
}



  function filtrarTabla() {
    const filtroEstatura = parseFloat(document.getElementById('filtroEstatura').value) || 0;
    const filtroEdad = parseInt(document.getElementById('filtroEdad').value) || 0;
    const filtroProfesion = document.getElementById('filtroProfesion').value.toLowerCase();
    const filtroEstadoCivil = document.getElementById('filtroEstadoCivil').value;
    const filtroNacionalidad = document.getElementById('filtroNacionalidad').value.toLowerCase();

    tableBody.querySelectorAll('tr').forEach(fila => {
      const estaturaFila = parseFloat(fila.getAttribute('data-estatura')) || 0;
      const edadFila = parseInt(fila.getAttribute('data-edad')) || 0;
      const profesionFila = fila.getAttribute('data-profesion').toLowerCase();
      const estadoCivilFila = fila.getAttribute('data-estadocivil');
      const nacionalidadFila = fila.getAttribute('data-nacionalidad').toLowerCase();

      const pasaEstatura = estaturaFila >= filtroEstatura;
      const pasaEdad = edadFila >= filtroEdad;
      const pasaProfesion = profesionFila.includes(filtroProfesion);
      const pasaNacionalidad = nacionalidadFila.includes(filtroNacionalidad);
      const pasaEstadoCivil = (filtroEstadoCivil === 'Todos' || estadoCivilFila === filtroEstadoCivil);

      fila.style.display = (pasaEstatura && pasaEdad && pasaProfesion && pasaNacionalidad && pasaEstadoCivil)
        ? ''
        : 'none';
    });
  }

  function manejarClicksTabla(e) {
    const elemento = e.target;
    const fila = elemento.closest('tr');

    if (elemento.classList.contains('btn-eliminar')) {
      fila.remove();
      return;
    }

    if (elemento.classList.contains('btn-editar')) {
      todosLosCampos.forEach(id => {
        document.getElementById(id).value = fila.getAttribute(`data-${id}`);
      });
      fila.remove();
    }
  }

  agregarBtn.addEventListener('click', agregarPersona);
  tableBody.addEventListener('click', manejarClicksTabla);

  seccionFiltros.addEventListener('keyup', e => {
    if (e.target.id !== 'filtroNacionalidad') filtrarTabla();
  });

  filtroNacionalidadInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') filtrarTabla();
  });

  seccionFiltros.addEventListener('change', e => {
    if (e.target.tagName === 'SELECT') filtrarTabla();
  });
});
