async function getAllProducts() {
  try {
    const data = await fetch(
      "https://ecommercebackend.fundamentos-29.repl.co/"
    );
    const res = await data.json();
    window.localStorage.setItem("allProducts", JSON.stringify(res));
    return res;
  } catch (error) {
    console.log(error);
  }
}

function printAllProducts(localData) {
  const products = document.querySelector(".cards");
  let html = "";
  for (const card of localData.products) {
    html += `
    <div class="card shadow hover:shadow-lg hover:shadow-red-500 shadow-red-500 ${
      card.category
    }">
    <div class="card__img">
      <img src="${card.image}" class='hover:animate-ping duration 5s' alt="">
    </div>
    <div class="card__info">
    ${
      card.quantity
        ? ` <i class="bx bx-plus  hover:bg-red-500 transition duration-700 ease-in-out" id="${card.id}"></i>`
        : ""
    }
     
      <h3>$ ${card.price}.00
      ${
        card.quantity
          ? ` <span>Stock:${card.quantity}  </span>`
          : ` <span class="soldOut">Sold out </span>`
      }
     </h3>
      <p>${card.name}</p>
    </div>
  </div>
    `;
  }

  products.innerHTML = html;
}
function handleShowCart() {
  const iconCartHtml = document.querySelector(".bx-shopping-bag");
  const cartHtml = document.querySelector(".cart");
  iconCartHtml.addEventListener("click", function () {
    cartHtml.classList.toggle("cart__show");
  });
}
function handleCloseCart() {
  const iconCartHtml = document.querySelector(".bx-x");
  const cartHtml = document.querySelector(".cart");

  iconCartHtml.addEventListener("click", function () {
    cartHtml.classList.toggle("cart__show");
  });
}

function addToCartFromProducts(localData) {
  const productsHtml = document.querySelector(".cards");
  productsHtml.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.id);

      const productFind = localData.products.find(
        (product) => product.id === id
      );
      if (localData.cart[productFind.id]) {
        if (productFind.quantity === localData.cart[productFind.id].amount)
          return alert("No hay mas");

        localData.cart[productFind.id].amount++;
      } else {
        localData.cart[productFind.id] = { ...productFind, amount: 1 };
      }

      window.localStorage.setItem("cart", JSON.stringify(localData.cart));
      printProductsInCart(localData);
      printTotal(localData);
      handlePrintAmountProducts(localData);
    }
  });
}
function printProductsInCart(localData) {
  const cardProducts = document.querySelector(".cart__products");

  let html = "";

  for (const product in localData.cart) {
    const { quantity, price, name, image, id, amount } =
      localData.cart[product];
    let total = amount * price;
    html += `
        <div class='cart__product'>         
            <div class='cart__product--img'>
              <img src= '${image}' alt= 'imagen' />
            </div>
            <div class='cart__product__body'>
            <h4>
            </h4>
            <p>
            Stock: ${quantity} | ${price}
            <span>$</span>
            </p>
            <p>Subtotal: $ ${total}</p>
            <div class='cart__product--action' id = '${id}'>
            <i class='bx bx-minus'></i>
            <span>${amount} unit</span>
            <i class='bx bx-plus'></i>
            <i class='bx bx-trash-alt'></i>
            </div>
            </div>
        </div>
      `;
  }
  cardProducts.innerHTML = html;
}

function handleProductsInCart(localData) {
  const cartProducts = document.querySelector(".cart__products");
  cartProducts.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-minus")) {
      const id = Number(e.target.parentElement.id);
      if (localData.cart[id].amount > 1) {
        localData.cart[id].amount--;
      } else {
        if (localData.cart[id].amount === 1) {
          delete localData.cart[id];
        }
      }
    }
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.parentElement.id);
      const productFind = localData.products.find(
        (product) => product.id === id
      );
      if (localData.cart[productFind.id]) {
        if (productFind.quantity === localData.cart[productFind.id].amount)
          return alert("No hay mas");
      }
      localData.cart[id].amount++;
    }
    if (e.target.classList.contains("bx-trash-alt")) {
      const id = Number(e.target.parentElement.id);

      delete localData.cart[id];
    }
    window.localStorage.setItem("cart", JSON.stringify(localData.cart));
    printProductsInCart(localData);
    printTotal(localData);
    handlePrintAmountProducts(localData);
  });
}

function printTotal(localData) {
  const infoTotal = document.querySelector(".info__total");
  const infoAmount = document.querySelector(".info__amount");

  let totalProducts = 0;
  let amountProducts = 0;

  for (const product in localData.cart) {
    const { amount, price } = localData.cart[product];
    totalProducts += price * amount;
    amountProducts += amount;
  }
  infoAmount.textContent = amountProducts + " units";
  infoTotal.textContent = "$" + totalProducts + ".00";
}

function handleEmptyProduct(localData) {
  const btnBuy = document.querySelector(".btn__buy");
  btnBuy.addEventListener("click", function () {
    if (!Object.values(localData.cart).length) {
      return alert("El carrito esta vacio");
    }
    const response = confirm("Seguro que quieres comprar?");
    if (!response) return;

    const currentProducts = [];

    for (const product of localData.products) {
      const productCart = localData.cart[product.id];
      if (product.id === productCart?.id) {
        currentProducts.push({
          ...product,
          quantity: product.quantity - productCart.amount,
        });
      } else {
        currentProducts.push(product);
      }
    }
    localData.products = currentProducts;
    localData.cart = {};

    window.localStorage.setItem("products", JSON.stringify(localData.products));
    window.localStorage.setItem("cart", JSON.stringify(localData.cart));

    printTotal(localData);
    printProductsInCart(localData);
    printAllProducts(localData);
    handlePrintAmountProducts(localData);
  });
}

function handlePrintAmountProducts(localData) {
  const amountProducts = document.querySelector(".totalProducts");
  let amount = 0;
  for (const product in localData.cart) {
    amount += localData.cart[product].amount;
  }
  amountProducts.textContent = amount;
}
function handleShowMenu() {
  const dashBoard = document.querySelector(".bxs-dashboard");
  const showMenu = document.querySelector(".menu__mobile");
  dashBoard.addEventListener("click", function (e) {
    showMenu.classList.toggle("show__menu__mobile");
  });
}

function scroll() {
  window.onscroll = function () {
    if (document.documentElement.scrollTop > 20) {
      document.querySelector("header").classList.add("header_show");
    } else {
      document.querySelector("header").classList.remove("header_show");
    }
  };
  document.querySelector(".navbar");
}

function handleCloseMenu() {
  const close = document.querySelector(".close__menu");
  const showMenu = document.querySelector(".menu__mobile");
  close.addEventListener("click", function (e) {
    showMenu.classList.toggle("show__menu__mobile");
  });
}
function darkMode() {
  const darkMode = document.querySelector(".bx-moon");
  const head = document.querySelector("header");
  const body = document.querySelector("body");
  const menu = document.querySelector(".menu__mobile");
  const cart = document.querySelector(".cart");

  darkMode.addEventListener("click", function () {
    body.classList.toggle("darkMode");
    head.classList.toggle("darkMode");
    menu.classList.toggle("darkMode");
    cart.classList.toggle("darkMode");
  });

  if (localStorage.getItem("dark-mode") !== "true") {
    body.classList.add("darkMode");
    head.classList.add("darkMode");
    menu.classList.add("darkMode");
    cart.classList.add("darkMode");
  } else {
    body.classList.remove("darkMode");
    head.classList.remove("darkMode");
    menu.classList.remove("darkMode");
    cart.classList.remove("darkMode");
  }
  if (body.classList.contains("darkMode")) {
    localStorage.setItem("dark-mode", true);
  } else {
    localStorage.setItem("dark-mode", false);
  }
}
function handleFilter() {
  let content = document.querySelectorAll(
    ".button__container .button__products"
  );
  content.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.target.classList.contains("button__products")) {
        content.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
      }
    });
  });
  mixitup(".cards", {
    selectors: {
      target: ".card",
    },
    animation: {
      duration: 300,
    },
  });
}
function printFilter(localData){

  const categories = localData.products.reduce((acum, curr) => {
    acum[curr.category] = acum[curr.category] + 1 || 1;
    return acum;
  }, {});
  
  let html =
    '<div  class=" button__products hover:bg-slate-400 transition duration-700 ease-in-out" data-filter="all">Show All</div>'
  for (const key in categories) {
    html += `<div class="button__products hover:bg-slate-400 transition duration-700 ease-in-out" data-filter=".${key}">
 ${key}  ${categories[key]} units </div>`
  }

  document.querySelector(".button__container").innerHTML = html;
  handleFilter();
}
async function main() {
  const localData = {
    products:
      JSON.parse(window.localStorage.getItem("products")) ||
      (await getAllProducts()),
    cart: JSON.parse(window.localStorage.getItem("cart")) || {},
  };
  getAllProducts();
/*   printAllProducts(localData); */
  addToCartFromProducts(localData);
  printProductsInCart(localData);
  handleProductsInCart(localData);
  printTotal(localData);
  handleEmptyProduct(localData);
  handlePrintAmountProducts(localData);
  handleShowCart();
  handleCloseCart();
  handleShowMenu();
  handleCloseMenu();
  scroll();
  darkMode();
 printFilter(localData)

 /*  const products = await getAllProducts(); */

}
main();
