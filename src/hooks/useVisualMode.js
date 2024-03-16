
import { useState } from "react";

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);

  const [history, setHistory] = useState([initial]);

  //update handler
  //A transition function that allow us to advance to any other mode
  function transition(newMode, replace = false) {
    setHistory((prev) => {
      if (replace) {
        return [...prev.slice(0, prev.length - 1), newMode] //set the new mode and add new mode to the history
      } else {
        return [...prev, newMode] //add a new mode
      }
    });
  };


  //back function allow us to return to the previous mode
  function back() {
    setHistory((prev) =>
      prev.length === 1 ? prev : [...prev.slice(0, prev.length - 1)]); // remove the last mode from the history (back to the previous mode)
  };

  return { mode: history[history.length - 1], transition, back };
  //return current mode, transition(chanhed mode) fucntion and back function
};