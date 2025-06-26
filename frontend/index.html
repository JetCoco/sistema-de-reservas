const params = new URLSearchParams(window.location.search);
const client = params.get('client') || 'alea';

// visual theme y carga de clases
fetch(`configs/${client}.json`)
  .then(res => res.json())
  .then(config => {
    applyTheme(config);
    loadClassesFromApi();
  });

function applyTheme(config) {
  const root = document.documentElement;
  // define todas las variables si existen
  Object.entries(config).forEach(([key, val]) => {
    if (key !== 'name' && key !== 'tagline' && key !== 'classes') {
      root.style.setProperty(`--${key}`, val);
    }
  });
  document.getElementById('studio-name').innerHTML = `<strong>${config.name}</strong>`;
  document.title = config.name;
  document.getElementById('hero-text').textContent = config.tagline;
}

function loadClassesFromApi() {
  fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes')
    .then(res => res.json())
    .then(classes => {
      const section = document.getElementById('class-section');
      section.innerHTML = '<h2>Reserva tu clase</h2>';
      classes.forEach(cls => {
        const available = cls.max_capacity - cls.current_capacity;
        const card = document.createElement('div');
        card.className = 'class-card';
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

// Función para hacer la reserva
function reserveClass(classId) {
  const userId = 'usuario001'; // Esto en el futuro debe ser dinámico
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
      loadClassesFromApi(); // recargar lista después de reservar
    })
    .catch(err => {
      console.error("Error al reservar clase:", err);
    });
}