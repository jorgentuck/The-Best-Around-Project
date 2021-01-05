const loginForm = async (event) => {
    event.preventDefault();
  
   
    const email = document.querySelector('#email_address').value.trim();
    const password = document.querySelector('#password').value.trim();
  
    if (email && password) {
      
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        
        document.location.replace('/profile');
      } else {
        alert(response.statusText);
      }
    }
  };
  
  
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);
  
  