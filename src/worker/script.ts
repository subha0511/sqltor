import initSqlJs, { Database } from "sql.js";

// sql.worker.js
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.7.3/sql-wasm.js"
);

let db = null;

self.onmessage = function (event) {
  const { action, data } = event.data;

  switch (action) {
    case "init":
      // Initialize the SQLite database
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      });
      db = new SQL.Database(new Uint8Array(data));
      break;

    case "exec":
      // Execute SQL query
      const result = db?.exec(data);
      self.postMessage({ action: "exec", result });
      break;

    default:
      break;
  }
};
