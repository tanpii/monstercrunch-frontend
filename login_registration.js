document.addEventListener("DOMContentLoaded", function() {
  let loginForm = document.querySelector(".login-form");
  loginForm.addEventListener("submit", submitLoginForm);

  async function submitLoginForm(event) {
      event.preventDefault();
      
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;
      
      let formData = {
          email: email,
          password: password
      };
      
      try {
          const response = await fetch('http://158.160.154.243:8080/api/signin', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(formData)
          });

          if (!response.ok) {
            if (response.status === 403) {
              let errorMessage = document.getElementById('login_error');
              errorMessage.style.display = "block";
              setTimeout(() => {
                  errorMessage.style.display = "none";
              }, 4000);
            }
            throw new Error('Ошибка отправки запроса');
          }

          const data = await response.json();
          console.log('Успешно отправлено:', data);
          const token = data.token;
          localStorage.setItem('token', token);
          if (await isAdmin()){
            window.location.href = 'panel.html';
          } else {
            window.location.href = 'profile.html';
          }
      } catch (error) {
          console.error('Ошибка:', error);
      }
  }

  let registrationForm = document.querySelector(".registration-form");
  registrationForm.addEventListener("submit", submitRegistrationForm);

  async function submitRegistrationForm(event) {
      event.preventDefault();

      let customerName = document.getElementById('name').value;
      let customerSurname = document.getElementById('surname').value;
      let email = document.getElementById('new-email').value;
      let password = document.getElementById('new-password').value;

      let formData = {
          customerName,
          customerSurname,
          email,
          password
      };

      try {
          const response = await fetch('http://158.160.154.243:8080/api/signup', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(formData)
          });

          if (!response.ok) {
              throw new Error('Ошибка отправки запроса');
          }

          const data = await response.json();
          console.log('Успешно отправлено:', data);
          const token = data.token;
          localStorage.setItem('token', token);
          if (await isAdmin()){
            window.location.href = 'panel.html';
          } else {
            window.location.href = 'profile.html';
          }
      } catch (error) {
          console.error('Ошибка:', error);
      }
  }
});
