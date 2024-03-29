import { ThreeCadEditor } from "sdk";
import { create } from "zustand";

type StoreState = {
  threeCadEditor?: ThreeCadEditor;
  setThreeCadEditor: (threeCadEditor: ThreeCadEditor|undefined) => void;
}

export const useGlobalStore = create<StoreState>((set) => ({
  threeCadEditor: undefined,
  setThreeCadEditor: (threeCadEditor) => {
    set({
      threeCadEditor,
    });
  },
}));
