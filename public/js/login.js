function togglePassword() {
  const passInput = document.getElementById("password");
  const icon = document.getElementById("togglePasswordIcon");

  const isPassword = passInput.type === "password";
  passInput.type = isPassword ? "text" : "password";
  icon.classList.toggle("bi-eye", !isPassword);
  icon.classList.toggle("bi-eye-slash", isPassword);
}

function validarCorreo(input) {
  const error = document.getElementById("correo-error");
  const esValido = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value);
  error.style.display = esValido ? "none" : "block";
  input.classList.toggle("is-invalid", !esValido);
  input.classList.toggle("is-valid", esValido);
}

function validarPassword(input) {
  const error = document.getElementById("password-error");
  const esValido = input.value.length >= 8;
  error.style.display = esValido ? "none" : "block";
  input.classList.toggle("is-invalid", !esValido);
  input.classList.toggle("is-valid", esValido);
}

function validarFormulario() {
  const correoInput = document.getElementById("correo");
  const passwordInput = document.getElementById("password");
  validarCorreo(correoInput);
  validarPassword(passwordInput);
  return (
    correoInput.classList.contains("is-valid") &&
    passwordInput.classList.contains("is-valid")
  );
}
