// класс корзины
class Cart {
  products;

  constructor() {
    this.products = [];
  }
  get count() {
    // суммируем количество каждого продукта в корзине
    return this.products.reduce((acc, product) => acc + product.quantity, 0);
  }
  get delivery() {
    const totalCost = this.cost;
    var totalDelivery;
    if (totalCost > 0) { 
      if (totalCost < 500) {
        return 499;
      }
      if (totalCost < 800) {
        return 399;
      }
      if (totalCost < 1200) {
        return 299;
      } 
      if (totalCost < 1500) {
        return 199;
      }
      if (totalCost < 1800) {
        return 99;
      }
    }
    return 0;
  }
  addProduct(product) {
    // проверяем, есть ли уже продукт в корзине
    const existingProductIndex = this.products.findIndex(p => p.id === product.id);

    if (existingProductIndex !== -1) {
      // если продукт уже в корзине, увеличиваем его количество (создаем новое свойство quantity)
      this.products[existingProductIndex].quantity += 1;
    } else {
      // в противном случае, добавляем новый продукт с начальным количеством 1
      this.products.push({ ...product, quantity: 1 }); //оператор распыления (spread operator), который создает поверхностную копию объекта product. Таким образом, он копирует все свойства из объекта product в новый объект.
    }
  }
  removeProduct(productToRemove) {
    const index = this.products.findIndex(product => product.id === productToRemove.id);
  
    if (index !== -1) {
      // уменьшаем количество продукта в корзине
      this.products[index].quantity -= 1;
  
      // если количество становится равным 0, удаляем продукт из корзины
      if (this.products[index].quantity === 0) {
        this.products.splice(index, 1);
      }
    } else {
      console.error("Продукт не найден в корзине");
    }
  }
  get cost() {
    // считаем общую стоимость всех продуктов в корзине
    const totalCost = this.products.reduce((acc, product) => {
      const productCost = parseInt(product.price.substring(1)) * product.quantity;
      return acc + productCost;
    }, 0);

    return totalCost;
  }
}

export default Cart;