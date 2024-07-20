import { v4 as uuidv4 } from 'uuid';

import * as basicLightbox from 'basiclightbox';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';

const input = document.querySelector('.input-js');
const btn = document.querySelector('.btn-add');
const list = document.querySelector('.todo-list');

export const buttonUpdate =
  '<button type="button" class="btn-update" ></button>';
export const buttonDelete =
  '<button type="button" class="btn-delete" >del</button> </div>';

const storageKey = 'todo';

let modalUpdate = null;

btn.addEventListener('click', addTodo);
list.addEventListener('click', updateTodo);
list.addEventListener('click', changeStatus);
list.addEventListener('click', deleteTodo);

function addTodo() {
  if (!input.value.trim()) {
    return alert('FALSE');
  }
  const storageData = JSON.parse(localStorage.getItem(storageKey)) || [];
  const newTodo = { id: uuidv4(), text: input.value, status: 'todo' };
  console.log(newTodo);
  storageData.push(newTodo);
  localStorage.setItem(storageKey, JSON.stringify(storageData));
  list.insertAdjacentHTML('beforeend', markup(newTodo));
  input.value = '';
}

function markup(obj) {
  const todoBtn = obj.status === 'todo' ? buttonUpdate : buttonDelete;
  return `<li class="${obj.status}" id="${obj.id}">
    <p> ${obj.text}</p> 
    ${todoBtn}
  </li>`;
}

function updateTodo(event) {
  if (!event.target.classList.contains('btn-update')) {
    return;
  }

  modalUpdate = basicLightbox.create(
    `<div class="modal-container">
    <button type="button" class="btn-close-modal">X</button><input type="text" class="input-modal"/><button type="button" class="btn-update-modal" id="${event.target.parentNode.id}">Update todo</button></div>`,
    {
      closable: false,
    }
  );
  modalUpdate.show();
  const modalInput = document.querySelector('.input-modal');
  const modalUpdateBtn = document.querySelector('.btn-update-modal');
  const closeBtn = document.querySelector('.btn-close-modal');

  closeBtn.addEventListener('click', modalUpdate.close);
  modalUpdateBtn.addEventListener('click', evt =>
    updateTodoText(evt, modalInput.value)
  );
}

function updateTodoText(e, value) {
  if (!value.trim()) {
    return alert('FALSE');
  }
  [...list.children].forEach(el => {
    if (el.id === e.target.id) {
      el.firstElementChild.textContent = value;
    }
  });
  const data = JSON.parse(localStorage.getItem(storageKey));
  const updateData = data.map(el =>
    el.id === e.target.id ? { ...el, text: value } : el
  );
  localStorage.setItem(storageKey, JSON.stringify(updateData));
  modalUpdate.close();
}

const storageReload = JSON.parse(localStorage.getItem(storageKey));

if (storageReload) {
  list.insertAdjacentHTML('beforeend', storageReload.map(markup).join(''));
}

function changeStatus(e) {
  if (e.target.nodeName !== 'LI') {
    return false;
  }
  if (e.target.classList.contains('todo')) {
    e.target.classList.replace('todo', 'complete');
    e.target.lastElementChild.remove();
    e.target.insertAdjacentHTML('beforeend', buttonDelete);
  } else {
    e.target.classList.replace('complete', 'todo');
    e.target.lastElementChild.remove();
    e.target.insertAdjacentHTML('beforeend', buttonUpdate);
  }

  const data = JSON.parse(localStorage.getItem(storageKey));
  const updatedData = data.map(el =>
    el.id === e.target.id ? { ...el, status: e.target.classList[0] } : el
  );
  localStorage.setItem(storageKey, JSON.stringify(updatedData));
}

function deleteTodo(e) {
  if (!e.target.classList.contains('btn-delete')) {
    return;
  }
  e.target.parentNode.remove();
  const data = JSON.parse(localStorage.getItem(storageKey));
  const updatedData = data.filter(el => el.id !== e.target.parentNode.id);
  localStorage.setItem(storageKey, JSON.stringify(updatedData));
}
