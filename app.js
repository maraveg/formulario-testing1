// Lista para almacenar los usuarios
let usuarios = [];

// Función para limpiar los errores del formulario
function limpiarErrores() {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById("registroForm").reset();  // Limpia el formulario
    limpiarErrores();  // Limpia los mensajes de error
}

// Función para mostrar un mensaje de error en un campo específico
function mostrarError(campo, mensaje) {
    document.getElementById(campo + "Error").textContent = mensaje;
}

// Función para validar el RUT
function validarRUT(rut) {
    const guionIndex = rut.lastIndexOf('-');
    if (guionIndex === -1) {
        return false;  // No hay guion
    }

    const parteNumerica = rut.slice(0, guionIndex);
    const parteFinal = rut.slice(guionIndex + 1);

    if (parteNumerica.length < 7 || parteNumerica.length > 8) {
        return false;
    }

    for (let i = 0; i < parteNumerica.length; i++) {
        if (isNaN(parteNumerica[i])) {
            return false;
        }
    }

    const ultimoCaracter = parteFinal.toLowerCase();
    if (!(ultimoCaracter >= '0' && ultimoCaracter <= '9') && ultimoCaracter !== 'k') {
        return false;
    }

    return true;
}

// Función para validar la dirección
function validarDireccion(direccion) {
    if (!direccion.trim()) {
        return "La dirección no puede estar vacía.";
    }
    const contieneNumero = /\d/.test(direccion);
    if (!contieneNumero) {
        return "La dirección debe contener una numeración.";
    }
    return true;
}

// Función para validar el teléfono
function validarTelefono(telefono) {
    if (telefono.length !== 9) {
        return "El teléfono debe tener exactamente 9 números.";
    }

    for (let i = 0; i < telefono.length; i++) {
        if (telefono[i] < '0' || telefono[i] > '9') {
            return "El teléfono solo puede contener números.";
        }
    }

    return true;
}

// Función para validar los comentarios (máximo 200 caracteres)
function validarComentarios(comentarios) {
    if (comentarios.length > 200) {
        return "Los comentarios no pueden tener más de 200 caracteres.";
    }
    return true;
}

// Función para validar la fecha de nacimiento (no permitir fechas futuras)
function validarFechaNacimiento(fechaNacimiento) {
    const fechaIngresada = new Date(fechaNacimiento);
    const fechaActual = new Date();
    if (fechaIngresada > fechaActual) {
        return "La fecha de nacimiento no puede ser una fecha futura.";
    }
    return true;
}

// Función para validar que solo haya letras y espacios en nombres, apellidos y ciudad
function validarSoloLetras(texto) {
    for (let i = 0; i < texto.length; i++) {
        const char = texto[i];
        if (!(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z') && char !== ' ') {
            return false;
        }
    }
    return true;
}

// Evento para el botón "Guardar"
document.getElementById("guardarBtn").addEventListener("click", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe si hay errores
    limpiarErrores();

    const rut = document.getElementById("rut").value;
    const nombres = document.getElementById("nombres").value;
    const apellidos = document.getElementById("apellidos").value;
    const direccion = document.getElementById("direccion").value;
    const ciudad = document.getElementById("ciudad").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const estadoCivil = document.getElementById("estadoCivil").value;
    const comentarios = document.getElementById("comentarios").value;

    let errores = false;

    if (!rut) {
        mostrarError("rut", "El RUT es requerido.");
        errores = true;
    } else if (!validarRUT(rut)) {
        mostrarError("rut", "El RUT es inválido. Debe tener el formato XXXXXXXX-Y.");
        errores = true;
    }

    const resultadoDireccion = validarDireccion(direccion);
    if (resultadoDireccion !== true) {
        mostrarError("direccion", resultadoDireccion);
        errores = true;
    }

    const resultadoTelefono = validarTelefono(telefono);
    if (resultadoTelefono !== true) {
        mostrarError("telefono", resultadoTelefono);
        errores = true;
    }

    if (!nombres) {
        mostrarError("nombres", "Los nombres son requeridos.");
        errores = true;
    } else if (!validarSoloLetras(nombres)) {
        mostrarError("nombres", "Los nombres solo pueden contener letras y espacios.");
        errores = true;
    }

    if (!apellidos) {
        mostrarError("apellidos", "Los apellidos son requeridos.");
        errores = true;
    } else if (!validarSoloLetras(apellidos)) {
        mostrarError("apellidos", "Los apellidos solo pueden contener letras y espacios.");
        errores = true;
    }

    if (!ciudad) {
        mostrarError("ciudad", "La ciudad es requerida.");
        errores = true;
    } else if (!validarSoloLetras(ciudad)) {
        mostrarError("ciudad", "La ciudad solo puede contener letras y espacios.");
        errores = true;
    }

    if (!email || !email.includes("@")) {
        mostrarError("email", "El email es inválido.");
        errores = true;
    }

    const resultadoFechaNacimiento = validarFechaNacimiento(fechaNacimiento);
    if (resultadoFechaNacimiento !== true) {
        mostrarError("fechaNacimiento", resultadoFechaNacimiento);
        errores = true;
    }

    if (!estadoCivil) {
        mostrarError("estadoCivil", "El estado civil es requerido.");
        errores = true;
    }

    const resultadoComentarios = validarComentarios(comentarios);
    if (resultadoComentarios !== true) {
        mostrarError("comentarios", resultadoComentarios);
        errores = true;
    }

    // Verificar si el usuario ya existe
    if (!errores) {
        let usuarioExistente = usuarios.find(user => user.rut === rut);
        if (usuarioExistente) {
            if (confirm("El usuario ya existe. ¿Desea sobreescribirlo?")) {
                usuarios = usuarios.filter(user => user.rut !== rut);
            } else {
                return;
            }
        }

        // Guardar el nuevo usuario
        usuarios.push({
            rut, nombres, apellidos, direccion, ciudad, telefono, email, fechaNacimiento, estadoCivil, comentarios
        });

        alert("Usuario guardado con éxito.");
        limpiarFormulario();
    }
});

// Evento para el botón "Buscar"
document.getElementById("buscarBtn").addEventListener("click", function () {
    const buscarApellido = document.getElementById("buscarApellido").value;
    const resultadoDiv = document.getElementById("resultadoBusqueda");

    // Buscar el usuario por apellido
    let usuarioEncontrado = usuarios.find(user => user.apellidos.toLowerCase() === buscarApellido.toLowerCase());

    if (usuarioEncontrado) {
        resultadoDiv.innerHTML = `
            <p><strong>RUT:</strong> ${usuarioEncontrado.rut}</p>
            <p><strong>Nombres:</strong> ${usuarioEncontrado.nombres}</p>
            <p><strong>Apellidos:</strong> ${usuarioEncontrado.apellidos}</p>
            <p><strong>Dirección:</strong> ${usuarioEncontrado.direccion}</p>
            <p><strong>Ciudad:</strong> ${usuarioEncontrado.ciudad}</p>
            <p><strong>Teléfono:</strong> ${usuarioEncontrado.telefono}</p>
            <p><strong>Email:</strong> ${usuarioEncontrado.email}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${usuarioEncontrado.fechaNacimiento}</p>
            <p><strong>Estado Civil:</strong> ${usuarioEncontrado.estadoCivil}</p>
            <p><strong>Comentarios:</strong> ${usuarioEncontrado.comentarios}</p>
        `;
    } else {
        resultadoDiv.textContent = 'Usuario no encontrado.';
    }
});

// Evento para el botón "Limpiar"
document.getElementById("limpiarBtn").addEventListener("click", limpiarFormulario);

// Evento para el botón "Cerrar"
document.getElementById("cerrarBtn").addEventListener("click", function () {
    if (confirm("¿Desea cerrar la aplicación?")) {
        window.close();
    }
});
