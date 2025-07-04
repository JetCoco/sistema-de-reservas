// login.js

function decodeJwt(token) {
  const payload = token.split('.')[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
}

(function handleLoginRedirect() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const idToken = params.get('id_token');
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!idToken) {
    console.error('Token no encontrado en la URL.');
    window.location.href = "index.html";
    return;
  }

  try {
    // Guardar tokens en almacenamiento local
    localStorage.setItem("idToken", idToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Decodificar el token para extraer el rol
    const decoded = decodeJwt(idToken);
    const email = decoded.email || decoded["cognito:username"];
    const role = decoded["custom:role"];

    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

    // Redirección según el rol
    if (role === "admin") {
      window.location.href = "admin.html";
    } else if (role === "instructor") {
      window.location.href = "instructor.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (err) {
    console.error("Error al procesar el token:", err);
    window.location.href = "index.html";
  }
})();