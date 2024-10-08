import { CompletionContext } from "@codemirror/autocomplete";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import initSqlJs from "sql.js";
import sqliteUrl from "../assets/sql-wasm.wasm?url";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const workerLog = (...args: any[]) => {
  console.log(args);
};

export const workerError = (...args: any[]) => {
  console.error(args);
};

export const dbConnector = async () => {
  const SQL = await initSqlJs({
    locateFile: () => sqliteUrl,
  });
  const db = new SQL.Database();
  return { db };
};

export const tableOutputToObject = <T>(schema: {
  columns: T[];
  values: T[][];
}) => {
  return schema.values.map(
    (value) =>
      Object.fromEntries(
        schema.columns.map((column, index) => [column, value[index]])
      ) as unknown as { [key in keyof T]: T }
  );
};

export const getSqlCompletions = (tables: any[], columns: any) => {
  return function sqlCompletions(context: CompletionContext) {
    let word = context.matchBefore(/\w*/);
    if (word === null || (word.from === word.to && !context.explicit))
      return null;

    let options = [];

    // Suggest tables
    if (context.matchBefore(/FROM\s+\w*$/i)) {
      options = tables.map((table) => ({ label: table, type: "class" }));
    }
    // Suggest columns
    else if (
      context.matchBefore(/SELECT\s+\w*$/i) ||
      context.matchBefore(/WHERE\s+\w*$/i)
    ) {
      options = Object.values(columns)
        .flat()
        .map((column) => ({ label: column, type: "property" }));
    }
    // Suggest both tables and columns
    else {
      options = [
        ...tables.map((table) => ({ label: table, type: "class" })),
        ...Object.values(columns)
          .flat()
          .map((column) => ({ label: column, type: "property" })),
      ];
    }

    return {
      from: word.from,
      options: options,
      validFor: /^\w*$/,
    };
  };
};
