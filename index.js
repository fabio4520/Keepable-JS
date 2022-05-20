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
  div.setAttribute("id", note.id)
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
  to_trash.style.display = 'block'
  to_active.style.display = 'none'
  erase.style.display = 'none'

  if (note.trash==true) {
    notesList = document.querySelector("#trash_notes_list")
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
    editNote(event,note);
  });
  select.value = note.color
  // return div
}

function editNote(event,note) {
  note.color = event.target.value
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
