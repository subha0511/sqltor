import { Database } from "sql.js";
import { dbConnector } from "../lib/utils";
import { ImmerStateCreator } from "./store";

export interface DBSlice {
  activeDatabase: {
    dbName?: string;
    db: Database | null;
    status: "empty" | "loading" | "loaded" | "error";
    message?: string;
  };
  databases: { [key: string]: Database };
  setDatabase(name: string, db: Database): void;
  getDatabase(name?: string): Database | null;
  setActiveDatabase(dbName: string): void;
  initializeDatabase(name?: string): void;
}

export const createDbSlice: ImmerStateCreator<DBSlice> = (set, get) => ({
  databases: {},
  activeDatabase: {
    db: null,
    status: "loading",
    dbName: undefined,
    message: "",
  },
  getDatabase: (name = "main") => get().databases[name] ?? null,
  setDatabase: (name, db) => set((state) => (state.databases[name] = db)),
  setActiveDatabase: (dbName) => {
    if (get().databases[dbName]) {
      set((state) => {
        state.activeDatabase = {
          status: "loaded",
          dbName,
          db: get().databases[dbName]!,
          message: "",
        };
      });
    }
  },
  initializeDatabase: async (dbName = "main") => {
    if (
      get().databases[dbName] === null ||
      get().databases[dbName] === undefined
    ) {
      set((state) => {
        state.activeDatabase.status = "loading";
      });
      const { db } = await dbConnector();
      if (db !== null) {
        set((state) => {
          state.databases[dbName] = db;
        });
        get().setActiveDatabase(dbName);
      }
    }
  },
});
