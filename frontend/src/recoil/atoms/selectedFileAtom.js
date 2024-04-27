import { atom } from "recoil";

export const selectedFileAtom = atom({
  key: "selectedFileAtom",
  default: 'initial.js',
});