import Cart from "./cart_class.js";

document.addEventListener("DOMContentLoaded", function(){
  if (localStorage.getItem('cart') != null) {
    var cartData = JSON.parse(localStorage.getItem('cart'));
    var cart = new Cart();
    cart.products = cartData.products;
    var cartCounters = document.querySelectorAll('.cart-count');
    cartCounters.forEach(cartCount => {
      cartCount.textContent = cart.count;
    });
  }
})
