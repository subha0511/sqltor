import { sql } from "@codemirror/lang-sql";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { useGetAutocompletionHints } from "../query";
import { useBoundStore } from "../store/store";

export interface EditorProps extends ReactCodeMirrorProps {}

const Editor = ({ ...rest }: EditorProps) => {
  const editorState = useBoundStore((state) => state.editorState);
  const onEditorStateChange = useBoundStore(
    (state) => state.onEditorStateChange
  );
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
      value={editorState}
      onChange={onEditorStateChange}
      {...rest}
    />
  );
};

export default Editor;
