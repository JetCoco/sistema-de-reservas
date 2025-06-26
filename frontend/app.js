// Obtener cliente desde la URL
const params = new URLSearchParams(window.location.search);
const client = params.get('client') || 'alea';

// Aplicar preferencia de tema desde localStorage o sistema
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Cargar configuración y clases
fetch(`configs/${client}.json`)
  .then(res => res.json())
  .then(config => {
    applyTheme(config);
    loadClassesFromApi();
  });

// Aplicar variables de color y textos desde el archivo JSON
function applyTheme(config) {
  const root = document.documentElement;
  Object.entries(config).forEach(([key, val]) => {
    if (key !== 'name' && key !== 'tagline' && key !== 'classes') {
      root.style.setProperty(`--${key}`, val);
    }
  });
  document.getElementById('studio-name').innerHTML = `<strong>${config.name}</strong>`;
  document.title = config.name;
  document.getElementById('hero-text').textContent = config.tagline;
}

// Obtener y renderizar clases
function loadClassesFromApi() {
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes')
    .then(res => res.json())
    .then(classes => {
      const section = document.getElementById('class-section');
      section.innerHTML = '<h2>Reserva tu clase</h2>';
      classes.forEach(cls => {
        const available = cls.max_capacity - cls.current_capacity;
        const card = document.createElement('div');
        card.className = 'border rounded-md p-4 shadow-md bg-white dark:bg-gray-800 dark:text-white flex justify-between items-center';
        card.innerHTML = `
          <div>
            <strong>${cls.icon || '🧘'} ${cls.class_id.split('T')[1]} – ${cls.name}</strong><br/>
            Instructor: ${cls.instructor || 'No definido'}<br/>
            Capacidad máxima: ${cls.max_capacity}<br/>
            Lugares disponibles: ${available}
          </div>
          <button class="px-4 py-2 rounded text-white ${available <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}" ${available <= 0 ? 'disabled' : ''}>
            ${available <= 0 ? 'Lleno' : 'Reservar'}
          </button>
        `;
        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
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
  const userId = 'usuario001'; // Esto será dinámico en el futuro
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/reserve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ class_id: classId, user_id: userId })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loadClassesFromApi(); // Recargar después de reservar
    })
    .catch(err => {
      console.error("Error al reservar clase:", err);
    });
}

// Alternar modo oscuro y guardar preferencia
const toggleBtn = document.getElementById('toggle-dark');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  });
}