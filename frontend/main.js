// main.js
import { UserManager } from "https://cdn.skypack.dev/oidc-client-ts";

const cognitoAuthConfig = {
  authority: "https://us-east-1peioypcf6.auth.us-east-1.amazoncognito.com", // <-- ✅ ESTE es el correcto
  client_id: "1a43cn452jearoj6siqsnj70g5",
  redirect_uri: "https://sistema-reservas-frontend.s3.us-east-1.amazonaws.com/login-success.html",
  response_type: "code",
  scope: "openid email profile"
};

export const userManager = new UserManager(cognitoAuthConfig);

export async function signOutRedirect() {
  await userManager.signoutRedirect();
}