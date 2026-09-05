export function validarNombre(nombre) {
	const nombreLimpio = nombre.trim();

	if (!nombreLimpio) return "El nombre es obligatorio.";
	if (nombreLimpio.length < 3) return "Debe tener al menos 3 caracteres.";

	const soloLetras = /^[a-zA-Z\s]+$/;
	if (!soloLetras.test(nombreLimpio)) return "El nombre solo debe contener letras.";

	return "";
}

export function validarCorreo(correo) {
	if (!correo.trim()) return "El correo es obligatorio.";
	const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!formatoCorreo.test(correo.trim())) return "Ingresa un correo válido.";
	return "";
}

export function validarContrasena(contrasena) {
	if (!contrasena) return "La contraseña es obligatoria.";

	if (contrasena.length < 8) return "Debe tener al menos 8 caracteres.";
	if (!/[A-Z]/.test(contrasena)) return "Debe incluir una letra mayúscula.";
	if (!/[a-z]/.test(contrasena)) return "Debe incluir una letra minúscula.";
	if (!/[0-9]/.test(contrasena)) return "Debe incluir un número.";

	return "";
}

export function validarConfirmacion(confirmacion, contrasena) {
	if (!confirmacion) return "Confirma tu contraseña.";
	if (confirmacion !== contrasena) return "Las contraseñas no coinciden.";
	return "";
}

export function validarTelefono(telefono) {
	if (!telefono) return "El teléfono es obligatorio.";
	const formatoTelefono = /^9[0-9]{8}$/;
	if (!formatoTelefono.test(telefono)) return "Ingresa 9 dígitos y empieza con 9.";
	return "";
}

export function obtenerFortaleza(contrasena) {
	let puntos = 0;

	if (contrasena.length >= 8) puntos++;
	if (/[A-Z]/.test(contrasena) && /[a-z]/.test(contrasena)) puntos++;
	if (/[0-9]/.test(contrasena) && /[^a-zA-Z0-9]/.test(contrasena)) puntos++;
	if (puntos <= 1) return { texto: "Débil", nivel: 1 };
	if (puntos === 2) return { texto: "Media", nivel: 2 };

	return { texto: "Fuerte", nivel: 3 };
}
