import { useState, useCallback, useMemo } from "react";
import Editor from "./components/editor";
import { useDb } from "./context/dbContext";
import Sidebar from "./components/sidebar";
import ResultPreview from "./components/result-preview";
import { useSqlWorker } from "./hooks/useSqlWorker";

import sqlWorker from "./assets/worker.sql-wasm.js?url";

function App() {
  const sqlWorkerInstance = useMemo(() => new Worker(sqlWorker), []);

  const [editorState, setEditorState] = useState("");
  const {
    dbState: { status },
  } = useDb();

  const data = useSqlWorker(sqlWorkerInstance);

  const isLoading = status === "LOADING";
  const isError = status === "ERROR";

  const onEditorStateChange = useCallback((val: string) => {
    setEditorState(val);
  }, []);

  return (
    <div className="bg-zinc-900 min-h-screen w-full flex items-stretch divide-x divide-zinc-700">
      <div className="min-h-full w-2/3 shrink-0 flex flex-col">
        <div className="h-full grow">
          <Editor value={editorState} onChange={onEditorStateChange} />
        </div>
        <div className="h-1/2 shrink-0">
          <ResultPreview
            isLoading={isLoading}
            isError={isError}
            editorState={editorState}
          />
        </div>
      </div>
      <div className="w-full">
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
