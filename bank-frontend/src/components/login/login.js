import { el } from "redom";

export function renderLogin() {
  const loginForm = el("section", { class: "account", id: 'login-account' }, [
    el(
      "div",
      { class: "account__container container" },
      el("div", { class: "account__login" }, [
        el("h2", { class: "account__title" }, "Вход в аккаунт"),
        el("form", { class: "account__form" }, { id: "login-form" }, [
          el("label", { class: "account__form-label" }, "Логин"),
          el(
            "input",
            { class: "account__form-input" },
            { type: "text" },
            { placeholder: "Логин" },
            { id: "login" }
          ),
          el("label", { class: "account__form-label" }, "Пароль"),
          el(
            "input",
            { class: "account__form-input" },
            { type: "password" },
            { placeholder: "Пароль" },
            { id: "password" }
          ),
          el(
            "button",
            { class: "account__form-button btn-reset" },
            { id: "login-btn" },
            "Войти"
          ),
        ]),
      ])
    ),
  ]);

  return loginForm;
}
