// admin.js

document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  if (!email || role !== "admin") {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("adminEmail").textContent = email;
  document.getElementById("logoutBtn").addEventListener("click", logout);

  loadClasses();

  // Modal
  const modal = document.getElementById("classModal");
  const form = document.getElementById("classForm");
  const cancelBtn = document.getElementById("cancelModal");

  cancelBtn.onclick = () => {
    modal.classList.add("hidden");
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const classData = {
      class_id: document.getElementById("classId").value || undefined,
      name: document.getElementById("className").value,
      instructor_id: document.getElementById("instructorId").value,
      max_capacity: parseInt(document.getElementById("maxCapacity").value),
      datetime: document.getElementById("classDateTime").value,
      client_id: "alea"
    };

    const isEdit = !!classData.class_id;
    const url = `https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes`;
    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("idToken")
      },
      body: JSON.stringify(classData)
    })
      .then(res => res.json())
      .then(() => {
        modal.classList.add("hidden");
        loadClasses();
      });
  };
});

function loadClasses() {
  fetch("https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod/classes", {
    headers: {
      Authorization: localStorage.getItem("idToken")
    }
  })
    .then(res => res.json())
    .then(classes => {
      const container = document.getElementById("classListContainer");
      container.innerHTML = "";

      classes.forEach(cls => {
        const div = document.createElement("div");
        div.className = "glass-card class-row";
        div.innerHTML = `
          <strong>${cls.name}</strong> – ${cls.datetime} – ${cls.max_capacity} lugares<br/>
          <button onclick="editClass('${cls.class_id}', '${cls.name}', '${cls.instructor_id}', '${cls.max_capacity}', '${cls.datetime}')">Editar</button>
        `;
        container.appendChild(div);
      });
    });
}

function editClass(id, name, instructorId, maxCap, datetime) {
  document.getElementById("modalTitle").textContent = "Editar Clase";
  document.getElementById("classId").value = id;
  document.getElementById("className").value = name;
  document.getElementById("instructorId").value = instructorId;
  document.getElementById("maxCapacity").value = maxCap;
  document.getElementById("classDateTime").value = datetime;

  document.getElementById("classModal").classList.remove("hidden");
}