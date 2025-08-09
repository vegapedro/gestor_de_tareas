// Esta función debe ser global para que el `onclick` en el HTML pueda encontrarla.
function deleteTask(taskId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        // Obtenemos las tareas, las filtramos para quitar la seleccionada y guardamos de nuevo.
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        location.reload(); // Recargamos la página para ver los cambios.
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todos los componentes de Materialize automáticamente.
    M.AutoInit();

    // --- LÓGICA DE LA PÁGINA DE LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío real del formulario
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simulación con credenciales correctas
            if (email === "scrumtask@gmail.com" && password === "123456") {
							window.location.href = "dashboard.html"; // Redirigir al dashboard
						} else if (!email || !password) {
							M.toast({ html: "Por favor, completa ambos campos." });
						} else {
							M.toast({
								html: "Credenciales incorrectas. Inténtalo de nuevo.",
							});
						}
        });
    }

    // --- LÓGICA DE LA PÁGINA DE CREAR TAREA ---
    const createTaskForm = document.getElementById('create-task-form');
    if (createTaskForm) {
        createTaskForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evitamos que la página se recargue

            // 1. Recoger los datos del formulario
            const title = document.getElementById('task_title').value;
            const description = document.getElementById('task_description').value;
            const dueDate = document.getElementById('due_date').value;

            if (!title) {
                M.toast({ html: 'El título es obligatorio.' });
                return;
            }

            // 2. Crear un objeto de tarea con un ID único
            const newTask = {
                id: Date.now(), // Usamos el timestamp como ID simple y único
                title: title,
                description: description,
                dueDate: dueDate
            };

            // 3. Obtener tareas existentes de localStorage o crear un array vacío
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            // 4. Añadir la nueva tarea y guardarla en localStorage
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // 5. Notificar al usuario y redirigir al dashboard
            M.toast({ html: '¡Tarea guardada con éxito!' });
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
        });
    }

    // --- LÓGICA DE LA PÁGINA DE EDITAR TAREA ---
    const editTaskForm = document.getElementById('edit-task-form');
    if (editTaskForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const taskId = parseInt(urlParams.get('id'));

        if (!taskId) {
            M.toast({ html: 'ID de tarea no válido. Redirigiendo...' });
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const taskToEdit = tasks.find(task => task.id === taskId);

            if (!taskToEdit) {
                M.toast({ html: 'Tarea no encontrada. Redirigiendo...' });
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
            } else {
                // Rellenar el formulario con los datos existentes de la tarea
                document.getElementById('task_title').value = taskToEdit.title;
                document.getElementById('task_description').value = taskToEdit.description;
                document.getElementById('due_date').value = taskToEdit.dueDate;
                
                // Actualiza los labels de Materialize para que no se superpongan con el texto
                M.updateTextFields();

                // Manejar el envío del formulario de edición
                editTaskForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    // Recoger los valores actualizados del formulario
                    const updatedTitle = document.getElementById('task_title').value;
                    const updatedDescription = document.getElementById('task_description').value;
                    const updatedDueDate = document.getElementById('due_date').value;

                    if (!updatedTitle) {
                        M.toast({ html: 'El título es obligatorio.' });
                        return;
                    }

                    // Encontrar el índice de la tarea y actualizarla
                    const taskIndex = tasks.findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        tasks[taskIndex].title = updatedTitle;
                        tasks[taskIndex].description = updatedDescription;
                        tasks[taskIndex].dueDate = updatedDueDate;
                    }

                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    M.toast({ html: '¡Tarea actualizada con éxito!' });
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
                });
            }
        }
    }

    // --- LÓGICA DE LA PÁGINA DEL DASHBOARD ---
    const taskContainer = document.getElementById('task-list-container');
    if (taskContainer) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        if (tasks.length === 0) {
            taskContainer.innerHTML = '<div class="col s12"><p class="center-align">No tienes tareas pendientes. ¡Añade una nueva usando el botón +!</p></div>';
        } else {
            let allTasksHTML = '';
            tasks.forEach(task => {
                const taskCardHTML = `
                    <div class="col s12 m6 l4">
                        <div class="card">
                            <div class="card-content">
                                <span class="card-title">${task.title}</span>
                                <p style="min-height: 40px;">${task.description || 'Sin descripción.'}</p>
                                <p class="grey-text" style="margin-top: 1rem;">Vence: ${task.dueDate || 'Sin fecha.'}</p>
                            </div>
                            <div class="card-action">
                                <a href="edit-task.html?id=${task.id}">Editar</a>
                                <a href="#" class="red-text" onclick="deleteTask(${task.id})">Eliminar</a>
                            </div>
                        </div>
                    </div>
                `;
                allTasksHTML += taskCardHTML;
            });
            taskContainer.innerHTML = allTasksHTML;
        }
    }
});