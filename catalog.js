const jwtToken = localStorage.getItem('token');
  
const productDatabase  = [];
let favouriteProductDatabase  = [];

function parseJson() {
  fetch("http://158.160.154.243:8080/api/products", {
      headers: {
          'Access-Control-Allow-Origin': '*'
      }
  })
    .then(function(response){
        return response.json();
    })
    .then(async function(products){
        for (let i = 0; i < products.length; i++) {
            productDatabase.push(
              {
                    id: products[i].productId,
                    name:  products[i].productName,
                    description: products[i].description,
                    price: products[i].price,
                    image: products[i].image,
              }
            );
        }
    let isAuthorisedResult = await isAuthorised();
    let isAdminResult = await isAdmin();
    loadProducts(productDatabase, isAuthorisedResult, isAdminResult); // загружаем продукты на страницу
    setEventListenersToButtons(isAuthorisedResult, isAdminResult);
    setTouchListenersToCards(isAuthorisedResult, isAdminResult);
    })
    .catch(function(error) {
      console.log('Error: ' + error);
    });
}

// Загрузка товаров с сервера
async function loadProducts(products, isAuthorisedResult, isAdminResult) {
  const catalogContainer = document.querySelector(".shop");
  catalogContainer.innerHTML = '';

  if (!products) return;

  products.forEach(async (product) => {
    const card = document.createElement("div");
    card.classList.add("cookie_type");

    card.innerHTML = `
    <div class="img-container">
      <button class="like-button"><i class="heart fa-regular fa-heart"></i></button>
      <div class="cookie_type__price">₽${product.price}</div>
      <img class="cookie_type__image" src="${product.image}" alt="${product.name}">
    </div>
    <div class="cookie_type_text">
      <p class="cookie_type_text__name"><b>${product.name}</b></p>
      <p class="cookie_type_text__info">${product.description}</p>
    </div>
    <div class="cart-button" id="${product.id}">
      <button class="buy-button">КУПИТЬ</button>
      <div class="addmore">
        <button class="less-button">-</button>
        <span class="count">1</span>
        <button class="more-button">+</button>
      </div>
    </div>
    `;
    catalogContainer.appendChild(card);

    if (isAuthorisedResult && !isAdminResult) {
      const isFavorite = await checkFavorite(product.id, jwtToken);

      const heartIcon = card.querySelector('.heart');
      if (isFavorite) {
        heartIcon.classList.add("fa-solid");
        heartIcon.classList.remove("fa-regular");
        favouriteProductDatabase.push(product);
      }
    }
    
  });
}

// узнать избранный ли товар
async function checkFavorite(productId, jwtToken) {
  try {
    const response = await fetch(`http://158.160.154.243:8080/api/fav/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'token': `${jwtToken}`,
        'Access-Control-Allow-Origin': '*'
      },
    });
    const data = await response.json();
    return data.isFavorite;
  } catch (error) {
    console.error('Ошибка:', error);
    return false;
  }
}

// изменение корзины
function editCart(httpMethod, productId) {
    const data = {
      productId: productId,
    };
    const url = `http://158.160.154.243:8080/api/cart`;
    fetch(url, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'Token': jwtToken,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

// количество определенного товара в корзине
async function getCountInCart(productId) {
  const url = `http://158.160.154.243:8080/api/cart/${productId}`;
  try {
      const response = await fetch(url, {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
              'Token': jwtToken,
              'Access-Control-Allow-Origin': '*'
          },
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.amount;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return 0;
  }
}

async function setEventListenersToButtons(isAuthorisedResult, isAdminResult) {
  const cartButtons = document.querySelectorAll(".cart-button");
  cartButtons.forEach(async button => {
    const productId = button.id;
    const buyButton = button.querySelector(".buy-button");

    if (!isAuthorisedResult || isAdminResult) {
      buyButton.addEventListener('click', function() {
        let errorMessage = document.getElementById('unauthorized_error');
        errorMessage.style.display = "block";
        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 4000);
      });
      return;
    } else {
      let count = await getCountInCart(productId);
      const addMoreContainer = button.querySelector(".addmore");
      const moreButton = button.querySelector(".more-button");
      const lessButton = button.querySelector(".less-button");
      const countSpan = button.querySelector(".count");
      if (count > 0) {
        buyButton.style.visibility = "hidden";
        addMoreContainer.style.visibility = "visible";
        countSpan.textContent = count;
      }
      buyButton.addEventListener("click", function() {
        console.log('click');
        buyButton.style.visibility = "hidden";
        addMoreContainer.style.visibility = "visible";
        count++;
        countSpan.textContent = count;
        editCart("POST", productId);
      });
      moreButton.addEventListener("click", function(){
        count++;
        countSpan.textContent = count;
        editCart("POST", productId);
      })
      lessButton.addEventListener("click", function(){
        count--;
        if (count == 0) {
          buyButton.style.visibility = "visible";
          addMoreContainer.style.visibility = "hidden";
        }
        countSpan.textContent = count;
        editCart("DELETE", productId);
      })
    }
  });
}

function setTouchListenersToCards(isAuthorisedResult, isAdminResult) {
  const cards = document.querySelectorAll('.cookie_type'); 

  cards.forEach(card => {
    var isTouched = false;
    const imgContainer = card.querySelector('.img-container .cookie_type__image');
    const textBlock = card.querySelector('.cookie_type_text');
    const textInfoBlock = card.querySelector('.cookie_type_text__info');

    imgContainer.addEventListener('touchstart', function(event) {
      event.preventDefault();
      if (!isTouched) {
        textBlock.classList.add('touch-active');
        textInfoBlock.classList.add('touch-active__info');
        isTouched = true;
      } else {
        textBlock.classList.remove('touch-active');
        textInfoBlock.classList.remove('touch-active__info');
        isTouched = false;
      }
    });

    const likeButton = card.querySelector(".img-container .like-button");
    const productId = card.querySelector('.cart-button').id;

    likeButton.addEventListener('click', async function() {
      if (!isAuthorisedResult || isAdminResult) {
        let errorMessage = document.getElementById('unauthorized_error');
        errorMessage.style.display = "block";
        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 4000);
        return;
      }
      const heart = likeButton.querySelector(".heart");
      let method;
      if (heart.classList.contains("fa-regular")) {
          method = 'POST';
          favouriteProductDatabase.push(productDatabase.find(product => product.id === parseInt(productId)));
      } else {
          method = 'DELETE';
          console.log(favouriteProductDatabase);
          favouriteProductDatabase = favouriteProductDatabase.filter(product => product.id !== parseInt(productId));
      }
      try {
          const response = await fetch('http://158.160.154.243:8080/api/fav', {
              method: method,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`,
                  'Token': `${jwtToken}`,
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                  productId: productId
              })
          });
  
          if (response.ok) {
              if (heart.classList.contains("fa-regular")) {
                  heart.classList.remove("fa-regular");
                  heart.classList.add("fa-solid");
              } else {
                  heart.classList.remove("fa-solid");
                  heart.classList.add("fa-regular");
              }
          } else {
              console.error('Ошибка при выполнении запроса:', response.statusText);
          }
      } catch (error) {
          console.error('Ошибка:', error);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async function() {
  console.log('hello');
  parseJson();

  if (!(await isAuthorised())) {
    let errorMessage = document.getElementById('unauthorized_error');
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 4000);
    return;
  }

  var currentProducts = productDatabase;

  const sortSelect = document.getElementById("sortSelect");
  sortSelect.addEventListener("change", function() {
    const selectedOption = this.value;
    if (selectedOption === "default") {
      loadProducts(currentProducts);
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "ascending") {
      loadProducts([...currentProducts].sort((a, b) => {
        // Преобразуем цены в целые числа
        const priceA = parseInt(a.price);
        const priceB = parseInt(b.price);
        
        // Сравниваем цены как числа
        return priceA - priceB;
      }));
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "descending") {
      loadProducts([...currentProducts].sort((a, b) => {
        // Преобразуем цены в целые числа
        const priceA = parseInt(a.price);
        const priceB = parseInt(b.price);
        
        // Сравниваем цены как числа
        return priceB - priceA;
      }));
      setEventListenersToButtons();
      setTouchListenersToCards();
    }
  });

  const typeSelect = document.getElementById("typeSelect");
  typeSelect.addEventListener("change", function() {
    sortSelect.value = "default";
    const selectedOption = this.value;
    if (selectedOption === "default") {
      currentProducts = productDatabase;
      loadProducts(currentProducts);
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "favourite") {
      currentProducts = favouriteProductDatabase;
      loadProducts(currentProducts);
      setEventListenersToButtons();
      setTouchListenersToCards();
    }
  });
    
});