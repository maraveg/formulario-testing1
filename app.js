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
    // Verificar que haya un guion en el RUT
    const guionIndex = rut.lastIndexOf('-');
    if (guionIndex === -1) {
        return false;  // No hay guion
    }

    // Separar la parte numérica y la parte final (después del guion)
    const parteNumerica = rut.slice(0, guionIndex);
    const parteFinal = rut.slice(guionIndex + 1);

    // Verificar que la parte numérica tenga entre 7 y 8 caracteres y que sean solo números
    if (parteNumerica.length < 7 || parteNumerica.length > 8) {
        return false;  // La parte numérica no tiene la longitud adecuada
    }

    for (let i = 0; i < parteNumerica.length; i++) {
        if (isNaN(parteNumerica[i])) {
            return false;  // Hay un carácter que no es número
        }
    }

    // Verificar que la parte final sea un número del 0 al 9 o la letra "k"
    if (parteFinal.length !== 1) {
        return false;  // La parte final debe tener exactamente un carácter
    }

    const ultimoCaracter = parteFinal.toLowerCase();  // Convertir a minúscula para evitar problemas de mayúsculas
    if (!(ultimoCaracter >= '0' && ultimoCaracter <= '9') && ultimoCaracter !== 'k') {
        return false;  // No es un número entre 0-9 ni la letra "k"
    }

    // Si pasa todas las validaciones
    return true;
}

// Función para validar la dirección
function validarDireccion(direccion) {
    // Verificar que la dirección incluya al menos un número
    const contieneNumero = /\d/.test(direccion);
    if (!contieneNumero) {
        return "La dirección debe contener una numeración.";
    }

    // Verificar que la dirección no esté vacía
    if (direccion.trim() === "") {
        return "La dirección no puede estar vacía.";
    }

    // Si todo está correcto
    return true;
}

// Función para validar el teléfono
function validarTelefono(telefono) {
    // Verificar que el teléfono tenga exactamente 9 caracteres y que sean solo números
    if (telefono.length !== 9) {
        return "El teléfono debe tener exactamente 9 números.";
    }
     // Verificar que todos los caracteres sean dígitos
     for (let i = 0; i < telefono.length; i++) {
        if (telefono[i] < '0' || telefono[i] > '9') {
            return "El teléfono solo puede contener números.";
        }
    }

    // Si todo está correcto
    return true;
}

// Evento para el botón "Guardar"
document.getElementById("guardarBtn").addEventListener("click", function () {
    limpiarErrores();

    // Capturar los valores de los campos
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

    // Validación del RUT
    if (!rut) {
        mostrarError("rut", "El RUT es requerido.");
        return;
    } else if (!validarRUT(rut)) {
        mostrarError("rut", "El RUT es inválido. Debe tener el formato XXXXXXXX-Y (números y guion, último carácter 0-9 o k).");
        return;
    }

    // Validación de la dirección
    const resultadoDireccion = validarDireccion(direccion);
    if (resultadoDireccion !== true) {
        mostrarError("direccion", resultadoDireccion);
        return;  // Detener la ejecución si la dirección no es válida
    }

    // Validación del teléfono
    const resultadoTelefono = validarTelefono(telefono);
    if (resultadoTelefono !== true) {
        mostrarError("telefono", resultadoTelefono);
        return;  // Detener la ejecución si el teléfono no es válido
    }

    // Validación de otros campos
    if (!nombres) { mostrarError("nombres", "Los nombres son requeridos."); return; }
    if (!apellidos) { mostrarError("apellidos", "Los apellidos son requeridos."); return; }
    if (!ciudad) { mostrarError("ciudad", "La ciudad es requerida."); return; }
    if (!email || !email.includes("@")) { mostrarError("email", "El email es inválido."); return; }
    if (!fechaNacimiento) { mostrarError("fechaNacimiento", "La fecha de nacimiento es requerida."); return; }
    if (!estadoCivil) { mostrarError("estadoCivil", "El estado civil es requerido."); return; }

    // Verificar si el usuario ya existe
    let usuarioExistente = usuarios.find(user => user.rut === rut);
    if (usuarioExistente) {
        if (confirm("El usuario ya existe. ¿Desea sobreescribirlo?")) {
            usuarios = usuarios.filter(user => user.rut !== rut);  // Eliminar el anterior
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
