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

  if (!idToken || !accessToken) {
    console.error('Token no encontrado en la URL.');
    window.location.href = "index.html";
    return;
  }

  try {
    localStorage.setItem("idToken", idToken);
    localStorage.setItem("accessToken", accessToken);

    const decoded = decodeJwt(idToken);
    const email = decoded.email || decoded["cognito:username"];
    const role = decoded["custom:role"];

    localStorage.setItem("email", email);
    localStorage.setItem("role", role);

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