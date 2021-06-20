// let db;

// // open "budgetTracker" in indexedDB
// const request = indexedDB.open("budget", 1);

// // create ObjectStore
// request.onupgradeneeded = (event) => {
//   // store reference to indexedDB "budgetTrackerDB"
//   const db = event.target.result;
//   const BudgetStore = db.createObjectStore("pending", {
//     autoincrement: true,
//   });
//   //   createIndex
//   BudgetStore.createIndex("pending", "budget");
//   //   BudgetStore.createIndex("budgetIndex", "expenses");
// };

// request.onsuccess = function (event) {
//   db = event.target.result;
//   //check if app is back online
//   if (navigator.onLine) {
//     console.log("Backend Online");
//     checkDatabase();
//   }
// };

// request.onerror = function (event) {
//   // log error here
//   console.log("error");
// };

// function saveRecord(record) {
//   // create a transaction on the pending db with readwrite access
//   const transaction = db.transaction(["pending"], "readwrite");
//   // access your pending object store
//   const budgetStore = transaction.objectStore("pending");

//   // add record to your store with add method.
//   budgetStore.add(record);
// }

// function checkDatabase() {
//   // open a transaction on pending db
//   const transaction = db.transaction(["pending"], "readwrite");
//   // access your pending object store
//   const budgetStore = transaction.objectStore("pending");

//   // get all records from store and set to a variable
//   const allRecords = budgetStore.getAll();

//   allRecords.onsuccess = function () {
//     if (allRecords.result.length > 0) {
//       fetch("./api/transaction/bulk", {
//         method: "POST",
//         body: JSON.stringify(allRecords.result),
//         headers: {
//           Accept: "application/json, text/plain, */*",
//           "Content-Type": "application/json",
//         },
//       })
//         .then((response) => response.json())
//         .then(() => {
//           // if successful, open a transaction on your pending db
//           const transaction = db.transaction(["pending"], "readwrite");
//           // access your pending object store
//           const budgetStore = transaction.objectStore("pending");

//           // clear all items in your store
//           budgetStore.clear();
//         });
//     }
//   };
// }

// window.addEventListener("online", checkDatabase);

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
let db;
const request = indexedDB.open("budget", 1);
request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};
request.onsuccess = ({ target }) => {
  db = target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};
request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};
function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
}
function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          // delete records if successful
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}
// listen for app coming back online
window.addEventListener("online", checkDatabase);
