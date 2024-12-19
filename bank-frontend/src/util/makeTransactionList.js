import { el, setChildren } from "redom";
import { getPage } from "./getPage";

export function makeTransactionList(account, pageNumber, pageSize) {

  const transactionTableDate = getPage(account.transactions, pageNumber, pageSize);

  const transactionTableList = transactionTableDate
    .map((item) => {

      let sumClassType = "green";
      let simbol = "+";

      if (item.from === account.account) {
        sumClassType = "red";
        simbol = "-";
      }

      const transactionData = new Date(item.date);

      return el("li", { class: "history-table__list-item" }, [
        el("span", { class: "history-table__list-info" }, item.from),
        el("span", { class: "history-table__list-info" }, item.to),
        el(
          "span",
          { class: `history-table__list-info ${sumClassType}` },
          `${simbol} ${Math.round(item.amount).toLocaleString("ru-RU")} ₽`
        ),
        el(
          "span",
          { class: "history-table__list-info" },
          `${transactionData.getDate()}.${
            transactionData.getMonth() + 1
          }.${transactionData.getFullYear()}`
        ),
      ]);
    })
    .reverse();

  return transactionTableList;
}
