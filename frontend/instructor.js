// instructor.js

document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  if (!email || role !== "instructor") {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("instructorEmail").textContent = email;
  document.getElementById("logoutBtn").addEventListener("click", logout);

  loadInstructorClasses();
});

function loadInstructorClasses() {
  const idToken = localStorage.getItem("idToken");

  fetch("https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes", {
    headers: {
      Authorization: idToken
    }
  })
    .then(res => res.json())
    .then(classes => {
      const email = localStorage.getItem("email");
      const container = document.getElementById("classListContainer");
      container.innerHTML = "";

      const filtered = classes.filter(cls => cls.instructor === email);

      if (filtered.length === 0) {
        container.innerHTML = "<p>No tienes clases asignadas.</p>";
        return;
      }

      filtered.forEach(cls => {
        const div = document.createElement("div");
        div.className = "glass-card class-row";
        div.innerHTML = `
          <strong>${cls.name}</strong><br/>
          Fecha: ${cls.datetime}<br/>
          Capacidad: ${cls.max_capacity} – Ocupados: ${cls.current_capacity}
        `;
        container.appendChild(div);
      });
    });
}