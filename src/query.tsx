import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { getSqlCompletions, tableOutputToObject } from "./lib/utils";
import { useBoundStore } from "./store/store";
import { Database } from "sql.js";

export const runSql = (query: string, db: Database) => {
  try {
    return {
      results: db.exec(query),
      status: "SUCCESS",
      error: null,
    };
  } catch (err: any) {
    return {
      results: null,
      status: "ERROR",
      error: err,
    };
  }
};

type RunSqlReturn = ReturnType<typeof runSql>;

// export const GET_ALL_TABLE_INFO = "GET_ALL_TABLE_INFO";
// export const useGetAllTableInfo = () => {
//   const {
//     dbState: { db },
//   } = useDb();
//   return useQuery({
//     queryKey: [GET_ALL_TABLES],
//     queryFn: () => {
//       return runSql(`SELECT name FROM sqlite_master WHERE type='table'`, db!);
//     },
//     enabled: Boolean(db),
//   });
// };

export const GET_ALL_TABLES = "GET_ALL_TABLES";
export const useGetAllTables = () => {
  const db = useBoundStore((state) => state.activeDatabase.db);
  return useQuery({
    queryKey: [GET_ALL_TABLES],
    queryFn: () => {
      return runSql(`SELECT name FROM sqlite_master WHERE type='table'`, db!);
    },
    enabled: Boolean(db),
  });
};

export const useRunQuery = () => {
  // const {
  //   dbState: { db },
  // } = useDb();
  const db = useBoundStore((state) => state.activeDatabase.db);
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
    // console.log("results", results);
    const tableNames = results.at(0)?.values?.map((row) => row.at(0));
    return tableNames;
    return [];
  }, [data]);

  return tables;
};

export const GET_TABLE_INFO = "GET_TABLE_INFO";
export const useGetTableInfo = (tableName: string) => {
  // const {
  //   dbState: { db },
  // } = useDb();

  const db = useBoundStore((state) => state.activeDatabase.db);
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

const GET_ALL_TABLE_INFOS = "GET_ALL_TABLE_INFOS";
export const useGetAllTableInfos = () => {
  const { data: allTablesData } = useGetAllTables();
  // const {
  //   dbState: { db },
  // } = useDb();

  const db = useBoundStore((state) => state.activeDatabase.db);
  const tableNames =
    allTablesData?.results?.[0]?.values.reduce(
      (acc, curr) => [...acc, ...curr],
      []
    ) ?? [];

  return useQuery({
    queryKey: [GET_ALL_TABLE_INFOS, tableNames],
    queryFn: () => {
      return Promise.all(
        tableNames.map((tableName) =>
          runSql(`PRAGMA table_info(${tableName})`, db!)
        )
      );
    },
    select: (data) => {
      const columns = data?.map((item) =>
        tableOutputToObject(item?.results?.[0] ?? { columns: [], values: [[]] })
      );
      return (
        tableNames.map((tableName, index) => ({
          table: tableName,
          columns: columns[index],
        })) ?? []
      );
    },
  });
};

export const useGetAutocompletionHints = () => {
  const { data } = useGetAllTableInfos();

  const table = data?.map((item) => item.table) ?? [];
  const columns =
    data?.reduce(
      (acc, item) => ({
        ...acc,
        // @ts-expect-error: noImplicitAny
        [item.table as string]: item.columns.map((col) => col?.name),
      }),
      {}
    ) ?? {};

  return getSqlCompletions(table, columns);
};
