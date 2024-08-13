import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import initSqlJs, { Database } from "sql.js";
import sqliteUrl from "../assets/sql-wasm.wasm?url";

const DbContext = createContext<null | any>(null);

type DBState = {
  status: "SUCCESS" | "LOADING" | "ERROR";
  error: any | null;
  db: Database | null;
};

export const DbProvider = ({ children }: { children: ReactNode }) => {
  const [dbState, setDbState] = useState<DBState>({
    status: "LOADING",
    error: null,
    db: null,
  });

  useEffect(() => {
    const connectSqlWasm = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: () => sqliteUrl,
        });
        setDbState((prev) => ({
          ...prev,
          status: "SUCCESS",
          db: new SQL.Database(),
        }));
      } catch (err) {
        setDbState((prev) => ({
          ...prev,
          status: "ERROR",
          error: err,
        }));
      }
    };

    connectSqlWasm();
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
