const API_URL = "https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes";

// Alternar modo oscuro
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// Cargar clases al iniciar
document.addEventListener("DOMContentLoaded", loadClasses);

// Mostrar clases existentes
function loadClasses() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("class-list");
      list.innerHTML = "";
      data.forEach(cls => {
        const div = document.createElement("div");
        div.className = "glass-card";
        div.innerHTML = `
          <p><strong>${cls.icon || "🧘"} ${cls.name}</strong> — Instructor: ${cls.instructor} — Cupo: ${cls.current_capacity}/${cls.max_capacity}</p>
          <button onclick='editClass(${JSON.stringify(cls)})'>✏️ Editar</button>
          <button onclick='deleteClass("${cls.class_id}")'>🗑️ Eliminar</button>
        `;
        list.appendChild(div);
      });
    });
}

// Editar clase
function editClass(cls) {
  document.getElementById("class_id").value = cls.class_id;
  document.getElementById("name").value = cls.name;
  document.getElementById("instructor").value = cls.instructor;
  document.getElementById("max_capacity").value = cls.max_capacity;
  document.getElementById("current_capacity").value = cls.current_capacity;
  document.getElementById("icon").value = cls.icon || "";
}

// Eliminar clase
function deleteClass(classId) {
  if (!confirm("¿Seguro que deseas eliminar esta clase?")) return;

  fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ class_id: classId }),
  }).then(loadClasses);
}

// Crear o actualizar clase
document.getElementById("class-form").addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    class_id: document.getElementById("class_id").value,
    name: document.getElementById("name").value,
    instructor: document.getElementById("instructor").value,
    max_capacity: parseInt(document.getElementById("max_capacity").value),
    current_capacity: parseInt(document.getElementById("current_capacity").value),
    icon: document.getElementById("icon").value || "🧘",
  };

  const method = data.class_id ? "PUT" : "POST";

  fetch(API_URL, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(() => {
      e.target.reset();
      loadClasses();
    });
});