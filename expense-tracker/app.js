const text = document.getElementById("text");
const amount = document.getElementById("amount");
const form = document.getElementById("form");
const list = document.getElementById("list");
const btn = document.querySelector(".btn");
const incomeTrans = document.getElementById("money-plus");
const balance = document.getElementById("balance");
const expenseTrans = document.getElementById("money-minus");

const getLocalStorage = JSON.parse(localStorage.getItem("transactions"));

let transactions =
  localStorage.getItem("transactions") !== null ? getLocalStorage : [];

form.addEventListener("submit", addTransaction);
function addTransaction(e) {
  e.preventDefault();
  const textValue = text.value;
  const amountValue = amount.value;

  if (!textValue || !amountValue) {
    alert("Please fill in the form");
  } else {
    const transaction = {
      id: generateID().toString(),
      text: text.value,
      amount: +amount.value,
    };

    addToLocalStorage(transaction);
    displayTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = "";
    amount.value = "";
  }
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function updateValues() {
  const total = transactions
    .map(mapTrans)
    .reduce(function (total, transaction) {
      total += transaction;
      return total;
    }, 0)
    .toFixed(2);

  const expense = (
    transactions
      .map(mapTrans)
      .filter(filterExpenses)
      .reduce(function (total, transaction) {
        return (total += transaction);
      }, 0) * -1
  ).toFixed(2);

  const income = transactions
    .map(mapTrans)
    .filter(filterIncome)
    .reduce(function (total, transaction) {
      return (total += transaction);
    }, 0)
    .toFixed(2);

  expenseTrans.innerText = `$${expense}`;
  incomeTrans.innerText = `$${income}`;
  balance.innerText = `$${total}`;
}

function mapTrans(transaction) {
  return transaction.amount;
}

function filterExpenses(transaction) {
  if (transaction < 0) {
    return transaction;
  }
}

function filterIncome(transaction) {
  if (transaction > 0) {
    return transaction;
  }
}

function deleteItem(e) {
  const item = e.currentTarget.parentElement;
  const id = item.dataset.id;

  list.removeChild(item);

  removeFromLocalStorage(id);
  updateValues();
}
function addToLocalStorage(transaction) {
  transactions.push(transaction);
  updateLocalStorage();
}
function removeFromLocalStorage(id) {
  transactions = transactions.filter(function (transaction) {
    console.log(transactions);
    if (transaction.id !== id) {
      return transaction;
    }
  });

  updateLocalStorage();
}
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function displayTransactionDOM(transaction) {
  const sign = transaction.amount > 0 ? "+" : "-";
  const element = document.createElement("li");
  const attribute = document.createAttribute("data-id");
  attribute.value = transaction.id;

  element.setAttributeNode(attribute);
  element.classList.add(transaction.amount > 0 ? "plus" : "minus");
  element.innerHTML = `   ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button type="button" class="delete-btn" >x</button>
  `;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  list.appendChild(element);
}

transactions.forEach(displayTransactionDOM);
updateValues();
