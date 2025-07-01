const API_URL = 'https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod';

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

async function saveClass() {
  const class_id = document.getElementById('class_id').value;
  const name = document.getElementById('name').value;
  const instructor = document.getElementById('instructor').value;
  const max_capacity = parseInt(document.getElementById('max_capacity').value);
  const current_capacity = parseInt(document.getElementById('current_capacity').value);
  const icon = document.getElementById('icon').value;

  const payload = {
    class_id, name, instructor, max_capacity, current_capacity, icon
  };

  const url = `${API_URL}/classes`;
  const method = class_id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    alert(result.message || 'Operación realizada');
    resetForm();
    loadClasses();
  } catch (err) {
    console.error('Error al guardar clase:', err);
    alert('Error al guardar clase');
  }
}

function editClass(cls) {
  document.getElementById('class_id').value = cls.class_id || '';
  document.getElementById('name').value = cls.name || '';
  document.getElementById('instructor').value = cls.instructor || '';
  document.getElementById('max_capacity').value = cls.max_capacity || '';
  document.getElementById('current_capacity').value = cls.current_capacity || '';
  document.getElementById('icon').value = cls.icon || '';
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

function resetForm() {
  document.getElementById('class_id').value = '';
  document.getElementById('name').value = '';
  document.getElementById('instructor').value = '';
  document.getElementById('max_capacity').value = '';
  document.getElementById('current_capacity').value = '';
  document.getElementById('icon').value = '';
}

window.onload = loadClasses;