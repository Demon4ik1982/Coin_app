import { el } from "redom";

class Loader {
  constructor() {
    this.el = el('div', { class: "loader-wrapper container" },el("div", { class: "loader" }, el('div', { class: "spinner" })));
    this.hide();
  }

  show() {
    this.el.style.display = "flex";
  }

  hide() {
    this.el.style.display = "none";
  }
}

export default Loader;
