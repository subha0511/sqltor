import { sql } from "@codemirror/lang-sql";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { useGetAutocompletionHints } from "../query";

export interface EditorProps extends ReactCodeMirrorProps {}

const Editor = ({ ...rest }: EditorProps) => {
  const sqlCompletions = useGetAutocompletionHints();
  return (
    <CodeMirror
      theme="dark"
      extensions={[
        sql(),
        sql().language.data.of({
          autocomplete: sqlCompletions,
        }),
      ]}
      {...rest}
    />
  );
};

export default Editor;
