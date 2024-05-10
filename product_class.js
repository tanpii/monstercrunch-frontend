//класс продукта
class Product {
  constructor(id, name, description, price, imageUrl, isSpecialMenu = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this.isSpecialMenu = isSpecialMenu;
  }
}

export default Product;
