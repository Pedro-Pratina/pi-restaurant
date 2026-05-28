const form = document.getElementById('loginForm');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('E-mail:', email);
  console.log('Senha:', password);

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const user = usuario.find(u => u.email === email && u.senha === password);
  if (!user) {
    alert('E-mail ou senha incorretos!');
    return;
  }

  localStorage.setItem('userAtual', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');
  alert('Login realizado com sucesso!');

  window.location.href = './perfil.html';
});