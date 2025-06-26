// Obtener cliente desde la URL
const params = new URLSearchParams(window.location.search);
const client = params.get('client') || 'alea';

// Preferencia de tema
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Cargar configuración visual y clases
fetch(`configs/${client}.json`)
  .then(res => res.json())
  .then(config => {
    applyTheme(config);
    loadClassesFromApi();
  });

// Aplicar colores y textos del archivo de configuración
function applyTheme(config) {
  const root = document.documentElement;
  Object.entries(config).forEach(([key, val]) => {
    if (!['name', 'tagline'].includes(key)) {
      root.style.setProperty(`--${key}`, val);
    }
  });
  document.getElementById('studio-name').textContent = config.name;
  document.title = config.name;
  document.getElementById('hero-text').textContent = config.tagline;
}

// Cargar clases desde la API y mostrarlas
function loadClassesFromApi() {
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes')
    .then(res => res.json())
    .then(classes => {
      const section = document.getElementById('class-section');
      section.innerHTML = '<h2>Reserva tu clase</h2>';
      classes.forEach(cls => {
        const available = cls.max_capacity - cls.current_capacity;
        const card = document.createElement('div');
        card.className = 'glass-card';

        card.innerHTML = `
          <div>
            <strong>${cls.icon || '🧘'} ${cls.class_id.split('T')[1]} – ${cls.name}</strong><br/>
            Instructor: ${cls.instructor || 'No definido'}<br/>
            Capacidad máxima: ${cls.max_capacity}<br/>
            Lugares disponibles: ${available}
          </div>
          <button class="glass-button" ${available <= 0 ? 'disabled style="cursor: not-allowed; opacity: 0.5;"' : ''}>
            ${available <= 0 ? 'Lleno' : 'Reservar'}
          </button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => reserveClass(cls.class_id));
        section.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error al cargar clases:", err);
    });
}

// Reservar clase
function reserveClass(classId) {
  const userId = 'usuario001'; // En el futuro se puede dinamizar
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ class_id: classId, user_id: userId })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loadClassesFromApi(); // Recargar lista
    })
    .catch(err => {
      console.error("Error al reservar clase:", err);
    });
}

// Alternar tema manual
const toggleBtn = document.getElementById('toggle-dark');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  });
}