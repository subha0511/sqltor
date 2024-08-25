import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown";
import { cn } from "../lib/utils";
import { useGetTableInfo, useGetTableNames, useRunQuery } from "../query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { insertEmployees, insertManagers } from "../lib/addTable";

const sidebar = () => {
  const tables = useGetTableNames();
  const { mutate } = useRunQuery();

  return (
    <div className="w-full">
      <div className="px-2 py-2 text-zinc-400 border-b border-zinc-600 flex justify-between items-center">
        <div>Tables</div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="h-8 text-sm px-3 py-1 rounded-md border border-neutral-600 hover:bg-neutral-800 grid place-items-center">
                Add Table
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-58 bg-neutral-900 shadow-lg border border-neutral-700 w-64 rounded-md text-neutral-400"
              align="end"
              sideOffset={5}
            >
              <DropdownMenuLabel>Add Table</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem asChild>
                <Button
                  className="hover:bg-neutral-800 w-full pl-5 py-0 h-9 cursor-pointer text-left justify-start"
                  onClick={() => mutate(insertEmployees)}
                >
                  Employees
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  className="hover:bg-neutral-800 w-full pl-5 py-0 h-9 cursor-pointer text-left justify-start"
                  onClick={() => mutate(insertManagers)}
                >
                  Managers
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
