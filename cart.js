const jwtToken = localStorage.getItem('token');
let cartProducts = [];

async function parseJson() {
  try {
    const response = await fetch("http://158.160.154.243:8080/api/cart", {
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
      cartProducts.push(
            {
                id: products[i].productId,
                name: products[i].productName,
                price: products[i].price,
                image: products[i].image,
                amount: products[i].quantity
            }
        );
    }
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

function loadEmptyCartScreen() {
  document.querySelector('.cart-container').innerHTML = `
  <div class="no-products">
    <img class="no-products__photo" src="images/cookie_monster_sad.jpg">
    <span>корзина пуста :(</span>
    <a href="catalog.html">К КАТАЛОГУ</a>
  </div>
  `;
}

function loadProducts() {

  const cartContainer = document.querySelector(".products-container");
  cartProducts.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    let cost = product.amount * product.price;

    card.innerHTML = `
    <div class="image-container"><img src="${product.image}"></div>
    <span class="product-card__name">${product.name}</span>
    <div class="addmore" id="${product.id}">
      <button class="less-button">-</button>
      <span class="count">${product.amount}</span>
      <button class="more-button">+</button>
    </div>
    <div class="line"></div>
    <span class="product-card__cost">₽${cost}</span>
    <i class="fa-solid fa-trash" style="cursor: pointer;"></i>
    `;
    cartContainer.appendChild(card);
  });
}

function loadInfoAboutOrder(isPickup = false) {
  const resultSpan = document.querySelector(".result");
  const costSpan = document.querySelector(".result-cost");
  const deliverySpan = document.querySelector(".result-delivery");

  let totalCost = cartProducts.reduce((accumulator, product) => {
    return accumulator + (product.amount * product.price);
  }, 0);
  let totalDelivery = 0;
  if (totalCost > 0) { 
    if (totalCost < 500) {
      totalDelivery = 499;
    }
    if (totalCost < 800) {
      totalDelivery = 399;
    }
    if (totalCost < 1200) {
      totalDelivery = 299;
    } 
    if (totalCost < 1500) {
      totalDelivery = 199;
    }
    if (totalCost < 1800) {
      totalDelivery = 99;
    }
  }

  costSpan.textContent = '₽' + totalCost;
  deliverySpan.textContent = '₽' + totalDelivery;
  if (isPickup) {
    resultSpan.textContent = '₽' + totalCost;
  } else {
    resultSpan.textContent = '₽' + (totalCost + totalDelivery);
  }
}

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
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

function removeFromCart(productId) {
  const data = {
    productId: productId,
  };
  console.log(data);
  const url = `http://158.160.154.243:8080/api/cart/all`;
  fetch(url, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
      'Token': jwtToken,
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

function makeOrder() {
  const url = `http://158.160.154.243:8080/api/order`;
  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
      'Token': jwtToken,
      'Access-Control-Allow-Origin': '*'
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
  window.location.href = 'catalog.html';
}

document.addEventListener("DOMContentLoaded", async function() {
  const orderButton = document.getElementById("button-order");
  orderButton.addEventListener("click", makeOrder)
  await parseJson();
  if (cartProducts.length === 0) {
    loadEmptyCartScreen();
    return;
  }
  loadProducts();
  loadInfoAboutOrder();

  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach(card => {
    const addmore = card.querySelector(".addmore");
    const moreButton = card.querySelector(".more-button");
    const lessButton = card.querySelector(".less-button");
    const countSpan = card.querySelector(".count");
    const deleteAll = card.querySelector(".fa-trash");

    const productId = addmore.id;
    const selectedProduct = cartProducts.find(product => product.id == productId);
    var count = selectedProduct.amount;
    var costSpan = card.querySelector(".product-card__cost");

    deleteAll.addEventListener("click", function() {
      card.remove();
      removeFromCart(selectedProduct.id);
      loadInfoAboutOrder();
      loadEmptyCartScreen();
    });

    moreButton.addEventListener("click", function(){
      editCart("POST", productId);
      count++;
      countSpan.textContent = count;
      costSpan.textContent = '₽' + count * parseInt(selectedProduct.price);
      cartProducts.find(product => product.id == productId)['amount']++;
      loadInfoAboutOrder();
    })

    lessButton.addEventListener("click", function(){
      editCart("DELETE", productId);
      count--;
      if (count == 0) {
        card.remove();
      }
      countSpan.textContent = count;
      costSpan.textContent = '₽' + count * parseInt(selectedProduct.price);
      cartProducts.find(product => product.id == productId)['amount']--;
      loadInfoAboutOrder();
      loadEmptyCartScreen();
    })

    const pickupCheckbox = document.getElementById('pickup-checkbox');

    pickupCheckbox.addEventListener('change', function(event) {
      if (this.checked) {
        document.querySelector(".result-delivery").style.textDecoration = 'line-through';
        loadInfoAboutOrder(true);
      } else {
        document.querySelector(".result-delivery").style.textDecoration = 'none';
        loadInfoAboutOrder();
      }
    });
  });
});

// import Product from "./product_class.js";
// import Cart from "./cart_class.js";

// // создание корзины, если ее еще нет в локальном хранилище
// var cart;
// const cartJSON = localStorage.getItem('cart');
// const productDatabase = JSON.parse(localStorage.getItem('productDatabase'));

// if (cartJSON) {
//   cart = new Cart();
//   Object.assign(cart, JSON.parse(cartJSON)); //копируем данные для временного объекта
// } else {
//   cart = new Cart();
//   localStorage.setItem('cart', JSON.stringify(cart));
// }

// function loadCount() {
//   var cartCounters = document.querySelectorAll('.cart-count');
//   cartCounters.forEach(cartCount => {
//     cartCount.textContent = cart.count;
//   })
// }

// function loadProducts() {
//   if (cart.products.length == 0) {
//     document.querySelector('.cart-container').innerHTML = `
//       <div class="no-products">
//         <img class="no-products__photo" src="images/cookie_monster_sad.jpg">
//         <span>корзина пуста :(</span>
//         <a href="catalog.html">К КАТАЛОГУ</a>
//       </div>
//     `;
//     return;
//   }
//   const cartContainer = document.querySelector(".products-container");

//   cart.products.forEach(product => {
//     const card = document.createElement("div");
//     card.classList.add("product-card");
//     let cost = product.quantity * parseInt(product.price.substring(1));

//     card.innerHTML = `
//     <div class="image-container"><img src="${product.imageUrl}"></div>
//     <span class="product-card__name">${product.name}</span>
//     <div class="addmore" id="${product.id}">
//       <button class="less-button">-</button>
//       <span class="count">${product.quantity}</span>
//       <button class="more-button">+</button>
//     </div>
//     <div class="line"></div>
//     <span class="product-card__cost">₽${cost}</span>
//     `;
//     cartContainer.appendChild(card);
//   });
// }

// function loadInfoAboutOrder(isPickup = false) {
//   const resultSpan = document.querySelector(".result");
//   const costSpan = document.querySelector(".result-cost");
//   const deliverySpan = document.querySelector(".result-delivery");

//   let totalCost = cart.cost;
//   let totalDelivery = cart.delivery;

//   costSpan.textContent = '₽' + totalCost;
//   deliverySpan.textContent = '₽' + totalDelivery;
//   if (isPickup) {
//     resultSpan.textContent = '₽' + totalCost;
//   } else {
//     resultSpan.textContent = '₽' + (totalCost + totalDelivery);
//   }
// }

// document.addEventListener("DOMContentLoaded", function(){
//   loadCount();
//   loadProducts();
//   loadInfoAboutOrder();

//   const productCards = document.querySelectorAll(".product-card");
//   productCards.forEach(card => {
//     const addmore = card.querySelector(".addmore");
//     const moreButton = card.querySelector(".more-button");
//     const lessButton = card.querySelector(".less-button");
//     const countSpan = card.querySelector(".count");

//     const productId = addmore.id;
//     const selectedProduct = cart.products.find(product => product.id === productId);
//     var count = selectedProduct.quantity;
//     var costSpan = card.querySelector(".product-card__cost");

//     moreButton.addEventListener("click", function() {
//       cart.addProduct(selectedProduct);
//       count++;
//       countSpan.textContent = count;
//       costSpan.textContent = '₽' + count * parseInt(selectedProduct.price.substring(1));
//       loadInfoAboutOrder();
//       loadCount();
//     })

//     lessButton.addEventListener("click", function(){
//       cart.removeProduct(selectedProduct);
//       count--;
//       if (count == 0) {
//         card.remove();
//       }
//       countSpan.textContent = count;
//       costSpan.textContent = '₽' + count * parseInt(selectedProduct.price.substring(1));
//       loadInfoAboutOrder();
//       loadCount();
//     })
//   });

//   const pickupCheckbox = document.getElementById('pickup-checkbox');

//   pickupCheckbox.addEventListener('change', function(event) {
//     if (this.checked) {
//       document.querySelector(".result-delivery").style.textDecoration = 'line-through';
//       loadInfoAboutOrder(true);
//       loadCount();
//     } else {
//       document.querySelector(".result-delivery").style.textDecoration = 'none';
//       loadInfoAboutOrder();
//       loadCount();
//     }
//   });
// });

// window.addEventListener('beforeunload', function() {
//   localStorage.setItem('cart', JSON.stringify(cart)); // записываем в локальное хранилище данные из временного объекта
// });