// main.js
import { UserManager } from "https://cdn.skypack.dev/oidc-client-ts"; // usa CDN para evitar npm en S3

const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_peIOypcf6",
    client_id: "1a43cn452jearoj6siqsnj70g5",
    redirect_uri: "https://sistema-reservas-frontend.s3.us-east-1.amazonaws.com/login-success.html",
    response_type: "code",
    scope: "email openid phone"
};

export const userManager = new UserManager({
    ...cognitoAuthConfig,
});

export async function signOutRedirect () {
    const clientId = "1a43cn452jearoj6siqsnj70g5";
    const logoutUri = "https://sistema-reservas-frontend.s3.us-east-1.amazonaws.com/index.html";
    const cognitoDomain = "https://us-east-1peioypcf6.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
}