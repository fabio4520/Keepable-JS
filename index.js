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
}

function toggle_trash_view() {
  let notes_view = document.querySelector("#notes")
  let trash_view = document.querySelector("#trash")
  notes_view.style.display = 'none'
  trash_view.style.display = 'block'
}

const initialNotes = [
  {
    id: 0,
    creation_date: new Date(),
    title: "Shopping",
    body: "Nintendo",
    color: "#F28B82"
  },
  {
    id: 1,
    creation_date: new Date(),
    title: "Edutacion",
    body: "Codeable",
    color: "#CCFF90"
  }
]

const noteFromStorage = JSON.parse(localStorage.getItem("notes"))
const notes = noteFromStorage || initialNotes
notes.sort((a,b)=>(a.creation_date<b.creation_date) ? 1:-1) // Newwest first

function createNote(note) {
  notes.push(note)
  localStorage.setItem("notes", JSON.stringify(notes))
}

function deleteNote(note){
  const index = notes.indexOf(note)
  notes.splice(index,1)
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
  console.log(body.textContent)
  const to_trash = document.createElement("button")
  to_trash.textContent = "Move to trash"
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
  div.append(to_trash)
  const notesList = document.querySelector("#notes_list")
  notesList.prepend(div)

  to_trash.addEventListener("click", (event) => {
    event.preventDefault();
    deleteNote(note);
    renderNotes(notes);
  });

  select.addEventListener("change", (event) => {
    editNote(event,note);
  });
  select.value = note.color
  return div
}

function editNote(event,note) {
  note.color = event.target.value
  renderNotes(notes)
}

function renderNotes(notes) {
  const notesList = document.querySelector("#notes_list")

  notesList.innerHTML = "";

  notes.forEach(note => {
    const noteEl =  createNoteEl(note);
    notesList.append(noteEl)
  });
}

renderNotes(notes);