document.addEventListener('DOMContentLoaded', function() {
  let notes_toggle = document.querySelector("#notes_toggle")
  let trash_toggle = document.querySelector("#trash_toggle")
  notes_toggle.addEventListener('click', toggle_notes_view)
  trash_toggle.addEventListener('click', toggle_trash_view)
  toggle_notes_view()
})

function toggle_notes_view() {
  let notes_view = document.querySelector("#notes")
  let trash_view = document.querySelector("#trash")
  notes_view.style.display = 'block'
  trash_view.style.display = 'none'
  renderNotes(notes,false);
}

function toggle_trash_view() {
  let notes_view = document.querySelector("#notes")
  let trash_view = document.querySelector("#trash")
  notes_view.style.display = 'none'
  trash_view.style.display = 'block'
  renderNotes(notes,true);
}

const initialNotes = [
  {
    id: 0,
    trash: false,
    creation_date: new Date(),
    title: "Shopping",
    body: "Nintendo",
    color: "#F28B82"
  },
  {
    id: 1,
    trash: true,
    creation_date: new Date(),
    title: "Edutacion",
    body: "Codeable",
    color: "#CCFF90"
  }
]

const noteFromStorage = JSON.parse(localStorage.getItem("notes"))
const notes = noteFromStorage || initialNotes

// const noteFromStorage = JSON.parse(localStorage.getItem("notes"))
// const notes = noteFromStorage || initialNotes
// notes.sort((a,b)=>(a.creation_date<b.creation_date) ? 1:-1) // Newwest first

function createNote(note) {
  notes.push(note)
  localStorage.setItem("notes", JSON.stringify(notes))
}

function permanentDeleteNote(note){
  const index = notes.indexOf(note)
  notes.splice(index,1)
  localStorage.setItem("notes", JSON.stringify(notes))
}

function moveNote(note){
  const index = notes.indexOf(note)
  note.trash = !note.trash
  notes[index] = note
  console.log(note)
  localStorage.setItem("notes", JSON.stringify(notes))
}

function editNote(note){
  // TO DO
  const edit_div = document.createElement('div');
  edit_div.innerHTML = 
  `<form id="edit_form_${note.id}">
    <label for="title">Title:</label><br>
    <input type="text" id="title" name="title" value="${note.title}"><br>
    <label for="body">Body:</label><br>
    <textarea type="date" id="body" name="body">${note.body}</textarea><br>
    <label for="color">Color:</label><br>
    <select name="color">
      <option value="#FFFFFF">Blank</option>
      <option value="#F28B82">Salmon</option>
      <option value="#FBBC04">Orange</option>
      <option value="#FFF475">Yellow</option>
      <option value="#CCFF90">Green</option>
      <option value="#A7FFEB">Emerald</option>
      <option value="#CBF0F8">Skyblue</option>
      <option value="#AECBFA">Steel</option>
      <option value="#D7AEFB">Purple</option>
      <option value="#FDCFE8">Pink</option>
    </select>
    <input type="submit" value="Update!">
    <button>Cancel</button>
  </form>`
  let note_div = document.querySelector(`#note_${note.id}`)
  let select = edit_div.querySelectorAll("select")
  note_div.append(edit_div)
  const edit_form = document.querySelector(`#edit_form_${note.id}`)
  cancel_button=edit_form.querySelector("button")
  cancel_button.addEventListener("click", (event) => {
    edit_div.remove()
  })
  edit_form.addEventListener("submit", (event) => {
    editNoteDetail(event,note)
    toggle_notes_view()
  })
}

function editNoteDetail(event,note) {
  event.preventDefault()
  const {title, body, color} = event.target.elements
  const updatedNote = {
    id: note.id,
    trash: note.trash,
    creation_date: note.creation_date,
    title: title.value,
    body: body.value,
    color: color.value
  }
  const index = notes.indexOf(note)
  notes[index] = updatedNote
  localStorage.setItem("notes", JSON.stringify(notes))
}

const form = document.querySelector("form")

form.addEventListener("submit", (event) => {
  event.preventDefault()
  
  const {title, body, color} = event.target.elements
  let last_id = -1
  if (notes.at(-1) != undefined) {
    last_id = notes.at(-1).id
  }
  const newNote = {
    id: last_id + 1,
    trash: false,
    creation_date: new Date(),
    title: title.value,
    body: body.value,
    color: color.value
  }
  createNote(newNote)
  createNoteEl(newNote)
})

function createNoteEl(note) {
  const colors = {
    "#FFFFFF":"blank",
    "#FBBC04":"Orange",
    "#F28B82":"Salmon",
    "#FFF475":"Yellow",
    "#CCFF90":"Green",
    "#A7FFEB":"Emerald",
    "#CBF0F8":"Skyblue",
    "#AECBFA":"Steel",
    "#D7AEFB":"Purple",
    "#FDCFE8":"Pink"
}
  
  const div = document.createElement("div")
  div.setAttribute("id", `note_${note.id}`)
  div.style.backgroundColor = note.color
  const title = document.createElement("h3")
  title.textContent = note.title
  const body = document.createElement("p")
  body.textContent = note.body
  const edit = document.createElement("button")
  edit.textContent = "Edit note"
  const to_trash = document.createElement("button")
  to_trash.textContent = "Move to trash"
  const to_active = document.createElement("button")
  to_active.textContent = "Restore"
  const erase = document.createElement("button")
  erase.textContent = "Permanently delete"
  const select = document.createElement("select")
  for (const [key,value] of Object.entries(colors)) {
    var opt = document.createElement('option');
    opt.value = key;
    opt.innerHTML = value;
    select.appendChild(opt);
  }

  div.append(title)
  div.append(body)
  div.append(select)
  div.append(edit)
  div.append(to_trash)
  div.append(to_active)
  div.append(erase)

  let notesList = document.querySelector("#active_notes_list")
  edit.style.display = 'block'
  to_trash.style.display = 'block'
  to_active.style.display = 'none'
  erase.style.display = 'none'

  if (note.trash==true) {
    notesList = document.querySelector("#trash_notes_list")
    edit.style.display = 'none'
    to_trash.style.display = 'none'
    to_active.style.display = 'block'
    erase.style.display = 'block'
  } 
  notesList.prepend(div)

  edit.addEventListener("click", (event) => {
    editNote(note);
    // renderNotes(notes,true);
  });

  to_trash.addEventListener("click", (event) => {
    event.preventDefault();
    moveNote(note);
    toggle_trash_view()
    // renderNotes(notes,true);
  });

  to_active.addEventListener("click", (event) => {
    event.preventDefault();
    moveNote(note);
    toggle_notes_view()
    // renderNotes(notes,note.trash);
  });

  erase.addEventListener("click", (event) => {
    event.preventDefault();
    permanentDeleteNote(note);
    renderNotes(notes,true);
  });

  select.addEventListener("change", (event) => {
    editColorNote(event,note);
  });
  select.value = note.color
  // return div
}

function editColorNote(event,note) {
  const index = notes.indexOf(note)
  note.color = event.target.value
  notes[index] = note
  localStorage.setItem("notes", JSON.stringify(notes))
  renderNotes(notes,note.trash)
}

function renderNotes(notes,trash_status) {
  let notesList = document.querySelector("#active_notes_list")
  if (trash_status==true) {
    notesList = document.querySelector("#trash_notes_list")
  } 
  notesList.innerHTML = "";
  let filteredNotes = notes.filter(note => note.trash == trash_status)
  filteredNotes.sort((a,b)=>(a.creation_date<b.creation_date) ? -1:1) // Newwest first
  filteredNotes.forEach(note => {
    createNoteEl(note)
    // const noteEl =  createNoteEl(note,notesList);
    // notesList.append(noteEl)
  });
}
