let db;

// open "budgetTracker" in indexedDB
const request = indexedDB.open("budgetDB", 1);

// create ObjectStore
request.onupgradeneeded = (event) => {
  // store reference to indexedDB "budgetTrackerDB"
  const db = event.target.result;
  const BudgetStore = db.createObjectStore("budgetDB", {
    autoincrement: true,
  });
  //   createIndex
  BudgetStore.createIndex("budgetIndex", "budget");
  //   BudgetStore.createIndex("budgetIndex", "expenses");
};

request.onsuccess = function (event) {
  db = event.target.result;
  //check if app is back online
  if (navigator.onLine) {
    console.log("Backend Online");
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
  console.log("error");
};

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["budgetDB"], "readwrite");
  // access your pending object store
  const budgetStore = transaction.objectStore("budgetDB");

  // add record to your store with add method.
  budgetStore.add(record);
}

function checkDatabase() {
  // open a transaction on pending db
  const transaction = db.transaction(["budgetDB"], "readwrite");
  // access your pending object store
  const budgetStore = transaction.objectStore("budgetDB");

  // get all records from store and set to a variable
  const allRecords = budgetStore.getAll();

  allRecords.onsuccess = function () {
    if (allRecords.result.length > 0) {
      fetch("./api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(allRecords.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          const transaction = db.transaction(["budgetTrackerDB"], "readwrite");
          // access your pending object store
          const budgetStore = transaction.objectStore("budgetTrackerDB");

          // clear all items in your store
          budgetStore.clear();
        });
    }
  };
}

window.addEventListener("online", checkDatabase);
