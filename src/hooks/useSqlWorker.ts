import { useCallback, useEffect, useState } from "react";

export const useSqlWorker = <TResult, TWorkerPayload>(worker: Worker) => {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<any>();
  const [result, setResult] = useState<TResult>();

  const startProcessing = useCallback(
    (data: TWorkerPayload) => {
      setRunning(true);
      worker.postMessage(data);
    },
    [worker]
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      console.log("Database opened", event.data);
      setRunning(false);
      setError(event.data);
      setResult(event.data);
    };
    worker.addEventListener("message", onMessage);
    worker.postMessage({
      id: 1,
      action: "open",
    });
    return () => worker.removeEventListener("message", onMessage);
  }, [worker]);

  return {
    startProcessing,
    running,
    error,
    result,
  };
};
