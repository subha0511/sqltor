import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as comlink from "comlink";
import SQLWorker from "../worker/worker?worker&url";
// import { SQLWorkerExport } from "../worker/worker";
// import { Database } from "@sqlite.org/sqlite-wasm";

const DbContext = createContext<null | any>(null);

type DBState = {
  status: "SUCCESS" | "LOADING" | "ERROR";
  error: any | null;
  db: null;
};

const workerLog = (...args: any[]) => {
  console.log(args);
};
const workerError = (...args: any[]) => {
  console.error(args);
};

export const DbProvider = ({ children }: { children: ReactNode }) => {
  const [dbState, setDbState] = useState<DBState>({
    status: "LOADING",
    error: null,
    db: null,
  });

  useEffect(() => {
    // const connector = async () => {
    //   const sqlWorker = new Worker(SQLWorker, { type: "module" });
    //   sqlWorker.onmessage = (e) => {
    //     switch (e.data.type) {
    //       case "log":
    //         workerLog(e.data.payload);
    //         break;
    //       case "error":
    //         workerError(e.data.payload);
    //         break;
    //       default:
    //         console.log(e.data);
    //     }
    //   };
    //   const obj = comlink.wrap<SQLWorkerExport>(sqlWorker);
    //   const db = await await obj.init();
    //   setDbState((prev) => ({
    //     ...prev,
    //     status: "SUCCESS",
    //     db,
    //   }));
    // };
    // connector();
  }, []);

  return (
    <DbContext.Provider value={{ dbState }}>{children}</DbContext.Provider>
  );
};

type SQLState = {
  command: string | null;
  status: "IDLE" | "RUNNING" | "SUCCESS" | "ERROR";
  results: [] | null;
  error: any | null;
};

export const useDb = () => {
  const { dbState } = useContext(DbContext);

  const [sqlState, setSqlState] = useState<SQLState>({
    command: null,
    status: "IDLE",
    results: null,
    error: null,
  });

  const runSql = useCallback(
    (statement: string) => {
      const { db } = dbState;
      if (db) {
        try {
          setSqlState({
            command: statement,
            status: "SUCCESS",
            results: db.exec(statement),
            error: null,
          });
        } catch (err) {
          setSqlState({
            command: statement,
            status: "ERROR",
            results: null,
            error: err,
          });
        }
      } else {
        setSqlState({
          command: statement,
          status: "ERROR",
          results: null,
          error: "Db not instantiated",
        });
      }
    },
    [dbState]
  );

  return { dbState, runSql, sqlState } as {
    dbState: DBState;
    sqlState: SQLState;
    runSql: (arg0: string) => void;
  };
};
