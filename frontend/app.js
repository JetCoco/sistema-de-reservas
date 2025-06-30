// Obtener cliente desde la URL
const params = new URLSearchParams(window.location.search);
const client = params.get('client') || 'alea';

// Modo oscuro: aplicar si hay preferencia previa o del sistema
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Toggle de modo oscuro
const toggle = document.getElementById('toggle-dark');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Cargar configuración visual y clases
fetch(`configs/${client}.json`)
  .then(res => res.json())
  .then(config => {
    applyTheme(config);
    loadClassesFromApi();
  });

function applyTheme(config) {
  document.title = config.name || 'Pilates Studio';
}

function loadClassesFromApi() {
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes')
    .then(res => res.json())
    .then(classes => {
      const section = document.getElementById('class-section');
      section.innerHTML = '<h2 class="section-title">Reserva tu clase</h2>';

      classes.forEach(cls => {
        const available = cls.max_capacity - cls.current_capacity;

        const card = document.createElement('div');
        card.className = 'class-card glass-card';
        card.innerHTML = `
          <div>
            <h3>${cls.icon || '🧘'} ${cls.class_id.split('T')[1]} – ${cls.name}</h3>
            <p>Instructor: ${cls.instructor || 'No definido'}</p>
            <p>Capacidad máxima: ${cls.max_capacity}</p>
            <p>Lugares disponibles: ${available}</p>
          </div>
          <button class="btn" ${available <= 0 ? 'disabled' : ''}>
            ${available <= 0 ? 'Lleno' : 'Reservar'}
          </button>
        `;

        card.querySelector('button').addEventListener('click', () => {
          reserveClass(cls.class_id);
        });

        section.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error al cargar clases:", err);
    });
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
      console.error("Error al reservar clase:", err);
    });
}