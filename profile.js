const jwtToken = localStorage.getItem('token');
let favouriteProducts = [];
let orders = [];
let userInfo

async function parseProducts() {
  try {
    const response = await fetch("http://158.160.154.243:8080/api/fav", {
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
    const products = await response.json();
    for (let i = 0; i < products.length; i++) {
      console.log(products[i]);
      favouriteProducts.push({
                id: products[i].productId,
                name: products[i].productName,
                description: products[i].description,
                price: products[i].price,
                image: products[i].image
      });
    }
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

async function parseOrders() {
  try {
    const response = await fetch("http://158.160.154.243:8080/api/order", {
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
    orders = await response.json();
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

async function parseUserInfo() {
  try {
    const response = await fetch("http://158.160.154.243:8080/api/customer", {
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
    userInfo = await response.json();
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

function loadProducts(products) {
  const favouriteContainer = document.querySelector(".favourite-products");
  favouriteContainer.innerHTML = '';

  if(products.length === 0) {
    favouriteContainer.innerHTML = `
    <div class="empty-fav">
        <img class="profile-empty" src="images/cookie_monster_sad.jpg">
        <span>Вы ещё не добавили товары в избранное :(</span>
        <button onclick="window.location.href='catalog.html'">
          К КАТАЛОГУ
        </button>
      </div>`
    return;
  }

  const title = document.createElement("span");
  title.classList.add("favourite-products__title");
  title.textContent = "ИЗБРАННЫЕ ТОВАРЫ";

  favouriteContainer.appendChild(title)

  products.forEach(product => {
    const card = document.createElement("div");
    
    card.classList.add("favourite-product");
      card.innerHTML = `
        <div class="favourite-product__photo"><img src="${product.image}" alt="favourite-product"></div>
        <div class="favourite-product__info">
            <span class="favourite-product__name">${product.name}</span>
            <button class="like-button" id="${product.id}"><i class="heart fa-solid fa-heart"></i></button>
        </div>
      `;
    
      favouriteContainer.appendChild(card);
  });
}

function loadOrders(orders) {
  const ordersContainer = document.querySelector(".orders");

  if(orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="empty-fav">
        <img class="profile-empty" src="images/cookie_monster_sad.jpg">
        <span>Вы ещё не делали заказы :(</span>
        <button onclick="window.location.href='catalog.html'">
          К КАТАЛОГУ
        </button>
      </div>`
    return;
  }

  orders.forEach(order => {
    const card = document.createElement("div");

    let productsHtml = '';

    for (let i = 0; i < 3 && i < order.orderProduct.length; i++) {
      let product = order.orderProduct[i];
      productsHtml += `<div class="order-product"><img src="${product.image}" alt="${product.name}"></div>`
    }
    if (order.orderProduct.length - 3 >  0) {
      productsHtml += `<div class="order-other">+${order.orderProduct.length - 3}</div>`;
    }
    
    card.classList.add("order-card");
      card.innerHTML = `
        <span class="order-card__time">${formatDate(order.orderTime)}</span>
        <span class="order-card__cost">₽${order.price}</span>
        <div class="order-products">
            ${productsHtml}
        </div>
      `;
    
    ordersContainer.appendChild(card);
  });
}

function loadProfile(userInfo) {
  const profileContainer = document.querySelector(".profile-personal");

  profileContainer.innerHTML = `
    <span class="profile-personal__name"><b>ИМЯ: </b>${userInfo.customerName} ${userInfo.customerSurname}</span>
    <span class="profile-personal__email"><b>ПОЧТА: </b>${userInfo.email}</span>
    <button class="profile-personal__exit-button">ВЫЙТИ</button>
  `;
}

function formatDate(offsetDateTimeString) {
  // Преобразовать Unix время в миллисекунды
  const milliseconds = offsetDateTimeString * 1000;
  const date = new Date(milliseconds);

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  const formattedDate = `${day} ${months[monthIndex]} в ${hours}:${(minutes < 10 ? '0' : "") + minutes}`;

  return formattedDate;
}


document.addEventListener("DOMContentLoaded", async function() {
  await parseProducts();
  await parseOrders();
  await parseUserInfo();
  loadProducts(favouriteProducts);
  loadOrders(orders);
  loadProfile(userInfo);

  let exitButton = document.querySelector('.profile-personal__exit-button');
  exitButton.addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  })

  const cards = document.querySelectorAll('.favourite-product'); 

  cards.forEach(card => {
    const likeButton = card.querySelector(".favourite-product__info .like-button");
    const productId = likeButton.id;

    likeButton.addEventListener('click', async function() {
      const heart = likeButton.querySelector(".heart");

      let method;
      if (heart.classList.contains("fa-regular")) {
          method = 'POST';
      } else {
          method = 'DELETE';
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
});