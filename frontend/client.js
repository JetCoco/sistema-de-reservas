import { parseJwt } from './utils.js';
import { signOutRedirect } from './logout.js';

document.getElementById('logout-btn').addEventListener('click', signOutRedirect);

const token = localStorage.getItem('idToken');
const email = localStorage.getItem('email');
const clientId = localStorage.getItem('client_id');
const userId = localStorage.getItem('user_id');

if (!token || !email || !clientId || !userId) {
  alert('Sesión inválida. Por favor inicia sesión nuevamente.');
  window.location.href = 'index.html';
}

document.getElementById('user-email').textContent = email;

// Cargar reservas del usuario
fetch(`https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/reservations?client_id=${clientId}&user_id=${userId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('reservations-list');
    list.innerHTML = '';

    if (data.length === 0) {
      list.textContent = 'No tienes clases reservadas.';
      return;
    }

    data.forEach(reservation => {
      const div = document.createElement('div');
      div.className = 'class-card glass-card';
      div.innerHTML = `
        <h3>${reservation.name}</h3>
        <p>Instructor: ${reservation.instructor || 'N/A'}</p>
        <p>Fecha y hora: ${reservation.datetime}</p>
      `;
      list.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Error al cargar reservas:', err);
    alert('No se pudieron cargar tus reservas. Intenta más tarde.');
  });