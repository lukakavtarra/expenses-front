const getShopListDiv = document.getElementById("expanses-list");
const createTotal = document.createElement("div");

// get expenses list from api
const getShopNames = async () => {
  const response = await fetch(`http://localhost:3300/api/expenses/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });

  const shop = await response.json();
  render(shop);
};

render = async (shoppingLists) => {
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
    <i class="fa-solid fa-trash"></i>
    </p>`;

    getShopListDiv.append(shopList);
  });
  // calculating total
  createTotal.innerHTML = `Total: $${total}`;
};

window.onload = async () => {
  await getShopNames();
};
