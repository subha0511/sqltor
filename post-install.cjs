const gentlyCopy = require("gently-copy");

const filesToCopy = [
  "./node_modules/sql.js/dist/sql-wasm.wasm",
  "./node_modules/sql.js/dist/worker.sql-wasm.js",
];

// User's local directory
const userPath = process.env.INIT_CWD + "/src/assets/";

// Moving files to user's local directory
gentlyCopy(filesToCopy, userPath);
