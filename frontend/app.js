// Año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// Modo oscuro según preferencia
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Alternar modo oscuro manual
const toggleBtn = document.getElementById('toggle-dark');
toggleBtn.addEventListener('click', () => {
  const html = document.documentElement;
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Obtener cliente desde la URL
const params = new URLSearchParams(window.location.search);
const client = params.get('client') || 'alea';

// Cargar configuración del cliente
fetch(`configs/${client}.json`)
  .then(res => res.json())
  .then(config => {
    applyTheme(config);
    loadClassesFromApi();
  });

// Aplicar variables de color y textos desde JSON
function applyTheme(config) {
  const root = document.documentElement;
  Object.entries(config).forEach(([key, val]) => {
    if (key !== 'name' && key !== 'tagline') {
      root.style.setProperty(`--${key}`, val);
    }
  });
  document.getElementById('studio-name').textContent = config.name;
  document.title = config.name;
  document.getElementById('hero-text').textContent = config.tagline;
}

// Obtener y renderizar clases
function loadClassesFromApi() {
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes')
    .then(res => res.json())
    .then(classes => {
      const section = document.getElementById('class-section');
      section.innerHTML = '<h2 style="margin-bottom:1rem;">Reserva tu clase</h2>';
      classes.forEach(cls => {
        const available = cls.max_capacity - cls.current_capacity;
        const card = document.createElement('div');
        card.className = 'class-card glass-card';
        card.innerHTML = `
          <div>
            <strong>${cls.icon || '🧘'} ${cls.class_id.split('T')[1]} – ${cls.name}</strong><br/>
            Instructor: ${cls.instructor || 'No definido'}<br/>
            Capacidad máxima: ${cls.max_capacity}<br/>
            Lugares disponibles: ${available}
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

// Enviar solicitud de reserva
function reserveClass(classId) {
  const userId = 'usuario001'; // futuro: dinámico
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