// Esta función debe ser global para que el `onclick` en el HTML pueda encontrarla.
function eliminarTarea(idTarea) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        // Obtenemos las tareas, las filtramos para quitar la seleccionada y guardamos de nuevo.
        let tareas = JSON.parse(localStorage.getItem('tasks')) || [];
        tareas = tareas.filter(tarea => tarea.id !== idTarea);
        localStorage.setItem('tasks', JSON.stringify(tareas));
        location.reload(); // Recargamos la página para ver los cambios.
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todos los componentes de Materialize.
    M.AutoInit();

    // --- LÓGICA DE LA PÁGINA DE LOGIN ---
    const formularioLogin = document.getElementById('formulario-login');
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío real del formulario
            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;

            // Simulación con credenciales correctas
            if (correo && contrasena) {
							window.location.href = "dashboard.html"; // Redirigir al dashboard
						} else if (!correo || !contrasena) {
							M.toast({ html: "Por favor, completa ambos campos." });
						} else {
							M.toast({
								html: "Credenciales incorrectas. Inténtalo de nuevo.",
							});
						}
        });
    }

    // --- LÓGICA DE LA PÁGINA DE CREAR TAREA ---
    const formularioCrearTarea = document.getElementById('formulario-crear-tarea');
    if (formularioCrearTarea) {
        formularioCrearTarea.addEventListener('submit', function(e) {
            e.preventDefault(); // Evitamos que la página se recargue

            // 1. Recoger los datos del formulario
            const titulo = document.getElementById('titulo-tarea').value;
            const descripcion = document.getElementById('descripcion-tarea').value;
            const fechaVencimiento = document.getElementById('fecha-vencimiento').value;

            if (!titulo) {
                M.toast({ html: 'El título es obligatorio.' });
                return;
            }

            // 2. Crear un objeto de tarea con un ID único
            const nuevaTarea = {
                id: Date.now(), // Usamos el timestamp como ID simple y único
                title: titulo,
                description: descripcion,
                dueDate: fechaVencimiento
            };

            // 3. Obtener tareas existentes de localStorage o crear un array vacío
            const tareas = JSON.parse(localStorage.getItem('tasks')) || [];

            // 4. Añadir la nueva tarea y guardarla en localStorage
            tareas.push(nuevaTarea);
            localStorage.setItem('tasks', JSON.stringify(tareas));

            // 5. Notificar al usuario y redirigir al dashboard
            M.toast({ html: '¡Tarea guardada con éxito!' });
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
        });
    }

    // --- LÓGICA DE LA PÁGINA DEL DASHBOARD ---
    const contenedorTareas = document.getElementById('contenedor-lista-tareas');
    if (contenedorTareas) {
        const tareas = JSON.parse(localStorage.getItem('tasks')) || [];

        if (tareas.length === 0) {
            contenedorTareas.innerHTML = '<div class="col s12"><p class="center-align">No tienes tareas pendientes. ¡Añade una nueva usando el botón +!</p></div>';
        } else {
            let htmlTodasLasTareas = '';
            tareas.forEach(tarea => {
                const htmlTarjetaTarea = `
                    <div class="col s12 m6 l4">
                        <div class="card">
                            <div class="card-content">
                                <span class="card-title">${tarea.title}</span>
                                <p style="min-height: 40px;">${tarea.description || 'Sin descripción.'}</p>
                                <p class="grey-text" style="margin-top: 1rem;">Vence: ${tarea.dueDate || 'Sin fecha.'}</p>
                            </div>
                            <div class="card-action">
                                <a href="#" class="red-text" onclick="eliminarTarea(${tarea.id})">Eliminar</a>
                            </div>
                        </div>
                    </div>
                `;
                htmlTodasLasTareas += htmlTarjetaTarea;
            });
            contenedorTareas.innerHTML = htmlTodasLasTareas;
        }
    }
});

