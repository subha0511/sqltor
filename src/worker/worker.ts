// // In `worker.js`.
// import sqlite3InitModule, {
//   Database,
//   Sqlite3Static,
// } from "@sqlite.org/sqlite-wasm";
// import * as comlink from "comlink";

// const log = (...args: any[]) => postMessage({ type: "log", payload: args });
// const error = (...args: any[]) => postMessage({ type: "error", payload: args });

// const start = async function (sqlite3: Sqlite3Static, dbName: string) {
//   log("Running SQLite3 version", sqlite3.version.libVersion);
//   let db: Database;
//   if ("opfs" in sqlite3) {
//     db = new sqlite3.oo1.OpfsDb(`/${dbName}.sqlite3`);
//     log("OPFS is available, created persisted database at", db.filename);
//   } else {
//     db = new sqlite3.oo1.DB(`/${dbName}.sqlite3`, "ct");
//     log("OPFS is not available, created transient database", db.filename);
//   }
//   log("Database created", db);
//   return db;
// };

// const exports = {
//   init: async (dbName = "main"): Promise<Database | null> => {
//     let db = null as Database | null;
//     try {
//       const sqlite3 = await sqlite3InitModule({
//         print: log,
//         printErr: error,
//       });
//       db = await start(sqlite3, dbName);
//     } catch (err: any) {
//       error(err.name, err.message);
//     } finally {
//       return db;
//     }
//   },
// };

// export type SQLWorkerExport = typeof exports;

// comlink.expose(exports);
