import type{ NavigateFunction } from "react-router-dom";

export let navigate: NavigateFunction = () => {}; // Initially navitate will hold an empty function

export const setNavigate = (fn: NavigateFunction) => {
  navigate = fn;
};