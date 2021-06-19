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
  const transaction = db.transaction(["budgetTrackerDB"], "readwrite");
  const budgetStore = transaction.objectStore("budgetTrackerDB");
  budgetStore.add(event);
};

// function checkDatabase() {}

// window.addEventListener("online", checkDatabase);
