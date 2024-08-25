import { ImmerStateCreator } from "./store";

export interface EditorSlice {
  editorState: string;
  onEditorStateChange: (value: string) => void;
}

export const createEditorSlice: ImmerStateCreator<EditorSlice> = (set) => ({
  editorState: "",
  onEditorStateChange(value) {
    set((state) => {
      state.editorState = value;
    });
  },
});
