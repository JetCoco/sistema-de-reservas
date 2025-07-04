// main.js
import { UserManager } from "https://cdn.skypack.dev/oidc-client-ts";

const cognitoAuthConfig = {
  authority: "https://us-east-1peioypcf6.auth.us-east-1.amazoncognito.com", // Dominio de Cognito
  client_id: "1a43cn452jearoj6siqsnj70g5",
  redirect_uri: "https://sistema-reservas-frontend.s3.us-east-1.amazonaws.com/login-success.html",
  response_type: "code", // Authorization Code Grant
  scope: "openid email profile"
};

export const userManager = new UserManager(cognitoAuthConfig);

export async function signInRedirect() {
  await userManager.signinRedirect();
}

export async function signOutRedirect () {
  const logoutUri = "https://sistema-reservas-frontend.s3.us-east-1.amazonaws.com/index.html";
  const cognitoDomain = "https://us-east-1peioypcf6.auth.us-east-1.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${cognitoAuthConfig.client_id}&logout_uri=${encodeURIComponent(logoutUri)}`;
}