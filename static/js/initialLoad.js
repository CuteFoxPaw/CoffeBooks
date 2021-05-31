renderPage(true);
async function renderPage(initial = false) {
  try {
    var user = await fetch('/getUser');
    if ((await user.status) === 200) {
      user = await user.json();
    } else {
      var user = 'emptey';
    }

    let data = await getBooks();
    // doesn't relaods all books on auth-state-changed
    if (initial) {
      renderBookColletion(data, user);
    }
    buttonMaster(user);
  } catch (error) {
    console.log(error);
  }
}

async function getBooks() {
  try {
    let data = await fetch('/books');
    data = await data.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Renders intire book collection
async function renderBookColletion(info, user) {
  let output = info.map((i) => {
    let map = `<a href="bookReader?book=${i._id}"><div id="${i._id}">
      <h3>${i.title}, ${i.serie} </h3><br>
      <h3><i>${i.author}</i><br></a>      
      </div>
      `;
    if (user._id) {
      map += `<button onclick="renderUpdateForm('${i._id}')" > update </button> 
        <button onclick="deleteDocs('${i._id}')" > Delete </button>`;
    }
    return map;
  });
  console.log(output);
  document.querySelector('#allBooks').innerHTML = output.join('<hr>');
}
function renderClientBook(info) {
  let output = `<a href="bookReader?book=${info.id}"><div id="${info.id}">
  <h3>${info.title}, ${info.serie} </h3><br>
  <h3><i>${info.author}</i><br></a>      
  </div>
  <button onclick="renderUpdateForm('${info.id}')" > update </button> 
    <button onclick="deleteDocs('${info.id}')" > Delete </button>`;
  console.log(output);
  document.getElementById(info.id).innerHTML += output.join('<hr>');
}

async function replaceClientBook(info) {
  let data = await fetch('/books/' + info.id);
  data = await data.json();

  let map = `<a href="bookReader?book=${data.id}"><div id="${data.id}">
  <h3>${data.title}, ${data.serie} </h3><br>
  <h3><i>${data.author}</i><br></a>      
  </div>
  `;

  console.log(map);
  document.getElementById(info.id).innerHTML = map;
}
async function buttonMaster(user) {
  try {
    /* is user logged in
    ----- */
    console.log(user._id);
    if (user._id) {
      customRender('input', 'button', 'Add Book to Libary', 'openBookForm', '#addContainer');
      DQ('#openBookForm').addEventListener('click', renderAddBook);

      let username = user.nickname;

      document.getElementById('username').innerHTML = 'Welcome to The Book List, ' + username;

      if (DQ('#formLogin') !== null) {
        removeElement('#formLogin');
      }
      if (DQ('#registerId') !== null) {
        removeElement('#registerId');
      }

      // Renders Sign Out button
      customRender('input', 'button', 'Sign Out', 'signOut', '#singOutButton');
      DQ('#signOut').addEventListener('click', () => {
        document.cookie = 'token' + '=; Max-Age=-99999999;';
        renderPage();
      });

      // Removes login/register
      // short hand if-statements, DQ = doc-.qeurySelector()
      if (DQ('#getLogin')) DQ('#getLogin').remove();
      if (DQ('#getRegister')) DQ('#getRegister').remove();
    } else {
      /* is not logged in
      ----- */
      if (DQ('#openBookForm')) removeElement('#openBookForm');

      if (DQ('#signOut')) DQ('#signOut').remove();

      document.getElementById('username').innerText = `Please log in!`;

      // Generates LoginButton
      customRender('input', 'button', 'Log In', 'getLogin', '#userAuthControls');

      DQ('#getLogin').addEventListener('click', renderLogin);

      // Generates Registerbutton
      customRender('input', 'button', 'Register', 'getRegister', '#userAuthControls');

      DQ('#getRegister').addEventListener('click', renderRegister);
    }
  } catch (error) {
    //console.log(error);
  }
}
