import { verifyTokenAndGetClaims } from './auth.js';
import { logout } from './logout.js';

document.getElementById('logout-btn').addEventListener('click', logout);

// Mostrar año actual
document.getElementById('year').textContent = new Date().getFullYear();

async function main() {
  const claims = verifyTokenAndGetClaims();
  if (!claims) return;

  const userEmail = claims.email;
  const userId = claims.sub;
  const clientId = claims['custom:client_id'] || claims['client_id'];

  document.getElementById('user-email').textContent = userEmail;

  const endpoint = 'https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes';

  try {
    const res = await fetch(endpoint);
    const allClasses = await res.json();

    const instructorClasses = allClasses.filter(cls =>
      cls.client_id === clientId && cls.instructor_id === userId
    );

    const listDiv = document.getElementById('classes-list');
    if (instructorClasses.length === 0) {
      listDiv.innerHTML = '<p>No tienes clases programadas.</p>';
      return;
    }

    instructorClasses.forEach(cls => {
      const available = cls.max_capacity - cls.current_capacity;
      const card = document.createElement('div');
      card.className = 'class-card glass-card';
      card.innerHTML = `
        <div>
          <h3>${cls.icon || '🧘'} ${cls.class_id.split('T')[1]} – ${cls.name}</h3>
          <p>Capacidad máxima: ${cls.max_capacity}</p>
          <p>Ocupación actual: ${cls.current_capacity}</p>
          <p>Disponibles: ${available}</p>
        </div>
      `;
      listDiv.appendChild(card);
    });

  } catch (error) {
    console.error('Error al obtener clases del instructor:', error);
  }
}

main();