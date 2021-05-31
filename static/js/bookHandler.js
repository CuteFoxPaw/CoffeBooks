checkBookIntegrity();

console.log('Book-id:', getQueryVariable('book'));

const db = firebase.firestore(); // grants access firestore-database
const DQ = document.querySelector.bind(document); // Can now write doc--.querySelector(--) as DQ(--)
const bookId = getQueryVariable('book');

// Loads bookdata
// getBookData();

//Makes sure book exist before doing anything else
async function checkBookIntegrity() {
  if (getQueryVariable('book') == false) {
    window.location.href = '/';
  } else {
    try {
      let docRef = await firebase
        .firestore()
        .collection('books')
        .doc(getQueryVariable('book'));

      docRef.get().then((doc) => {
        if (!doc.exists) {
          document.body.innerHTML = `
        <h2> Error 404: Book not found</h2>`;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

// Loads and unloads stuff depending on login-status
firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    var updButton = `<button id="bookUpdater" onClick="renderUpdateForm('${bookId}')">Update book</button`;
    document.querySelector('#bookDoer').innerHTML = updButton;
  } else {
    if (DQ('#bookUpdater')) removeElement('#bookUpdater');
  }
});

// Renders book info to page

db.collection('books')
  .doc(bookId)
  .onSnapshot(async (doc) => {
    book = await doc;
    console.log(await book.data());
    renderTitle(await book.data());
    renderInfo(await book.data());
    renderSynopsis(await book.data());
    findOtherBooksInSerie(await book.data());
    renderCreatorAndEditors(await book.data());
  });

// gets url get-var
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

async function renderTitle(book) {
  // Print title & serie

  var item = document.createElement('div');

  item.innerHTML = `<h2>${await book.title}</h2><br>`;

  if (await book.serie) item.innerHTML += `<h3><i>${await book.serie}</i></h3>`;

  item.id = 'bookTitle';

  DQ('#bookTitle')
    ? (DQ('#bookTitle').innerHTML = item.innerHTML)
    : DQ('#title').appendChild(item);
}

async function renderInfo(book) {
  // Print Author, realese and pages
  var item = document.createElement('div');
  item.id = 'bookInfo';

  if (book.author) {
    item.innerHTML = `<div> Written by: ${book.author}</div><br>`;
  }
  if (book.year) {
    item.innerHTML += `<div> Release year: ${book.year}</div><br>`;
  }
  if (book.pages) {
    item.innerHTML += `<div> Amount of pages: ${book.pages}</div><br>`;
  }
  if (item != '') {
    DQ('#bookInfo')
      ? (DQ('#bookInfo').innerHTML = item.innerHTML)
      : DQ('#info').appendChild(item);
  }
}

async function renderSynopsis(book) {
  var item = document.createElement('div');

  // Print synopsis
  console.log(await book.synopsis);
  item.id = 'bookSynopsis';
  if (await book.synopsis) {
    item.innerHTML = `<p>${await book.synopsis}</p>`;
  } else {
    item.innerHTML = `
  <p><i>
  This book seems to lack a synopsis. 
  If you know any information about it, please 
  update it to complete our database!</i></p>`;
  }
  item.id = 'bookSynopsis';

  //DQ('#synopsis').appendChild(item);

  console.log('bookSynops Exists:', DQ('#bookSynopsis') != undefined);
  if (DQ('#bookSynopsis') != undefined) {
    DQ('#bookSynopsis').innerHTML = item.innerHTML;
  } else {
    DQ('#synopsis').appendChild(item);
  }
}

async function findOtherBooksInSerie(book) {
  // Looks and checks weather there are other books in the same serie
  var books = [];

  const bookLister = firebase.firestore().collection('books');

  bookLister
    .where('searchSerieQuery', '==', book.searchSerieQuery)
    .orderBy('year', 'asc')
    .onSnapshot((docs) => {
      var books = [];
      booksUndefiend = [];

      // docChanges() gets changing documents, snapshot gets changed collection
      docs.docChanges().forEach((element) => {
        if (book.title != element.doc.data().title && element.doc.data().year) {
          books.push({ id: element.doc.id, data: element.doc.data() });
        } else if (book.title != element.doc.data().title) {
          booksUndefiend.push({ id: element.doc.id, data: element.doc.data() });
        }
      });
      console.log(books);
      if (books.length != 0) {
        console.log(books);
        DQ(
          '#otherBooks'
        ).innerHTML = `<h3>Other books in the serie: ${book.serie}</h3><hr><br></div>  `;
        renderOtherBooksInSerie(books, book);
        DQ('#otherBooks').innerHTML += `<br>`;
        renderOtherBooksInSerie(booksUndefiend, book);
      } else {
        DQ(
          '#otherBooks'
        ).innerHTML = `<h3>Other books in serie; ${book.serie}</h3><br><i> There are no other books in this serie </i>`;
      }
    });
}

async function renderOtherBooksInSerie(info, book) {
  let output = info.map((i) => {
    if (i.data.year > book.year && i.data.year) {
      return `
    <a href="bookReader.html?book=${i.id}" id="${i.id}">
    <h3><i>Sequel</i>: ${i.data.title}</h3></a>    
    `;
    } else if (i.data.year < book.year && i.data.year) {
      return `
    <a href="bookReader.html?book=${i.id}" id="${i.id}">
    <h3><i>Prequel</i>: ${i.data.title}</h3></a>    
    `;
    } else {
      return `
      <a href="bookReader.html?book=${i.id}" id="${i.id}">
      <h3> ${i.data.title}</h3></a>    
      `;
    }
  });
  document.querySelector('#otherBooks').innerHTML += output.join('<br>');
}

async function renderCreatorAndEditors(book) {
  console.log('editors', book.editors);
  let output = `Creator: ${await getUsernameById(book.uid)} <br>`;
  let outputEditors = `Editors: `;
  for (var key in book.editors) {
    if (book.editors.hasOwnProperty(key)) {
      outputEditors += ` ${await getUsernameById(key)}, `;
    }
  }

  DQ('#creatorAndEditor').innerHTML = `<h3>Creator And Editors</h3><hr>`;
  DQ('#creatorAndEditor').innerHTML += output;
  if (outputEditors != `Editors: `) {
    DQ('#creatorAndEditor').innerHTML += outputEditors;
  }
  /* 
  let outputs = book.editors.map((i, time) => {
    if (i.data.year > book.year && i.data.year) {
      return `
    <a href="bookReader.html?book=${i.id}" id="${i.id}">
    <h3><i>Sequel</i>: ${i.data.title}</h3></a>    
    `;
    } else if (i.data.year < book.year && i.data.year) {
      return `
    <a href="bookReader.html?book=${i.id}" id="${i.id}">
    <h3><i>Prequel</i>: ${i.data.title}</h3></a>    
    `;
    } else {
      return `
      <a href="bookReader.html?book=${i.id}" id="${i.id}">
      <h3> ${i.data.title}</h3></a>    
      `;
    }
  });
  document.querySelector('#otherBooks').innerHTML += output.join('<br>'); */
}
