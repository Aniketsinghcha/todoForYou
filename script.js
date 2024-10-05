particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        color: { value: "#ff69b4" },
        shape: {
            type: "circle",
            stroke: { width: 0, color: "#000" },
            polygon: { nb_sides: 5 },
        },
        opacity: { value: 0.5, random: false, anim: { enable: false } },
        size: {
            value: 5,
            random: true,
            anim: { enable: false },
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ff69b4",
            opacity: 0.4,
            width: 1,
        },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false },
        },
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
        },
    },
    retina_detect: true,
});



const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");
const filters = document.querySelectorAll(".filter");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Initialize the app
document.addEventListener("DOMContentLoaded", renderTodos());
 

    // Check if title exists
    const title = document.getElementById("title");
    if (title) {
        title.style.opacity = 1; // Make sure it's visible before animation

        // Initial text animation
        gsap.from(title, {
            duration: 2,
            scale: 0,
            opacity: 0,
            ease: "bounce.out",
            onComplete: () => {
                gsap.to(title, { rotation: 360, duration: 1 });
            }
        });
    } else {
        console.error("Title element not found");
    }

    // Animate the roses on load
    const roses = document.querySelectorAll('.rose');
    if (roses.length > 0) {
        roses.forEach((rose, index) => {
            gsap.from(rose, {
                duration: 1,
                scale: 0,
                opacity: 0,
                delay: index * 0.3, // Staggered delay for each rose
                ease: "back.out(1.7)"
            });
        });
    } else {
        console.error("No rose elements found");
    }

    // Ensure renderTodos function exists
    if (typeof renderTodos === "function") {
        renderTodos(); // Initialize the app
    } else {
        console.error("renderTodos function not defined");
    }
 


// Initialize the app (make sure renderTodos() is defined in your script)
renderTodos();
addTodoBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (!todoText) return;

    const todo = { text: todoText, completed: false };
    todos.push(todo);
    saveTodos();
    renderTodos("all");
    todoInput.value = "";
    playSound();

    // Celebrate the addition with confetti
    createConfettiEffect();
}

function renderTodos(filter = "all") {
    todoList.innerHTML = "";
    const filteredTodos = filterTodos(filter);

    filteredTodos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.textContent = todo.text;
        if (todo.completed) li.classList.add("completed");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTodo(index);
        });

        li.appendChild(deleteBtn);
        li.addEventListener("click", () => toggleComplete(index));

        todoList.appendChild(li);
        animateAddTodoItem(li);
    });

    gsap.to(window, { scrollTo: { y: document.body.scrollHeight, autoKill: false }, duration: 0.5 });
}

function filterTodos(filter) {
    if (!Array.isArray(todos)) return [];
    if (filter === "pending") {
        return todos.filter(todo => !todo.completed);
    } else if (filter === "completed") {
        return todos.filter(todo => todo.completed);
    }
    return todos;
}

function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    const li = todoList.children[index];
    gsap.to(li, { 
        opacity: 0, 
        y: -20, 
        duration: 0.5, 
        onComplete: () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos(); 
        } 
    });
}

function animateAddTodoItem(item) {
    gsap.from(item, { 
        opacity: 0, 
        scale: 0.5, 
        y: 20, 
        duration: 0.5,
        ease: "elastic.out(1, 0.5)", // Elastic effect for added todos
        onComplete: () => {
            gsap.to(item, { 
                rotation: 360, // Slight rotation effect after adding
                duration: 0.5 
            });
        }
    });
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

filters.forEach(filter => {
    filter.addEventListener("click", () => {
        const currentFilter = filter.getAttribute("data-filter");
        gsap.to(todoList, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                renderTodos(currentFilter);
                gsap.to(todoList, { opacity: 1, duration: 0.3 });
            }
        });
    });
});

addTodoBtn.addEventListener("mouseover", () => {
    gsap.to(addTodoBtn, { scale: 1.1, duration: 0.3 });
});

addTodoBtn.addEventListener("mouseout", () => {
    gsap.to(addTodoBtn, { scale: 1, duration: 0.3 });
});

todoInput.addEventListener("focus", () => {
    gsap.to(todoInput, { scale: 1.05, duration: 0.3 });
});

todoInput.addEventListener("blur", () => {
    gsap.to(todoInput, { scale: 1, duration: 0.3 });
});

function playSound() {
    const audio = new Audio('path/to/your/sound.mp3'); // Update with your sound file
    audio.play();
}

function createConfettiEffect() {
    // Custom confetti effect implementation here
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti");
    document.body.appendChild(confettiContainer);

    // Use GSAP for confetti animation
    gsap.to(confettiContainer, {
        scale: 1,
        opacity: 0,
        duration: 2,
        onComplete: () => confettiContainer.remove(),
        ease: "expo.out"
    });

    // Generate random confetti pieces
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti-piece";
        confetti.style.backgroundColor = getRandomColor();
        confettiContainer.appendChild(confetti);

        gsap.to(confetti, {
            y: -Math.random() * 300,
            x: Math.random() * 100 - 50,
            rotation: Math.random() * 360,
            opacity: 0,
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 0.5,
            ease: "power2.out"
        });
    }
}

function getRandomColor() {
    const colors = ['#ff69b4', '#ffb3d9', '#ff80bf', '#ff4d4d', '#ffd700'];
    return colors[Math.floor(Math.random() * colors.length)];
}
 