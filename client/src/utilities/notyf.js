import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // make sure styles are imported

export const notyf = new Notyf({
  duration: 3000,
  position: {
    x: "right",
    y: "bottom",
  },
  types: [
    {
      type: "success",
      background: "limegreen",
      icon: {
        className: "notyf__icon--success",
        tagName: "i"
      },
    },
    {
      type: "error",
      background: "red",
      icon: {
        className: "notyf__icon--error",
        tagName: "i"
      },
    },
  ],
});
