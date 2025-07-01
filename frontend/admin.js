const API_URL = 'https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod';

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const btnOpenCreate = document.getElementById('btn-open-create');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');
const form = document.getElementById('class-form');

window.onload = loadClasses;

async function loadClasses() {
  try {
    const res = await fetch(`${API_URL}/classes`);
    const classes = await res.json();

    const container = document.getElementById('admin-class-list');
    container.innerHTML = '';

    classes.forEach(cls => {
      const item = document.createElement('div');
      item.className = 'class-item';

      item.innerHTML = `
        <h3>${cls.icon || '🧘'} ${cls.name}</h3>
        <p>Instructor: ${cls.instructor || 'No definido'}</p>
        <p>Cupo: ${cls.current_capacity}/${cls.max_capacity}</p>
        <div class="class-actions">
          <button onclick='editClass(${JSON.stringify(cls)})'>✏️ Editar</button>
          <button class="delete" onclick='deleteClass("${cls.class_id}")'>🗑️ Eliminar</button>
        </div>
      `;

      container.appendChild(item);
    });
  } catch (err) {
    console.error('Error al cargar clases:', err);
  }
}

function openModal(mode = 'create', data = {}) {
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modalTitle.textContent = mode === 'edit' ? 'Editar Clase' : 'Agregar Clase';

  form['class-id'].value = data.class_id || '';
  form['name'].value = data.name || '';
  form['instructor'].value = data.instructor || '';
  form['max_capacity'].value = data.max_capacity || '';
  form['current_capacity'].value = data.current_capacity || '';
  form['icon'].value = data.icon || '';
}

function closeModal() {
  modal.style.display = 'none';
  modal.classList.add('hidden');
  form.reset();
}

function editClass(cls) {
  openModal('edit', cls);
}

async function deleteClass(class_id) {
  if (!confirm('¿Estás seguro de eliminar esta clase?')) return;

  try {
    const res = await fetch(`${API_URL}/classes`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id })
    });

    const result = await res.json();
    alert(result.message || 'Clase eliminada');
    loadClasses();
  } catch (err) {
    console.error('Error al eliminar clase:', err);
    alert('Error al eliminar clase');
  }
}

// Botón para abrir modal de creación
btnOpenCreate.addEventListener('click', () => openModal('create'));

// Botón para cancelar/cerrar modal
btnCancel.addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Guardar (crear o actualizar)
btnSave.addEventListener('click', async () => {
  const classData = {
    class_id: form['class-id'].value,
    name: form['name'].value,
    instructor: form['instructor'].value,
    max_capacity: parseInt(form['max_capacity'].value || '10'),
    current_capacity: parseInt(form['current_capacity'].value || '0'),
    icon: form['icon'].value
  };

  const isEdit = !!classData.class_id;
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const response = await fetch(`${API_URL}/classes`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || (isEdit ? 'Clase actualizada' : 'Clase creada'));
      closeModal();
      loadClasses();
    } else {
      alert(result.error || 'Error al guardar la clase');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    alert('Error al guardar la clase');
  }
});