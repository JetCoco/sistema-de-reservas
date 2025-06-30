// Obtener cliente desde la URL
const params = new URLSearchParams(window.location.search);
const client = params.get('client') || 'alea';

// Aplicar modo oscuro guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
} else {
  document.body.classList.remove('dark');
}

// Toggle de modo oscuro
const toggleBtn = document.getElementById('toggle-dark');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// Cargar configuración visual y clases
fetch(`configs/${client}.json`)
  .then(res => res.json())
  .then(config => {
    applyTheme(config);
    loadClassesFromApi();
  });

function applyTheme(config) {
  document.title = config.name || 'Estudio de Pilates';
  document.querySelector('.logo').textContent = config.name || 'Estudio';
}

function loadClassesFromApi() {
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes')
    .then(res => res.json())
    .then(classes => {
      const section = document.getElementById('class-section');
      section.innerHTML = '<h2 style="margin-bottom: 1rem;">Reserva tu clase</h2>';

      classes.forEach(cls => {
        const available = cls.max_capacity - cls.current_capacity;

        const card = document.createElement('div');
        card.className = 'class-card glass-card';

        card.innerHTML = `
          <div>
            <p><strong>${cls.icon || '🧘'} ${cls.class_id.split('T')[1]} – ${cls.name}</strong></p>
            <p>Instructor: ${cls.instructor}</p>
            <p>Capacidad máxima: ${cls.max_capacity}</p>
            <p>Lugares disponibles: ${available}</p>
          </div>
          <button class="btn" ${available <= 0 ? 'disabled style="opacity:0.5;"' : ''}>
            ${available <= 0 ? 'Lleno' : 'Reservar'}
          </button>
        `;

        card.querySelector('button').addEventListener('click', () => {
          reserveClass(cls.class_id);
        });

        section.appendChild(card);
      });
    })
    .catch(console.error);
}

function reserveClass(classId) {
  const userId = 'usuario001';
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ class_id: classId, user_id: userId })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loadClassesFromApi();
    })
    .catch(err => {
      console.error('Error al reservar:', err);
    });
}