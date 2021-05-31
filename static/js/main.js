const db = firebase.firestore(); // grants access firestore-database

fblUser = firebase.auth().currentUser; // FireBookListUser

const bookCol = db.collection('books');

const DQ = document.querySelector.bind(document);

firebase.auth().onAuthStateChanged(async (firebaseUser) => {
  try {
    // if user is logged in render and remove some stuff
    if (firebaseUser) {
      customRender(
        'input',
        'button',
        'Add Book to Libary',
        'openBookForm',
        '#addContainer'
      );
      DQ('#openBookForm').addEventListener('click', renderAddBook);

      // try {
      /*
    return console.log(`!! DEV-MANUAL-WARNING !!
    Intentionallt cutting out rest of function and returning console.log! This is on line ${
      Error().lineNumber
    } in main.js. 
    This keeps unfixed errors from fireing!
    !/ DEV-MANUAL-WARNING /!`); /* */
      console.log(firebaseUser.uid);
      let raw = await db.collection('users').doc(firebaseUser.uid).get();

      // Render usernamne (and role) to welcomescreen

      if (await raw.data()) {
        let username = await raw.data().username;

        document.getElementById('username').innerHTML =
          'Welcome to The Book List ' + username;

        if (raw.data().role) {
          document.getElementById(
            'username'
          ).innerHTML += `, <br> Your privilages are: ${await raw.data().role}`;
        }
      }

      // } catch (err) {
      //   console.log(err.message);
      // }
    } else {
      // if user is NOT logged in render and remove some stuff

      if (DQ('#openBookForm')) removeElement('#openBookForm');

      document.getElementById('username').innerText = `Please log in!`;
    }
  } catch (error) {
    console.log(error);
  }
});

//!! STOP DO NOT WORK WITH ROLES OR USERNAMES JUST GET SHIT DONE

//!!!!!! --------------------------------------
/* TODO Add an eventlisterner on the buttons which already exist, ie body onload.
The let those listeners look for a parameter when the button are prestet and send 'this' into the  correct fucntion.
Else create / destroy ecentlistners when creating buttons
*/
//!!!!!! --------------------------------------
