$(document).ready(function () {

  // DOM Variables
  const loginBtnEl = $('#login-user');
  const signUpBtnEl = $('#create-user');
  const loginEmail = $('#login_email_address');
  const loginPassword = $('#login_password');
  const signUpfirst_name = $('#first_name');
  const signUplast_name = $('#last_name');
  const signUpemail_address = $('#email_address');
  const signUpuser_name = $('#user_name');
  const signUppassword = $('#password');
  const signUpcountry = $('#country');
  const signUptime_zone = $('#time_zone');



  // check to see if username in use
  async function checkUserName(newUser) {
    console.log(newUser.user_name)
    try {
      const result = await $.ajax({
        url: '/api/user/name',
        data: newUser,
        method: 'GET'
      });
      console.log(result);

      if (result.message === 'That Username is in use') {
        alert('That Username is already in use, please select another');
        return;
      }
      checkEmailAddress(newUser);
    } catch (err) {
      console.log(err);
    }
  };

  // check to see if email address in use
  async function checkEmailAddress(newUser) {



    try {
      const result = await $.ajax({
        url: '/api/user/email',
        data: newUser,
        method: 'GET'
      });
      console.log(result);

      if (result.message === 'That Email Address is in use') {
        alert('That Email Address is already in use, please select another');
        return;
      }
      valPassword(newUser)
    } catch (err) {
      console.log(err);
    }
  };

  // validate password meets requirements
  function valPassword(newUser) {


    const passArray = Array.from(newUser.password);
    console.log(passArray);
    if (passArray.length < 8) {
      alert('please enter a password with at least 8 characters');
      return;
    }

    // go to next step
    console.log('password is good');

    createUser(newUser)
  };


  // post new user
  async function createUser(newUser) {
    console.log(newUser);
    try {
      const result = await $.ajax({
        url: '/api/user/',
        data: newUser,
        method: 'POST'
      });
      if (result.message === 'Login Success!') {
        window.location = '/profile';
      } else {
        window.location = '/login';
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function loginUser(userData) {
    console.log(userData);
    try {
      const result = await $.ajax({
        url: '/login',
        data: userData,
        method: 'POST',
      });

      if (result.message === 'Login Success!') {
        window.location = '/profile';
      } else {
        window.location = '/login';
      }

    } catch (err) {
      console.log(err);
    }
  }


  signUpBtnEl.on('click', (e) => {
    e.preventDefault();
    console.log(signUpfirst_name.val().trim());
    console.log(signUplast_name.val().trim());
    console.log(signUpemail_address.val().trim());
    console.log(signUpuser_name.val().trim());
    console.log(signUppassword.val().trim());
    console.log(signUpcountry.val().trim());
    console.log(signUptime_zone.val().trim());

    const newUser = {
      first_name: signUpfirst_name.val().trim(),
      last_name: signUplast_name.val().trim(),
      email_address: signUpemail_address.val().trim(),
      user_name: signUpuser_name.val().trim(),
      password: signUppassword.val().trim(),
      country_code: signUpcountry.val().trim(),
      time_diff: signUptime_zone.val().trim(),
    }

    checkUserName(newUser);

  });

  loginBtnEl.on('click', (e) => {
    e.preventDefault();
    console.log(loginEmail.val().trim());
    console.log(loginPassword.val().trim());

    const userData = {
      email_address: loginEmail.val().trim(),
      password: loginPassword.val().trim(),
    }

    loginUser(userData);
  })

});