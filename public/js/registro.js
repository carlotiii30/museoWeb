function togglePassword() {
  const passInput = document.getElementById("password");
  const icon = document.getElementById("togglePasswordIcon");

  const isPassword = passInput.type === "password";
  passInput.type = isPassword ? "text" : "password";
  icon.classList.toggle("bi-eye", !isPassword);
  icon.classList.toggle("bi-eye-slash", isPassword);
}

function toggleConfirmPassword() {
  const input = document.getElementById("confirm-password");
  const icon = document.getElementById("toggleConfirmIcon");

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
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
  validarConfirmacion();
}

function validarConfirmacion() {
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");
  const error = document.getElementById("confirm-error");
  const esIgual =
    confirmInput.value === passwordInput.value && confirmInput.value.length > 0;
  error.style.display = esIgual ? "none" : "block";
  confirmInput.classList.toggle("is-invalid", !esIgual);
  confirmInput.classList.toggle("is-valid", esIgual);
}

function validarRegistro() {
  const correoInput = document.getElementById("correo");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");

  validarCorreo(correoInput);
  validarPassword(passwordInput);
  validarConfirmacion();

  return (
    correoInput.classList.contains("is-valid") &&
    passwordInput.classList.contains("is-valid") &&
    confirmInput.classList.contains("is-valid")
  );
}
