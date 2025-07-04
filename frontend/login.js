// login.js

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = 'logout.html';
}

async function handleLoginRedirect() {
  const userManager = new window.oidc.UserManager({
    response_type: "code",
    authority: "https://us-east-1peioypcf6.auth.us-east-1.amazoncognito.com",
    client_id: "1a43cn452jearoj6siqsnj70g5",
    redirect_uri: window.location.origin + "/login-success.html",
    scope: "openid email profile",
  });

  try {
    const user = await userManager.signinRedirectCallback();

    const idToken = user.id_token;
    const accessToken = user.access_token;
    const refreshToken = user.refresh_token;

    const decoded = jwt_decode(idToken);
    const email = decoded.email;
    const role = decoded["custom:role"];

    // Mostrar datos en pantalla
    document.getElementById("email").textContent = email;
    document.getElementById("accessToken").textContent = accessToken;
    document.getElementById("idToken").textContent = idToken;
    document.getElementById("refreshToken").textContent = refreshToken;

    // Guardar en localStorage
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("id_token", idToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    // Redirigir según el rol
    if (role === "admin") {
      window.location.href = "admin.html";
    } else if (role === "instructor") {
      window.location.href = "instructor.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (err) {
    console.error("Error al procesar el login:", err);
    logout();
  }
}

// Ejecutar al cargar
handleLoginRedirect();