const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;
// Paleta de colores para las notas (clses CSS)
const colors = ['note-yellow', 'note-pink', 'note-blue', 'note-green', 'note-orange'];

// Crear elemento de nota con texto y clase de color
function createNoteElement(text, colorClass) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass); 
    noteDiv.textContent = text;

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';

    noteDiv.appendChild(deleteButton);
    return noteDiv;
}

// Guardar notas en localStorage
function saveNotes() {
    const notes = [];
    // Recorremos todas las notas en el contenedor
    notesContainer.querySelectorAll('.note').forEach(noteDiv => {
        // Extraemos el texto sin la 'x' de eliminar
        const text = noteDiv.childNodes[0].nodeValue.trim();
        // Buscamos la clase de color (excluyendo 'note' y 'editing')
        const colorClass = Array.from(noteDiv.classList).find(c => c !== 'note' && c !== 'editing' && c !== 'editing');
        notes.push({ text, color: colorClass });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Cargar notas desde localStorage y renderizarlas
function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        try {
            const notes = JSON.parse(storedNotes);
            notes.forEach(noteData => {
                const newNote = createNoteElement(noteData.text, noteData.color);
                notesContainer.appendChild(newNote);
            });
        } catch (e) {
            console.error('Error al parsear notas desde localStorage', e);
        }
    }
}

// Establecer tema inicial según localStorage
function setInitialTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    } else {
        toggleThemeButton.textContent = 'Modo Oscuro';
    }
}


// Habilitar o deshabilitar botón de agregar según input
noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';
});

// Toggle modo oscuro
toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

// Editar nota al hacer doble clic
notesContainer.addEventListener('dblclick', (event) => {
    const target = event.target;
    if (target.classList.contains('note') && !target.classList.contains('editing')) {
        const currentText = target.textContent.slice(0, -1);
        target.textContent = '';
        target.classList.add('editing');

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);

            saveNotes();
        }
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

addButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);
        const newNoteErr = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNoteErr);
        noteInput.value = '';
        addButton.disabled = true;
        saveNotes();
    }
});

notesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

notesContainer.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    }
});

notesContainer.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});

setInitialTheme();
loadNotes();