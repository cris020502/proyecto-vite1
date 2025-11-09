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

  let editandoId = null; // 🔹 nuevo: para saber si estamos editando

  // 🟢 Validación del formulario
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

  // 🟢 Cargar personas desde la base de datos
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

  // 🟢 Renderizar tabla
  function renderTabla(personas) {
    tableBody.innerHTML = "";

    personas.forEach(persona => {
      const fila = document.createElement("tr");

      fila.setAttribute("data-id", persona._id);
      // Guardar todos los campos
      todosLosCampos.forEach(campo => {
        fila.setAttribute(`data-${campo.toLowerCase()}`, persona[campo] ?? "");
      });

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

  // 🟢 Agregar o editar persona
  async function agregarPersona() {
    if (!validarFormulario()) return;

    const data = {};
    todosLosCampos.forEach(id => data[id] = document.getElementById(id).value);

    try {
      const url = editandoId
        ? `${API_BASE_URL}/api/personas/${editandoId}`
        : `${API_BASE_URL}/api/personas`;

      const metodo = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al guardar en la base de datos");

      alert(editandoId ? "✏️ Persona actualizada" : "✅ Persona guardada correctamente");
      form.reset();
      editandoId = null;
      await cargarPersonas();
    } catch (error) {
      console.error(error);
      alert("⚠️ Error al guardar los datos");
    }
  }

  // 🟢 Eliminar y editar
  async function manejarClicksTabla(e) {
    const elemento = e.target;
    const fila = elemento.closest('tr');
    const id = fila.getAttribute("data-id");

    if (elemento.classList.contains('btn-eliminar')) {
      if (confirm("¿Seguro que deseas eliminar esta persona?")) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/personas/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Error al eliminar");
          alert("🗑️ Persona eliminada");
          await cargarPersonas();
        } catch (error) {
          console.error(error);
          alert("⚠️ Error al eliminar");
        }
      }
      return;
    }

    if (elemento.classList.contains('btn-editar')) {
      editandoId = id;
      todosLosCampos.forEach(idCampo => {
        document.getElementById(idCampo).value = fila.getAttribute(`data-${idCampo.toLowerCase()}`) || "";
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // 🟢 Filtro
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

  // 🟢 Eventos
  agregarBtn.addEventListener('click', agregarPersona);
  tableBody.addEventListener('click', manejarClicksTabla);
  seccionFiltros.addEventListener('keyup', filtrarTabla);
  filtroNacionalidadInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') filtrarTabla();
  });
  seccionFiltros.addEventListener('change', e => {
    if (e.target.tagName === 'SELECT') filtrarTabla();
  });

  // 🟢 Cargar al inicio
  cargarPersonas();
});
