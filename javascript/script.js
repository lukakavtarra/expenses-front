const getShopListDiv = document.getElementById("expanses-list");
const createTotal = document.createElement("div");
const getShopInput = document.getElementById("shopName");
const getPriceInput = document.getElementById("moneySpent");
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
  console.log(withoutBody("GET"));
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
// add expenses
const addExpense = async () => {
  const numRegex = /^\d+$/;
  if (getShopInput.checkValidity() && getPriceInput.checkValidity()) {
    if(Boolean(getShopInput.value.trim()) && numRegex.test(getPriceInput.value) ){
      const newExpense = {
        shop : getShopInput.value,
        price : getPriceInput.value
      };

      const getApi = await withBody("POST", newExpense);
      const shop = await getApi.json();
      render(shop);
    }
  }
};


const render = async (shoppingLists) => {
  getShopListDiv.innerHTML = "";
  let total = 0;
  createTotal.id = "totalPrice";
  getShopListDiv.append(createTotal);

  // creating expenses list from API
  shoppingLists.forEach((item, index) => {
    const shopList = document.createElement("div");

    shopList.innerHTML = `<p>${index + 1})${item.shop}</p>
    <p>${item.createdAt}</p>
    <p>$${item.price}</p>
    <p>
    <i class="fa-solid fa-pen-to-square"></i>
    <i class="fa-solid fa-trash deleteIcon"></i>
    </p>`;

    shopList.title = item.id;
    total += Number(item.price);
    getShopListDiv.append(shopList);
  });

  // calculating total
  createTotal.innerHTML = `Total: $${total}`;
  const deleteButton = document.querySelectorAll(".deleteIcon");
  deleteButton.forEach((item) => {
    item.addEventListener("click", () =>
      deleteShopNames(item.parentNode.parentNode.title)
    );
  });
};
window.onload = async () => {
  await getShopNames();
};

