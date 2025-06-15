const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const drinkSection = document.getElementById("drinkSection");
const groupList = document.getElementById("groupList");
const groupCount = document.getElementById("groupCount");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeButton = document.querySelector(".close-button");

let groupDrinks = [];

const loadDefaultDrinks = async () => {
  try {
    const res = await fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a"
    );
    const data = await res.json();
    const drinks = data.drinks.slice(0, 8);
    displayDrinks(drinks);
  } catch (err) {
    drinkSection.innerHTML = "<p>Failed to load drinks.</p>";
  }
};

const displayDrinks = (drinks) => {
  drinkSection.innerHTML = "";
  drinks.forEach((drink) => {
    const div = document.createElement("div");
    div.classList.add("drink-card");
    const isAdded = groupDrinks.includes(drink.strDrink);
    div.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
      <h3>${drink.strDrink}</h3>
      <p>Category: ${drink.strCategory}</p>
      <p>${drink.strInstructions.slice(0, 15)}...</p>
      <button class="add" id="add-btn-${drink.idDrink}" onclick="addToGroup('${
      drink.strDrink
    }', '${drink.idDrink}')"" ${isAdded ? "disabled" : ""}>${
      isAdded ? "✅ Already Added" : "➕ Add to Group"
    }</button>
      <button class="details" onclick="showDetails('${
        drink.idDrink
      }')">Details</button>
    `;
    drinkSection.appendChild(div);
  });
};

const searchDrink = async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();
    if (data.drinks) {
      displayDrinks(data.drinks);
    } else {
      drinkSection.innerHTML = `<p>No drink found for ${query}.</p>`;
    }
  } catch (err) {
    drinkSection.innerHTML = "<p>Failed to search drinks.</p>";
  }
};

const addToGroup = (drinkName, id) => {
  if (groupDrinks.length >= 7) {
    alert("You can't add more than 7 drinks to the group.");
    return;
  }
  if (groupDrinks.includes(drinkName)) return;

  groupDrinks.push(drinkName);
  updateGroupList();

  const addBtn = document.getElementById(`add-btn-${id}`);
  if (addBtn) {
    addBtn.textContent = "✅ Already Added";
    addBtn.disabled = true;
  }
};

const updateGroupList = () => {
  groupList.innerHTML = "";
  groupDrinks.forEach((drink) => {
    const li = document.createElement("li");
    li.textContent = drink;
    groupList.appendChild(li);
  });
  groupCount.textContent = groupDrinks.length;
};

const showDetails = async (id) => {
  modal.style.display = "flex";
  modalBody.innerHTML = "Loading...";

  try {
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    const drink = data.drinks[0];

    modalBody.innerHTML = `
      <div class="modal-drink-details">
          <h2>${drink.strDrink}</h2>
          <hr>
          <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
          <p><strong>Category:</strong> ${drink.strCategory}</p>
          <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
          <p><strong>Glass:</strong> ${drink.strGlass}</p>
          <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
          <p><strong>Ingredients:</strong> 
            ${[drink.strIngredient1, drink.strIngredient2, drink.strIngredient3]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
    `;
  } catch (err) {
    modalBody.innerHTML = "<p>Failed to load details.</p>";
  }
};

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

searchBtn.addEventListener("click", searchDrink);
window.addEventListener("load", loadDefaultDrinks);
