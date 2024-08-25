import { useEffect } from "react";
import Editor from "./components/editor";
import Sidebar from "./components/sidebar";
import ResultPreview from "./components/result-preview";
import { useBoundStore } from "./store/store";

function App() {
  const activeDatabase = useBoundStore((state) => state.activeDatabase);
  const initializeDatabase = useBoundStore((state) => state.initializeDatabase);

  const isLoading = activeDatabase.status === "loading";
  const isError = activeDatabase.status === "error";

  useEffect(() => {
    if (activeDatabase.status === "loading") {
      initializeDatabase();
    }
  }, []);

  return (
    <div className="bg-zinc-900 h-screen w-full flex items-stretch divide-x divide-zinc-700">
      <div className="h-full w-2/3 shrink-0 flex flex-col">
        <div className="overflow-auto grow h-1/2">
          <Editor />
        </div>
        <div className="h-1/2 shrink-0">
          <ResultPreview isLoading={isLoading} isError={isError} />
        </div>
      </div>
      <div className="w-full">
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
