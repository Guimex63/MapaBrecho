document.getElementById('formulario').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Brechó cadastrado com sucesso!');
  this.reset();
});
