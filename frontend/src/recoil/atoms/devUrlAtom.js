import { atom } from "recoil";

const currentURL = window.location.href;
export const devUrlAtom = atom({
    key: "devUrlAtom",
    default: `${currentURL}/error`,
});