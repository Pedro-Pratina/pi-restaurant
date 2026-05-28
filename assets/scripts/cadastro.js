const form = document.getElementById('cadastroForm');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const name = document.getElementById('nome').value;

  console.log('E-mail:', email);
  console.log('Senha:', password);
  console.log('Confirmação de Senha:', confirmPassword);

  if (password !== confirmPassword) {
    alert('As senhas não coincidem!');
    return;
  }

  const usuario = {
    nome: name,
    email: email,
    senha: password
  };

   const dadosExistentes = JSON.parse(localStorage.getItem('usuario')) || [];
   dadosExistentes.push(usuario);
   
   localStorage.setItem('userAtual', JSON.stringify(usuario));
   localStorage.setItem('usuario', JSON.stringify(dadosExistentes));
   localStorage.setItem('isLoggedIn', 'true');

  alert('Cadastro realizado com sucesso!');


  window.location.href = './perfil.html';
});