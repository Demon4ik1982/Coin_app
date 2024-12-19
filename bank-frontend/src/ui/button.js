import add from "../asset/images/add.svg";
import back from "../asset/images/arrow_back.svg"
import email from "../asset/images/email.svg"
import { el } from "redom";

export function button(label, type, icon, id) {
  if (icon !== '') {
    if (icon === 'add') {
      return el("a", { class: "secondary btn-wrapper" }, { id: `${id}` }, [el("img", { class: "", src: add }),`${label}`])
    }
    if (icon === 'back') {
      return el("a", { class: "secondary btn-wrapper" }, { id: `${id}` }, [el("img", { class: "", src: back }),`${label}`])
    }
    if (icon === 'email') {
      return el("a", { class: "secondary btn-wrapper" }, { id: `${id}` }, [el("img", { class: "", src: email }),`${label}`])
    }
  }

  if (type === 'primary') {
    return el("a", { class: "primary" }, { id: `${id}` }, `${label}`)
  }
  return el("a", { class: "secondary" }, { id: `${id}` }, `${label}`)
}
