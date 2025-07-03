async function exchangeCodeForToken() {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      console.error('No se encontró código de autorización');
      return;
    }
  
    const clientId = '3014r1ilcn23v8fibb2ukr2urv';
    const redirectUri = 'https://sistema-reservas-frontend.s3.us-east-1.amazonaws.com/login-success.html';
    const domain = 'https://us-east-1sgjjg5crv.auth.us-east-1.amazoncognito.com';
  
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code
    });
  
    try {
      const res = await fetch(`${domain}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });
  
      const tokenData = await res.json();
      const idToken = tokenData.id_token;
  
      if (!idToken) {
        console.error('No se recibió token');
        return;
      }
  
      const decoded = jwt_decode(idToken);
      const email = decoded.email || 'desconocido';
      const groups = decoded['cognito:groups'] || [];
      const role = groups[0] || 'cliente';
  
      console.log(`Usuario: ${email}, Rol: ${role}`);
  
      // Guardar token en localStorage si se desea
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
  
      // Redireccionar según rol
      if (role === 'admin') {
        window.location.href = 'admin.html';
      } else if (role === 'instructor') {
        window.location.href = 'instructor.html';
      } else {
        window.location.href = 'index.html';
      }
  
    } catch (error) {
      console.error('Error al intercambiar código por token:', error);
    }
  }
  
  window.onload = exchangeCodeForToken;