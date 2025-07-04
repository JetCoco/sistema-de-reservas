// admin.js
import { getUserInfo, requireRole } from './auth.js';
import { signOutRedirect } from './logout.js';

const apiBase = 'https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod';
let clientId, userId;

// Validar rol y obtener datos del usuario
(async () => {
  const { role, sub, client_id } = await getUserInfo();
  requireRole(role, 'admin');
  userId = sub;
  clientId = client_id;
  loadClasses();
})();

// Botón logout
document.getElementById('logout-btn').addEventListener('click', signOutRedirect);

// Botón para agregar clase
document.getElementById('add-class-btn').addEventListener('click', () => {
  openModal();
});

function loadClasses() {
  fetch(`${apiBase}/classes?client_id=${clientId}`)
    .then(res => res.json())
    .then(classes => {
      const container = document.getElementById('classes-list');
      container.innerHTML = '';

      classes.forEach(cls => {
        const div = document.createElement('div');
        div.className = 'class-card glass-card';
        div.innerHTML = `
          <h4>${cls.icon || '🧘'} ${cls.name}</h4>
          <p>Instructor: ${cls.instructor}</p>
          <p>Fecha y hora: ${cls.datetime}</p>
          <p>Capacidad: ${cls.current_capacity}/${cls.max_capacity}</p>
          <div class="actions">
            <button class="btn edit-btn">Editar</button>
            <button class="btn delete-btn">Eliminar</button>
          </div>
        `;

        div.querySelector('.edit-btn').addEventListener('click', () => openModal(cls));
        div.querySelector('.delete-btn').addEventListener('click', () => deleteClass(cls.class_id));
        container.appendChild(div);
      });
    });
}

function openModal(cls = null) {
  document.getElementById('modal-title').textContent = cls ? 'Editar Clase' : 'Agregar Clase';
  document.getElementById('class-name').value = cls?.name || '';
  document.getElementById('instructor-name').value = cls?.instructor || '';
  document.getElementById('class-datetime').value = cls?.datetime || '';
  document.getElementById('max-capacity').value = cls?.max_capacity || '';
  document.getElementById('class-icon').value = cls?.icon || '';

  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');

  document.getElementById('cancel-btn').onclick = () => modal.classList.add('hidden');
  document.getElementById('save-btn').onclick = () => {
    const body = {
      client_id: clientId,
      name: document.getElementById('class-name').value,
      instructor: document.getElementById('instructor-name').value,
      datetime: document.getElementById('class-datetime').value,
      max_capacity: parseInt(document.getElementById('max-capacity').value),
      icon: document.getElementById('class-icon').value
    };

    if (cls) {
      body.class_id = cls.class_id;
      fetch(`${apiBase}/classes`, {
        method: 'PUT',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(() => {
        modal.classList.add('hidden');
        loadClasses();
      });
    } else {
      fetch(`${apiBase}/classes`, {
        method: 'POST',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(() => {
        modal.classList.add('hidden');
        loadClasses();
      });
    }
  };
}

function deleteClass(classId) {
  if (!confirm('¿Seguro que deseas eliminar esta clase?')) return;

  fetch(`${apiBase}/classes`, {
    method: 'DELETE',
    headers: { 'Authorization': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ class_id: classId })
  }).then(() => loadClasses());
}