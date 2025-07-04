// logout.js
import { userManager } from "./main.js";

(async () => {
  try {
    await userManager.signoutRedirect();
  } catch (err) {
    console.error("Error al cerrar sesión:", err);

    // Fallback manual
    localStorage.clear();
    sessionStorage.clear();
    const domain = 'https://us-east-1peioypcf6.auth.us-east-1.amazoncognito.com';
    const clientId = '1a43cn452jearoj6siqsnj70g5';
    const logoutRedirect = 'https://sistema-reservas-frontend.s3.us-east-1.amazonaws.com/index.html';
    const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutRedirect)}`;
    window.location.href = logoutUrl;
  }
})();