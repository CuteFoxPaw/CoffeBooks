// Log in the user
async function loginUser(event) {
  try {
    event.preventDefault();

    let data = {
      email: this.email.value,
      password: this.password.value,
    };
    let body = JSON.stringify(data);

    let res = await fetch('/login', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: body,
    });
    removeElement('#loginId');
    if (res.status === 200) {
      renderPage();
    } else {
      alert(await res.text());
    }
  } catch (error) {
    console.log(error);
  }
}

//registers and adds username
async function registerUser(event) {
  try {
    event.preventDefault();

    let data = {
      email: this.email.value,
      nickname: this.nickname.value,
      password: this.password.value,
    };
    let body = JSON.stringify(data);

    var res = await fetch('/register', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: body,
    });

    removeElement('#registerId');
    if (res.status === 201) {
      renderLogin();
    } else {
      alert(res.text());
    }
  } catch (error) {
    console.log(error);
  }
}
