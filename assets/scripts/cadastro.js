const form = document.getElementById('cadastroForm');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  console.log('E-mail:', email);
  console.log('Senha:', password);
  console.log('Confirmação de Senha:', confirmPassword);

  if (password !== confirmPassword) {
    alert('As senhas não coincidem!');
    return;
  }

  alert('Cadastro realizado com sucesso!');
  

  window.location.href = './perfil.html';
});