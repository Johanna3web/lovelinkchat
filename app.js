window.location.href = 'dashboard.html';

function handleSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const preference = document.getElementById('preference').value;
  document.getElementById('message').textContent = `Thank you, ${name}! Your profile has been created. We'll help you find ${preference}.`;
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  if (email && password) {
      document.getElementById('login-message').textContent = `Welcome back, ${email}!`;
  }
}
