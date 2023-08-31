const formulario = document.getElementById('formulario')
const listaTareas = document.getElementById('lista-tareas')
//Se pone content en template, por que yo solo quiero obtener lo que esta dentro 
const template = document.getElementById('template').content
const fragment = document.createDocumentFragment()

//Variable global para las tareas como objeto
let tareas = {}

// Agregamos Eventos
document.addEventListener('DOMContentLoaded', () => {
    //Buscamos si existe algo llamado tareas en el localstorage
    if(localStorage.getItem('tareas')){
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    pintarTareas()
})

formulario.addEventListener('submit', e => {
    e.preventDefault()
    setTarea(e)
})

listaTareas.addEventListener('click', e => {
    btnAcciones(e)
})

const btnAcciones = e => {
    if(e.target.classList.contains('fa-circle-check')){
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
    }
    if(e.target.classList.contains('fa-undo-alt')){
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }
    if(e.target.classList.contains('fa-circle-minus')){
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }
}

const setTarea = e => {
    const texto = e.target.querySelector('input').value

    if(texto.trim() === ''){
        alert('Tarea Vacia')
        return
    }

    const tarea = {
        id: Date.now(),
        texto,
        estado: false
    }

    tareas[tarea.id] = tarea
    pintarTareas()
    formulario.reset()
    e.target.querySelector('input').focus()
}

//PINTAR TAREAAAAAA
const pintarTareas = () => {
    //stringify de variable formato json
    localStorage.setItem('tareas', JSON.stringify(tareas))
    if (Object.values(tareas).length === 0){
    // se compara valor y tipo de dato "==="
        listaTareas.innerHTML = `
            <div class="alert alert-dark">
                Not Task Pending 🤓🤓🤓
            </div>
        `
        return
    }
    //BORRAR TODO LO PREVIO Y PONER LA NUEVA 
    listaTareas.innerHTML = ''
    Object.values(tareas).forEach((tarea) => {
        const clone = template.cloneNode(true)
        //buscar una etiqueta mediante un selector en este caso la etiqueta p
        clone.querySelector('p').textContent = tarea.texto
        if(tarea.estado) {
            clone.querySelectorAll('.fa-solid')[0].classList.replace('fa-circle-check', 'fa-undo-alt')
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }
        clone.querySelectorAll('.fa-solid')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fa-solid')[1].dataset.id = tarea.id
        fragment.appendChild(clone)
    })
    listaTareas.appendChild(fragment)
}