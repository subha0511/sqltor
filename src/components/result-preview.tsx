import { useRunQuery } from "../query";
import { insertEmployees } from "../addTable";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type ResultPreviewProps = {
  isLoading: Boolean;
  isError: Boolean;
  editorState: string;
};

const ResultPreview = ({
  isLoading,
  isError,
  editorState,
}: ResultPreviewProps) => {
  const { data, mutate } = useRunQuery();

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="p-2 border-y border-zinc-700 w-full flex flex-wrap gap-x-2 shrink-0">
        <button
          className="px-4 py-2 rounded-lg bg-zinc-700 text-sm text-zinc-300"
          onClick={() => {
            !isLoading ? mutate(editorState) : null;
          }}
        >
          {isLoading && !isError ? "Loading" : isError ? "Error" : "Run"}
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-zinc-700 text-sm text-zinc-300"
          onClick={() => {
            !isLoading && !isError ? mutate(insertEmployees) : null;
          }}
        >
          {isLoading ? "Loading" : isError ? "Error" : "Insert Employees"}
        </button>
      </div>
      <div className="grow text-zinc-200 w-full max-h-full overflow-y-scroll">
        {data && !data?.results && !data?.error ? (
          <span className="p-3">"Run a query !"</span>
        ) : null}

        {data?.results && data?.results?.length > 0 ? (
          <PreviewTable data={data.results[0]} />
        ) : null}

        {data?.error ? (
          <span className="text-red-700"> {JSON.stringify(data?.error)}</span>
        ) : null}
      </div>
    </div>
  );
};

type PreviewTableProps = {
  data: {
    columns: string[];
    values: any[][];
  };
};

const PreviewTable = ({ data }: PreviewTableProps) => {
  return (
    <Table className="w-full overflow-auto">
      <TableHeader className="border-b border-zinc-600">
        <TableRow className="py-1">
          {data?.columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.values.map((rowData, rowId) => (
          <TableRow key={rowId}>
            {rowData.map((cell, cellId) => (
              <TableCell key={rowId + "_" + cellId}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ResultPreview;
