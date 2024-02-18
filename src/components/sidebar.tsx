import { cn } from "../lib/utils";
import { useGetTableInfo, useGetTableNames } from "../query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { KeyRound } from "lucide-react";

const sidebar = () => {
  const tables = useGetTableNames();

  return (
    <div className="w-full">
      <div className="px-2 py-2 text-zinc-400 border-b border-zinc-600">
        Tables
      </div>
      {tables?.length === 0 ? (
        <div className="px-2 py-1.5 text-zinc-400">No tables found</div>
      ) : (
        <Accordion type="multiple">
          {tables?.map((table, index) => (
            <AccordionItem
              key={index}
              value={`${table}`}
              className="text-zinc-300 px-1 border-zinc-500"
            >
              <AccordionTrigger className="px-1 py-2 data-[state=open]:border-b border-zinc-600 font-medium">
                <div>
                  {table} <Chip value="TB" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-1 py-2">
                <TableInfo tableName={`${table}`} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

const TableInfo = ({ tableName }: { tableName: string }) => {
  const { tableInfo, isError } = useGetTableInfo(tableName);

  if (isError) {
    return <div className="text-red-700">Something went wrong</div>;
  }

  return (
    <div className="flex flex-col">
      {tableInfo?.map((info) => (
        <div
          key={info.name + ""}
          className="px-1 py-1 flex items-center gap-x-2 w-full"
        >
          <span className="grow flex items-center">
            {info.name}
            {info.pk && <KeyRound size={12} className="ml-2 text-red-400" />}
          </span>
          <span className="self-end text-[10px] font-medium uppercase">
            {info.type}
          </span>
        </div>
      ))}
    </div>
  );
};

const Chip = ({ value, className }: { value: string; className?: string }) => {
  return (
    <span
      className={cn(
        "ml-1 text-[10px] px-1 py-0.5 rounded-md border border-zinc-600 h-full bg-zinc-700",
        className
      )}
    >
      {value}
    </span>
  );
};

export default sidebar;
