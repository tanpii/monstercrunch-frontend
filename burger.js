async function isAuthorised() {
  const jwtToken = localStorage.getItem('token');
  let result = false;
  if (jwtToken !== null) {
    try {
      const response = await fetch(`http://158.160.154.243:8080/api`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
          'token': `${jwtToken}`,
          'Access-Control-Allow-Origin': '*'
        },
      });
      result = await response.json();
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
  return result;
}

async function isAdmin() {
  const jwtToken = localStorage.getItem('token');
  let result = false;
  if (jwtToken !== null) {
    try {
      const response = await fetch(`http://158.160.154.243:8080/api/isadmin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
          'token': `${jwtToken}`,
          'Access-Control-Allow-Origin': '*'
        },
      });
      result = await response.json();
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
  return result;
}



document.addEventListener("DOMContentLoaded", function () {
  const showLoginFormButton = document.getElementById("showLoginFormButton");
  const showLoginFormButtonMobile = document.getElementById("showLoginFormButtonMobile");
  const popupLoginForm = document.getElementById("loginForm");
  const closeLoginFormButton = document.getElementById("closeLoginFormButton");
  const toRegistrationFormButton = document.getElementById("to-registration-button");
  const toLoginFormButton = document.getElementById("to-login-button");
  const popupRegistrationForm = document.getElementById("registrationForm");
  const closeRegistrationFormButton = document.getElementById("closeRegistrationFormButton");

  showLoginFormButton.addEventListener("click", async function () {
    const isAuthorisedResult = await isAuthorised();
    const isAdminResult = await isAdmin();

    console.log(isAuthorisedResult, isAdminResult);
    
    if (isAdminResult === true) {
      console.log("Redirecting to panel.html");
      window.location.href = 'panel.html';
    } else if (isAuthorisedResult === true) {
      console.log("Redirecting to profile.html");
      window.location.href = 'profile.html';
    } else {
      console.log("Showing login form");
      popupLoginForm.style.display = "flex";
    }
  });

  showLoginFormButtonMobile.addEventListener("click", async function () {
    const isAuthorisedResult = await isAuthorised();
    const isAdminResult = await isAdmin();

    if (isAdminResult === true) {
      console.log("Redirecting to panel.html");
      window.location.href = 'panel.html';
    } else if (isAuthorisedResult === true) {
      console.log("Redirecting to profile.html");
      window.location.href = 'profile.html';
    } else {
      console.log("Showing login form");
      popupLoginForm.style.display = "flex";
    }
  });

  closeLoginFormButton.addEventListener("click", function () {
      popupLoginForm.style.display = "none";
  });

  toRegistrationFormButton.addEventListener("click", function () {
    popupLoginForm.style.display = "none";
    popupRegistrationForm.style.display = "flex";
  });

  toLoginFormButton.addEventListener("click", function () {
    popupRegistrationForm.style.display = "none";
    popupLoginForm.style.display = "flex";
  });
  
  showLoginFormButton.addEventListener("click", function () {
    popupLoginForm.style.display = "flex";
  });

  showLoginFormButtonMobile.addEventListener("click", function () {
    popupLoginForm.style.display = "flex";
  });

  closeLoginFormButton.addEventListener("click", function () {
      popupLoginForm.style.display = "none";
  });

  closeRegistrationFormButton.addEventListener("click", function () {
    popupRegistrationForm.style.display = "none";
  });

  const burgerButton = document.querySelector(".header-burger");
  const mobileMenu = document.querySelector(".mobile-menu");

  burgerButton.addEventListener("click", function(event) {
    event.stopPropagation(); 
    if (!mobileMenu.classList.contains("active")) {
      mobileMenu.classList.add("active");
      mobileMenu.style.display = "block";
      burgerButton.style.transform = "rotate(90deg)";
    } else {
      mobileMenu.classList.remove("active");
      mobileMenu.style.display = "none";
      burgerButton.style.transform = "rotate(0deg)";
    }
  });
})