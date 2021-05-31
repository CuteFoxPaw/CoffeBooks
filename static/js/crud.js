// getBooks.js is the 'read' part of crud

// Adds book to database,
async function addBookToDataBase(event) {
  try {
    event.preventDefault();
    // Booktitle is requried
    if (this.addTitle.value != null) {
      let book = {
        title: this.addTitle.value,
        serie: this.addSerie.value,
        searchSerieQuery: this.addSerie.value.toLowerCase(),
        author: this.addAuthor.value,
        year: this.addYear.value,
        synopsis: this.addSynopsis.value,
        timestamp: Date.now(),
        uid: firebase.auth().currentUser.uid,
        editors: {},
      };
      // with uid - relation, to know who the book belongs to
      await bookCol.add(book);
      removeElement('#bookAdderId');
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateBooks(event) {
  /*var db = firebase.firestore(); // grants access firestore-database
  var bookCol = db.collection('books');

  //eventet är händelsen = submit
  console.log('firebase.auth().currentUser;', firebase.auth().currentUser.uid);
  console.log('this', this);

  try {
    event.preventDefault();

    // gets editors, 
    let editorDoc = await firebase
      .firestore()
      .collection('books')
      .doc(this.updId.value)
      .get();

    arrEditors = [];
    arrEditors = editorDoc.data().editors;

    arrEditors[firebase.auth().currentUser.uid] = Date.now();

    var updateObj = {};
    if (this.updTitle.value) updateObj['title'] = this.updTitle.value;
    if (this.updSerie.value) updateObj['serie'] = this.updSerie.value;
    if (this.updSerie.value)
      updateObj['searchSerieQuery'] = this.updSerie.value.toLowerCase();
    if (this.updAuthor.value) updateObj['author'] = this.updAuthor.value;
    if (this.updYear.value) updateObj['year'] = this.updYear.value;
    if (this.updSynopsis.value) updateObj['synopsis'] = this.updSynopsis.value;
    updateObj['editors'] = arrEditors;

    await bookCol.doc(this.updId.value).update(updateObj);
    removeElement('#bookUpdateId');
  } catch (error) {
    console.log(error.message);
  }*/
  try {
    event.preventDefault();

    let book = {
      title: this.updTitle.value,
      serie: this.updSerie.value,
      releaseYear: this.updYear.value,
      author: this.updAuthor.value,
      synopsis: this.updSynopsis.value,
    };

    postFetch(book, '/API/book/update');
  } catch (error) {
    console.log(error);
  }
}

async function postFetch(data, url) {
  let response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: data,
  });

  console.log(response);
}

async function deleteDocs(docs) {
  try {
    await db.collection('books').doc(docs).delete();
  } catch (error) {
    console.log(error.message);
  }
}
