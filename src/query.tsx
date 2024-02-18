import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDb } from "./context/dbContext";
import { Database } from "sql.js";

export const runSql = (query: string, db: Database) => {
  try {
    return {
      results: db.exec(query),
      status: "SUCCESS",
      error: null,
    };
  } catch (err) {
    return {
      results: null,
      status: "ERROR",
      error: err,
    };
  }
};

type RunSqlReturn = ReturnType<typeof runSql>;

export const GET_ALL_TABLES = "GET_ALL_TABLES";
export const useGetAllTables = () => {
  const {
    dbState: { db },
  } = useDb();
  return useQuery({
    queryKey: [GET_ALL_TABLES],
    queryFn: () => {
      return runSql(`SELECT name FROM sqlite_master WHERE type='table'`, db!);
    },
    enabled: Boolean(db),
  });
};

export const useRunQuery = () => {
  const {
    dbState: { db },
  } = useDb();
  const queryClient = useQueryClient();

  return useMutation<RunSqlReturn, Error, any, any>({
    mutationFn: (query: string) => Promise.resolve(runSql(query, db!)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [GET_ALL_TABLES] }),
  });
};

export const useGetTableNames = () => {
  const { data } = useGetAllTables();

  const tables = useMemo(() => {
    const results = data?.results;
    if (!results || results.length === 0) {
      return [];
    }
    const tableNames = results.at(0)?.values.map((row) => row.at(0));
    return tableNames;
  }, [data]);

  return tables;
};

export const GET_TABLE_INFO = "GET_TABLE_INFO";
export const useGetTableInfo = (tableName: string) => {
  const {
    dbState: { db },
  } = useDb();

  const { data, isError, isLoading } = useQuery({
    queryKey: [GET_TABLE_INFO, tableName],
    queryFn: () => {
      return runSql(`PRAGMA table_info(${tableName})`, db!);
    },
    enabled: Boolean(db),
  });

  const tableInfo = useMemo(() => {
    if (data?.results) {
      return data?.results.at(0)?.values.map((row) => ({
        name: row.at(1),
        type: row.at(2),
        pk: row.at(-1) === 1,
      }));
    }
    return [];
  }, [data]);

  return { tableInfo, isError, isLoading };
};
