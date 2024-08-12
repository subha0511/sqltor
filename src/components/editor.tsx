import { sql } from "@codemirror/lang-sql";
import CodeMirror, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";

export interface EditorProps extends ReactCodeMirrorProps {}

const Editor = ({ ...rest }: EditorProps) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const codemirrorRef = useRef<ReactCodeMirrorRef | null>(null);
  useEffect(() => {
    if (parentRef.current && codemirrorRef.current !== null) {
      codemirrorRef.current?.editor?.setAttribute("height", 100 + "px");
    }
  }, []);

  return (
    <div className="h-full bg-red-200 max-h-full" ref={parentRef}>
      <CodeMirror
        theme="dark"
        extensions={[sql()]}
        ref={codemirrorRef}
        {...rest}
      />
    </div>
  );
};

export default Editor;
