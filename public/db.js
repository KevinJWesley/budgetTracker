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
  BudgetStore.createIndex("budgetIndex", "expenses");
};

function checkDatabase() {}

window.addEventListener("online", checkDatabase);
