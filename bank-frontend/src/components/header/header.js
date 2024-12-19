import { el } from "redom";
import logo from "../../asset/images/logo.svg";
import { button } from "../../ui/button";

export default el("header", { class: "header" }, [
  el(
    "div",
    { class: "header__container container" },
    el("img", { class: "header__container-logo"}, {src: logo }),
    el("nav", { class: "header__nav nav" }, { id: "coin-nav" }, [
      el("ul", { class: "nav__list" }, [
        el(
          "li",
          { class: "nav__item" },
          button("Банкоматы", "primary", '', "cash-machine"),
        ),
        el(
          "li",
          { class: "nav__item" },
          button("Счета", "primary", '', "bill"),
        ),
        el(
          "li",
          { class: "nav__item" },
          button("Валюта", "primary", '', "currency"),
        ),
        el(
          "li",
          { class: "nav__item" },
          button("Выйти", "primary", '', "exit"),
        ),
      ]),
    ])
  ),
]);
