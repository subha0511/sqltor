import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createDbSlice, DBSlice } from "./dbSlice";
import { createEditorSlice, EditorSlice } from "./editorSlice";

export type ImmerStateCreator<T> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  T
>;

export const useBoundStore = create<DBSlice & EditorSlice>()(
  devtools(
    immer((...a) => ({
      ...createDbSlice(...a),
      ...createEditorSlice(...a),
    })),
    { name: "boundStore" }
  )
);
