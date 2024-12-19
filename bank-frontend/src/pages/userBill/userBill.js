import { el, setChildren } from "redom";
import { createAccount, userAccounts } from "../../api/api";
import { CustomSelect, customSelect } from "../../components/customSelect/customSelect";
import { button } from "../../ui/button";
import { accountList } from "../../util/accountList";
import { setUserData } from "../../util/setUserData";

export async function userBill(token) {
  try {
    const data = await userAccounts(token);
    if (!data || data.length === 0) {
      throw new Error("Нет данных о пользователе.");
    }

    const cards = el("div", { class: "accounts" });
    const cardsList = el("ul", { class: "accounts__list" });
    const accounts = localStorage.getItem("account") || null;


    if (accounts === null) {
      const array = []
      data.map((item) => {
        array.push(item.account)
      })

      setUserData(array, "account")

    }


    setChildren(cardsList, accountList(data, token));

    setChildren(cards, cardsList);

    const addAccount = button("Создать новый счет", "secondary", "add");

    addAccount.addEventListener("click", async (event) => {
      event.preventDefault();
      await createAccount(token);
      const data = await userAccounts(token);
      setChildren(cardsList, accountList(data, token));
    });

    const customSelectList = [
      'По номеру',
      'По балансу',
      'По последней транзакции'
    ]

    const sorting = new CustomSelect("Сортировка", customSelectList, 'select')

    sorting.onClick().forEach((element) => {
      element.addEventListener('click', () => {

        if (element.textContent.toLowerCase() === 'по номеру') {
          data.sort((a, b) => a.account < b.account ? 1 : -1)
          setChildren(cardsList, accountList(data, token));
        }
        if (element.textContent.toLowerCase() === 'по балансу') {
          data.sort((a, b) => a.balance < b.balance ? 1 : -1)
          setChildren(cardsList, accountList(data, token));
        }
        if (element.textContent.toLowerCase() === 'по последней транзакции') {
          data.sort((a, b) => a.transactions[0].date < b.transactions[0].date ? 1 : -1)
          setChildren(cardsList, accountList(data, token));
        }

      })
    });

    const accoundsPage = el("section", { class: "bill" }, [
      el("div", { class: "bill__container container" }, [
        el("div", { class: "bill__info" }, [
          el("div", { class: "bill__info-wrapper" }, [
            el("h2", { class: "bill__title" }, "Ваши счета"),
            el('div', {class: "bill__select-wrapper"}, sorting.createCustom())
          ]),
          el('div', { class: 'bill__button-wrapper' }, addAccount),

        ]),
        cards,
      ]),
    ]);

    return accoundsPage;
  } catch (error) {
    console.error("Ошибка в userBill:", error.message);
    return el(
      "div",
      { class: "error" },
      "Не удалось загрузить данные пользователя."
    );
  }
}
