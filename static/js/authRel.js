firebase.auth().onAuthStateChanged(async (firebaseUser) => {
  try {
    if (firebaseUser) {
      console.log(firebaseUser.uid);

      // Removes possible loginFrom
      if (DQ('#formLogin') !== null) {
        removeElement('#formLogin');
      }
      if (DQ('#registerId') !== null) {
        removeElement('#registerId');
      }

      // Renders Sign Out button
      customRender('input', 'button', 'Sign Out', 'signOut', '#singOutButton');
      DQ('#signOut').addEventListener('click', () => {
        firebase.auth().signOut();
      });

      // Removes login/register
      // short hand if-statements, DQ = doc-.qeurySelector()
      if (DQ('#getLogin')) DQ('#getLogin').remove();
      if (DQ('#getRegister')) DQ('#getRegister').remove();

      // If user does not have a username, add it
      let raw = await db.collection('users').doc(firebaseUser.uid).get();
      if (!(await raw.data())) {
        renderUsernameRequest();
      }
    } else {
      // Remove login button
      if (DQ('#signOut')) DQ('#signOut').remove();
      if (DQ('#openBookForm')) DQ('#openBookForm').remove();

      // Generates LoginButton
      customRender(
        'input',
        'button',
        'Log In',
        'getLogin',
        '#userAuthControls'
      );

      DQ('#getLogin').addEventListener('click', renderLogin);

      // Generates Registerbutton
      customRender(
        'input',
        'button',
        'Register',
        'getRegister',
        '#userAuthControls'
      );

      DQ('#getRegister').addEventListener('click', renderRegister);
    }
  } catch (error) {
    console.log(error);
  }
});

// Log in the user
function loginUser(event) {
  try {
    event.preventDefault();
    console.log(this);

    const email = this.email.value;
    const pwd = this.pwd.value;

    const promise = firebase.auth().signInWithEmailAndPassword(email, pwd);
    promise.catch((e) => alert(e.message));

    removeElement('#loginId');
  } catch (error) {
    console.log(error);
  }
}

//registers and adds username
async function registerUserInFirebase(event) {
  try {
    event.preventDefault();
    if (firebase.auth().currentUser == null) {
      console.log(
        'Registering when not logged in',
        firebase.auth().currentUser
      ); // expected null
      console.log(this);
      const email = this.email.value;
      const pwd = this.pwd.value;
      const promise = firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd);
      promise.catch((e) => alert(e.message));
      if (!promise.catch()) removeElement('#registerId');
      //firebase baksida, du har inte tillgång till auth tabellen
    } else {
      console.log('User cannot regsiter when signed in!');
    }
  } catch (error) {
    console.log(error);
  }
}

// Adds username to collection user
async function addUsernameToUsercollection(event) {
  try {
    event.preventDefault();
    if (this.usernameField.value) {
      let newUser = { username: this.usernameField.value };

      await db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set(newUser);
      removeElement('#usernameId');
    } else {
      alert(`Username is empty! Make sure to fill out all fields!`);
    }
  } catch (error) {
    console.log(error);
  }
}
// Get a users username by thier id
async function getUsernameById(uid) {
  console.log(uid);
  let raw = await db.collection('users').doc(uid).get();

  // Render usernamne (and role) to welcomescreen

  if (await raw.data()) {
    return await raw.data().username;
  }
}
