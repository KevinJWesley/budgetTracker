let db;

// open "budgetTracker" in indexedDB
const request = indexedDB.open("budgetTrackerDB", 1);

// create ObjectStore
request.onupgradeneeded = (event) => {
  // store reference to indexedDB "budgetTrackerDB"
  db = event.target.result;
  let BudgetStore = db.createObjectStore("budgetTrackerDB", {
    autoincrement: true,
  });
  //   createIndex
  BudgetStore.createIndex("budgetIndex", "deposits");
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
  const transaction = db.transaction(["budgetTrackerDB"], "readwrite");
  // access your pending object store
  const budgetStore = transaction.objectStore("budgetTrackerDB");

  // add record to your store with add method.
  budgetStore.add(record);
}

function checkDatabase() {
  // open a transaction on your pending db
  const transaction = db.transaction(["budgetTrackerDB"], "readwrite");
  // access your pending object store
  const budgetStore = transaction.objectStore("budgetTrackerDB");

  // get all records from store and set to a variable
  const allRecords = budgetStore.getAll();

  allRecords.onsuccess = function () {
    if (allRecords.result.length > 0) {
      fetch("/api/transaction/bulk", {
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
