document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const client = params.get('client') || 'alea';

  // Aplicar tema guardado o preferencia del sistema
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Activar el botón modo oscuro
  const toggleBtn = document.getElementById('toggle-dark');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
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
    const root = document.documentElement;
    Object.entries(config).forEach(([key, val]) => {
      if (!['name', 'tagline', 'classes'].includes(key)) {
        root.style.setProperty(`--${key}`, val);
      }
    });
    document.title = config.name || "Estudio de Pilates";
    const nameEl = document.getElementById('studio-name');
    const heroText = document.getElementById('hero-text');
    if (nameEl) nameEl.textContent = config.name;
    if (heroText) heroText.textContent = config.tagline;
  }

  function loadClassesFromApi() {
    fetch('https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes')
      .then(res => res.json())
      .then(classes => {
        const section = document.getElementById('class-section');
        if (!section) return;

        section.innerHTML = '<h2>Reserva tu clase</h2>';
        classes.forEach(cls => {
          const available = cls.max_capacity - cls.current_capacity;
          const card = document.createElement('div');
          card.className = 'glass-card';
          card.innerHTML = `
            <p class="class-title">${cls.icon || '🧘'} ${cls.class_id.split('T')[1]} – ${cls.name}</p>
            <p>Instructor: ${cls.instructor || 'Desconocido'}</p>
            <p>Capacidad máxima: ${cls.max_capacity}</p>
            <p>Lugares disponibles: ${available}</p>
            <button class="btn" ${available <= 0 ? 'disabled' : ''}>
              ${available <= 0 ? 'Lleno' : 'Reservar'}
            </button>
          `;
          card.querySelector('button').addEventListener('click', () => {
            reserveClass(cls.class_id);
          });
          section.appendChild(card);
        });
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
      });
  }
});