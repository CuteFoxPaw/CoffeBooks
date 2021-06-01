// getBooks.js is the 'read' part of crud

// Adds book to database,
async function addBookToDataBase(event) {
  try {
    event.preventDefault();

    let book = {
      title: this.addTitle.value,
      serie: this.addSerie.value,
      releaseYear: this.addYear.value,
      author: this.addAuthor.value,
      synopsis: this.addSynopsis.value,
    };

    let res = await postFetch(book, '/API/book/create');
    if (res.status != 201 || res.status != 202) {
      alert(res.text());
    } else {
      removeElement('#bookAdderId');
      if (window.location.pathname == '/') {
        book.id = 'N/a';
        renderClientBook(book);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateBooks(event) {
  try {
    event.preventDefault();

    let book = {
      title: this.updTitle.value,
      serie: this.updSerie.value,
      releaseYear: this.updYear.value,
      author: this.updAuthor.value,
      synopsis: this.updSynopsis.value,
      id: this.updId.value,
    };

    let res = await postFetch(book, '/API/book/update');

    if ((await res.status) != 201) {
      alert(await res.text());
    } else {
      removeElement('#bookUpdateId');
      if (window.location.pathname == '/') {
        replaceClientBook(book);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function postFetch(data, url) {
  try {
    let body = JSON.stringify(data);
    let response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      body: body,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function deleteDocs(id) {
  try {
    let data = {
      id: id,
    };
    let body = JSON.stringify(data);
    let res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'delete',
      body: body,
    });

    if (res.status != 201 || res.status != 202) {
      alert(res.text());
    } else {
      if (window.location.pathname == '/') {
        document.getElementById(id).innerHTML = '';
      }
    }
  } catch (error) {
    console.log(error);
  }
}
