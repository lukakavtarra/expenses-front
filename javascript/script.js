const createButton = document.createElement("button");

const expensesInputDiv = document.getElementById("expensesInput");

const link = "http://localhost:3300/api/expenses/";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const withBody = async (method, body, id) => {
  const finalLink = id ? `${link}/${id}` : link;
  return fetch(finalLink, {
    method,
    headers,
    body: JSON.stringify(body),
  });
};

const withoutBody = async (method, id) => {
  const finalLink = id ? `${link}/${id}` : link;
  return fetch(finalLink, {
    method,
    headers,
  });
};

// get expenses list from api
const getShopNames = async () => {
  const getApi = await withoutBody("GET");
  const shop = await getApi.json();
  render(shop);
};

// delete expenses
const deleteShopNames = async (id) => {
  const getApi = await withoutBody("DELETE", id);
  const shop = await getApi.json();
  render(shop);
};

// making update input
const editShopList = (item) => {
  const editShopName = document.createElement("input");
  const editPrice = document.createElement("input");

  const currentShopName = item.querySelector(".shopName");
  const currentPrice = item.querySelector(".itemPrice");
  const icons = item.querySelector(".icons");
  const checkIcon = icons.querySelector(".checkIcon");

  const itemName = currentShopName.innerHTML.slice(
    3,
    currentShopName.innerHTML.length
  );
  const firstPrice = currentPrice.innerHTML.slice(
    1,
    currentPrice.innerHTML.length
  );
  if (
    currentShopName.parentNode.innerHTML !==
    `<input class="newShopInput" placeholder="Enter new shop name">`
  ) {
    editShopName.value = itemName;
    currentShopName.innerHTML = ``;

    editShopName.classList = "newShopInput";
    editShopName.placeholder = "Enter new shop name";
    currentShopName.append(editShopName);

    editPrice.value = firstPrice;
    currentPrice.innerHTML = ``;
    editPrice.classList = "newShopInput";
    editPrice.placeholder = "Enter new price";
    editPrice.type = "number";
    currentPrice.append(editPrice);

    checkIcon.addEventListener("click", async () => {
      const updateExpense = {};
      if (editShopName.value == "" && editPrice.value == "") {
        getShopNames();
      } else {
        if (
          (editShopName.value == "" || Boolean(editShopName.value.trim())) &&
          !Number.isNaN(Number(editPrice.value))
        ) {
          if (itemName !== editShopName.value)
            updateExpense.shop = editShopName.value;
          if (Number(firstPrice) !== Number(editPrice.value))
            updateExpense.price = Number(editPrice.value);

          const getApi = await withBody("PATCH", updateExpense, item.title);
          const shop = await getApi.json();
          render(shop);
        } else {
          getErrorMessage();
        }
      }
    });
  }
};

// add expenses
const addExpense = async () => {
  const getShopInput = document.getElementById("shopName");
  const getPriceInput = document.getElementById("moneySpent");
  if (
    Boolean(getShopInput.value.trim()) &&
    !Number.isNaN(Number(getPriceInput.value))
  ) {
    const newExpense = {
      shop: getShopInput.value,
      price: getPriceInput.value,
    };

    getShopInput.value = "";
    getPriceInput.value = "";

    const getApi = await withBody("POST", newExpense);
    const shop = await getApi.json();
    render(shop);
  } else {
    getErrorMessage();
  }
};

const render = async (shoppingLists) => {
  const getShopListDiv = document.getElementById("expanses-list");
  const createTotal = document.createElement("div");

  getShopListDiv.innerHTML = "";
  let total = 0;
  createTotal.id = "totalPrice";
  getShopListDiv.append(createTotal);

  // creating expenses list from API
  shoppingLists.forEach((item, index) => {
    const shopList = document.createElement("div");

    shopList.innerHTML = `<p class="shopName">${index + 1}) ${item.shop}</p>
    <p>${item.createdAt}</p>
    <p class="itemPrice">$${item.price}</p>
    <p class="icons">
    <i class="fa-solid fa-pen-to-square editIcon"></i>
    <i class="fa-solid fa-trash deleteIcon"></i>
    </p>`;

    shopList.title = item.id;
    total += Number(item.price);
    getShopListDiv.append(shopList);
  });

  // calculating total
  createTotal.innerHTML = `Total: $${total}`;

  //making delete button event listener
  const deleteButton = document.querySelectorAll(".deleteIcon");
  deleteButton.forEach((item) => {
    item.addEventListener("click", () =>
      deleteShopNames(item.parentNode.parentNode.title)
    );
  });

  //making edit button event listener
  const editButton = document.querySelectorAll(".editIcon");
  editButton.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList[2] == "editIcon") {
        item.classList = "fa-solid fa-check checkIcon";
        editShopList(item.parentNode.parentNode);
      }
      return;
      // item.remove();
    });
  });
};

window.onload = () => {
  getShopNames();
  createButton.innerText = "Add";
  createButton.addEventListener("click", addExpense);
  expensesInputDiv.append(createButton);
};

//get error message
const getErrorMessage = () => {
  //error messages
  const getMain = document.querySelector("main");
  const wrongValidity = document.createElement("div");
  const errorAlert = document.createElement("p");
  const errorMessage = document.createElement("p");

  wrongValidity.classList = "error-box";
  getMain.appendChild(wrongValidity);

  errorAlert.innerHTML = `<span>!</span> Invalid Shop name or Price`;
  errorMessage.innerHTML = `Please enter valid name or price`;

  errorAlert.classList = "error-alert";
  wrongValidity.append(errorAlert);

  errorMessage.classList = "error-message";
  wrongValidity.append(errorMessage);
  setTimeout(function () {
    wrongValidity.remove();
  }, 3000);
};
