'use strict';

const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productCategory = document.getElementById('type');
const productCondition = document.getElementById('condition');
const addBtn = document.getElementById('add-btn');
const clearBtn = document.getElementById('clear-btn');
const searchFilter = document.getElementById('search');
const itemList = document.getElementById('item-list-container');
const tableBody = document.getElementById('tableBody');
let products = [];
let itemToEdit;

if (localStorage.getItem('products')) {
  products = JSON.parse(localStorage.getItem('products'));
  showProduct();
}

addBtn.addEventListener('click', () => {
  const isValid = addProduct();
  if (!isValid) {
    return;
  }
  if (addBtn.innerHTML === 'Add Product') {
    let product = {
      id: generateUniqueId(),
      name: productName.value,
      price: productPrice.value,
      category: productCategory.value,
      condition: productCondition.value,
    };
    products.push(product);
    showProduct();
    clearForm();
    saveProducts();
  } else {
    let editedProduct = {
      id: itemToEdit.id,
      name: productName.value,
      price: productPrice.value,
      category: productCategory.value,
      condition: productCondition.value,
    };
    const index = products.findIndex((item) => item.id === editedProduct.id);
    if (index !== -1) {
      products[index] = editedProduct;
      saveProducts();
      showProduct();
      clearForm();
      addBtn.innerHTML = 'Add Product';
      itemToEdit = undefined; // Clear the itemToEdit variable
    }
  }
});

function showProduct(filteredProducts = products) {
  let items = '';

  for (let i = 0; i < filteredProducts.length; i++) {
    items += `<tr>
      <td>${i + 1}</td>
      <td>${filteredProducts[i].name}</td>
      <td>${filteredProducts[i].price}</td>
      <td>${filteredProducts[i].category}</td>
      <td>${filteredProducts[i].condition}</td>
      <td>
<button class="btn-edit" onClick="editItem('${
      filteredProducts[i].id
    }')">✏️</button>        <button class="btn-delete" onClick="deleteItem('${
      filteredProducts[i].id
    }')">❌</button>
      </td>
    </tr>`;
  }

  tableBody.innerHTML = items;
}

function addProduct() {
  let name = productName.value;
  let price = productPrice.value;
  let category = productCategory.value;
  let condition = productCondition.value;

  if (name.trim() === '') {
    alert('Please enter a product name.');
    return false;
  }

  if (price.trim() === '') {
    alert('Please enter a product price.');
    return false;
  }

  if (isNaN(parseFloat(price))) {
    alert('Please enter a valid product price.');
    return false;
  }

  if (category.trim() === '') {
    alert('Please enter a product category.');
    return false;
  }

  if (condition.trim() === '') {
    alert('Please enter a product condition.');
    return false;
  }

  return true;
}

function editItem(id) {
  const product = products.find((item) => item.id === id);
  if (product) {
    productName.value = product.name;
    productPrice.value = product.price;
    productCategory.value = product.category;
    productCondition.value = product.condition;
    addBtn.innerHTML = 'Save';
    itemToEdit = product;
  }
}

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

clearBtn.addEventListener('click', () => {
  clearForm();
});

function clearForm() {
  productName.value = '';
  productPrice.value = '';
  productCategory.value = '';
  productCondition.value = '';
}

function deleteItem(id) {
  products = products.filter((product) => product.id !== id);
  saveProducts();
  showProduct();
}

function generateUniqueId() {
  const randomNum = Math.floor(Math.random() * 10000);
  return `${randomNum}`;
}

searchFilter.addEventListener('keyup', () => {
  const searchTerm = searchFilter.value.toLowerCase();

  if (products.length) {
    let filteredProducts = products.filter((product) => {
      return product.name.toLowerCase().includes(searchTerm);
    });
    showProduct(filteredProducts);
  }
});
