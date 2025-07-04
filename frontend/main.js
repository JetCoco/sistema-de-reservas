import { UserManager } from "https://cdn.skypack.dev/oidc-client-ts";

const cognitoAuthConfig = {
  authority: "https://us-east-1peioypcf6.auth.us-east-1.amazoncognito.com",
  client_id: "1a43cn452jearoj6siqsnj70g5",
  redirect_uri: "https://sistema-reservas-frontend.s3.us-east-1.amazonaws.com/login-success.html",
  response_type: "code",
  scope: "openid profile email"
};

export const userManager = new UserManager(cognitoAuthConfig);

export async function signInRedirect() {
  try {
    await userManager.signinRedirect();
  } catch (err) {
    console.error("Error al redirigir al login:", err);
  }
}

export async function signOutRedirect() {
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
}