// could use regExp, but you will solve one problem in order to get two new ones
const DQ = document.querySelector.bind(document);
// gets a html-page or whatever you want to fetch
async function fetchPage(path) {
  try {
    let response = await fetch(path); // returns promise
    return response.text();
  } catch (err) {
    console.log('Fetch error:' + err);
  }
}

// renders loginform and appends to body
async function renderLogin() {
  var loginDiv = document.createElement('div');
  loginDiv.innerHTML = await fetchPage('../html/loginForm.html');

  loginDiv.style = `background-color: rgba(100, 100, 100, 0.8);
  margin: auto;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 5;
  display: flex;
  justify-content: center;`;
  loginDiv.id = 'loginId';

  let resp = await document.body.appendChild(loginDiv);

  console.log('print to screen Login');

  DQ('#formLogin').addEventListener('submit', loginUser);

  DQ('#loginId').addEventListener('click', (event) => {
    if (event.target.id == 'loginId') removeElement('#loginId');
  });
}

// renders registerform and appends to body
async function renderRegister() {
  var registerDiv = document.createElement('div');
  registerDiv.innerHTML = await fetchPage('../html/registerForm.html');

  registerDiv.style = `background-color: rgba(100, 100, 100, 0.8);
  margin: auto;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 5;
  display: flex;
  justify-content: center;`;
  registerDiv.id = 'registerId';

  let resp = await document.body.appendChild(registerDiv);
  console.log('print to screen Register');
  document.querySelector('#formRegister').addEventListener('submit', registerUser);
  DQ('#registerId').addEventListener('click', (event) => {
    if (event.target.id == 'registerId') removeElement('#registerId');
  });
}

// renders addbook-form and appends to body
async function renderAddBook() {
  var bookAdderDiv = document.createElement('div');
  bookAdderDiv.innerHTML = await fetchPage('../html/AddBook.html');

  bookAdderDiv.style = `background-color: rgba(100, 100, 100, 0.8);
  margin: auto;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 5;
  display: flex;
  justify-content: center;`;
  bookAdderDiv.id = 'bookAdderId';

  let resp = await document.body.appendChild(bookAdderDiv);
  console.log('print to screen AddBook');
  document.querySelector('#formAddBook').addEventListener('submit', addBookToDataBase);
  DQ('#bookAdderId').addEventListener('click', (event) => {
    if (event.target.id == 'bookAdderId') removeElement('#bookAdderId');
  });
}

// renders updateform and appends to body
async function renderUpdateForm(bookId) {
  var bookUpdateDiv = document.createElement('div');
  bookUpdateDiv.innerHTML = await fetchPage('../html/updateForm.html');

  bookUpdateDiv.style = `background-color: rgba(100, 100, 100, 0.8);
  margin: auto;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 5;
  display: flex;
  justify-content: center;`;
  bookUpdateDiv.id = 'bookUpdateId';

  let resp = await document.body.appendChild(bookUpdateDiv);
  console.log('-- Add Book Rendered --');
  DQ('#updId').value = bookId;
  DQ('#formUpdate').addEventListener('submit', updateBooks);
  DQ('#bookUpdateId').addEventListener('click', (event) => {
    if (event.target.id == 'bookUpdateId') removeElement('#bookUpdateId');
  });
}

// Allows custom render of elements, meant for input-fields
function customRender(element, type = null, value, id, addTo) {
  var createElement = document.createElement(element);
  if (type) createElement.type = type;
  createElement.value = value;
  createElement.id = id;
  document.querySelector(addTo).appendChild(createElement);
}

// removes parent of element, including queryselectors
function removeParrent(event) {
  console.log(event.parentElement.id);
  document.querySelector(event.parentElement.id).remove();
  console.log('Removed:', event.parentElement.id);
}

// removes element, you can send it as an object or send an id directly, including removal of  queryselectors
function removeElement(event) {
  document.querySelector(event.id || event).remove();
  console.log('Removed:', event.id || event);
}
