const form = document.getElementById('loginForm');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('E-mail:', email);
  console.log('Senha:', password);

  alert('Login realizado com sucesso!');

  window.location.href = '/perfil.html';
});