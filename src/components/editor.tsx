import { sql } from "@codemirror/lang-sql";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";

export interface EditorProps extends ReactCodeMirrorProps {}

const Editor = ({ ...rest }: EditorProps) => {
  return <CodeMirror theme="dark" extensions={[sql()]} {...rest} />;
};

export default Editor;
