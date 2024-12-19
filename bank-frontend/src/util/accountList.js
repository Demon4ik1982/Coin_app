import { el, setChildren } from "redom";
import { formattedDate } from "./formattedDate";
import { button } from "../ui/button";
import router from "../main";

export function accountList(data, token) {

  return data.map((user) => {
    if (!user || !user.transactions) {
      throw new Error(
        "Некорректный ответ: пользователь или транзакции отсутствуют."
      );
    }

    const openAccount = button("Открыть", "secondary");

    openAccount.addEventListener('click', async (event) => {
      event.preventDefault();
      router.navigate(`/account/${user.account}`);
    })

    return el(
      "li",
      { class: "accounts__item" },
      el("article", { class: "account-card" }, [
        el("p", { class: "account-card__number" }, user.account),
        el(
          "span",
          { class: "account-card__cash" },
          `${Math.round(user.balance).toLocaleString("ru-RU")} ₽`
        ),
        el("div", { class: "account-card__wrapper" }, [
          el(
            "p",
            { class: "account-card__last-transaction" },
            "Последняя транзакция:",
            el(
              "p",
              { class: "account-card__date" },
              user.transactions[0]
                ? formattedDate(user.transactions[0].date)
                : "Нет транзакции"
            )
          ),
          openAccount,
        ]),
      ])
    );
  })
}
