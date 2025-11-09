document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = "https://proyecto-vite1.onrender.com"; // tu backend Render
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

  // 🔹 NUEVO: Cargar personas desde la base de datos
  async function cargarPersonas() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/personas`);
      if (!res.ok) throw new Error("Error al cargar personas");
      const personas = await res.json();
      renderTabla(personas);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  // 🔹 Renderizar tabla
  function renderTabla(personas) {
    tableBody.innerHTML = "";
    personas.forEach(persona => {
      const fila = document.createElement("tr");
      fila.setAttribute("data-estatura", persona.estatura);
      fila.setAttribute("data-edad", persona.edad);
      fila.setAttribute("data-profesion", persona.profesion);
      fila.setAttribute("data-estadocivil", persona.estadoCivil);
      fila.setAttribute("data-nacionalidad", persona.nacionalidad);

      fila.innerHTML = `
        <td>${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}</td>
        <td>${persona.edad}</td>
        <td>${persona.estatura}</td>
        <td>${persona.profesion}</td>
        <td>${persona.estadoCivil}</td>
        <td>${persona.nacionalidad}</td>
        <td>
          <button class="btn-editar">Editar</button>
          <button class="btn-eliminar">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(fila);
    });
  }

  // 🔹 Agregar persona
  async function agregarPersona() {
    if (!validarFormulario()) return;

    const data = {};
    todosLosCampos.forEach(id => data[id] = document.getElementById(id).value);

    try {
      const res = await fetch(`${API_BASE_URL}/api/personas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al guardar en la base de datos");

      alert("✅ Persona guardada correctamente");
      form.reset();
      await cargarPersonas(); // 🔹 Recargar tabla
    } catch (error) {
      console.error(error);
      alert("⚠️ Error al guardar los datos");
    }
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

  // 🔹 Eventos
  agregarBtn.addEventListener('click', agregarPersona);
  tableBody.addEventListener('click', manejarClicksTabla);
  seccionFiltros.addEventListener('keyup', filtrarTabla);
  filtroNacionalidadInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') filtrarTabla();
  });
  seccionFiltros.addEventListener('change', e => {
    if (e.target.tagName === 'SELECT') filtrarTabla();
  });

  // 🔹 Cargar al inicio
  cargarPersonas();
});
