const API_URL = 'https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod';

// TODO: Reemplaza estos valores dinámicamente cuando tengas login
const user_id = 'instructor-001';
const client_id = 'alea';

async function loadInstructorClasses() {
  try {
    const res = await fetch(`${API_URL}/classes`);
    const classes = await res.json();

    const filtered = classes.filter(cls =>
      cls.instructor === user_id && cls.client_id === client_id
    );

    const container = document.getElementById('instructor-class-list');
    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = '<p>No tienes clases asignadas.</p>';
      return;
    }

    filtered.forEach(cls => {
      const card = document.createElement('div');
      card.className = 'class-card';

      card.innerHTML = `
        <div>
          <h3>${cls.icon || '🧘'} ${cls.name}</h3>
          <p><strong>Instructor:</strong> ${cls.instructor}</p>
          <p><strong>Capacidad:</strong> ${cls.current_capacity}/${cls.max_capacity}</p>
          <p><strong>ID Clase:</strong> ${cls.class_id}</p>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error('Error al cargar clases del instructor:', err);
    const container = document.getElementById('instructor-class-list');
    container.innerHTML = '<p>Error al cargar las clases. Intenta nuevamente.</p>';
  }
}

window.onload = loadInstructorClasses;