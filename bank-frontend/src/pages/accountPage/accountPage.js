import { el, setChildren } from "redom";
import { getAccountPage, transaction, userAccounts } from "../../api/api";
import { button } from "../../ui/button";
import router from "../../main";
import { CustomSelect } from "../../components/customSelect/customSelect";
import {
  Chart,
  BarElement,
  BarController,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { chartDate } from "../../util/chartDate";
import { makeTransactionList } from "../../util/makeTransactionList";
import { makeChart } from "../../util/makeChart";
import { allert } from "../../components/allert/allert";
import { setUserData } from "../../util/setUserData";

Chart.register(
  BarElement,
  BarController,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export async function accountPage(token, id) {
  try {
    const account = await getAccountPage(token, id);
    const data = await userAccounts(token);

    const history = el("ul", { class: "history-table__list" });
    const canvas = el("canvas", { id: "myChart", class: "canvas" });
    const chartWrapper = el("div", { class: "chart-wrapper" });
    const ctx = canvas.getContext("2d");
    setChildren(chartWrapper, canvas);
    let chartInfo = chartDate(account, 6);
    const chart = makeChart(chartInfo, ctx);
    const historyBlock = el("div", { class: "account-info__history cursor" }, [
      el("h2", { class: "account-info__title-h2" }, "История переводов"),
      el(
        "div",
        { class: "account-info__history-table history-table" },
        el(
          "div",
          { class: "history-table__title" },
          el(
            "span",
            { class: "history-table__title-item" },
            "Счёт отправителя"
          ),
          el("span", { class: "history-table__title-item" }, "Счёт получателя"),
          el("span", { class: "history-table__title-item" }, "Сумма"),
          el("span", { class: "history-table__title-item" }, "Дата")
        ),
        history
      ),
    ]);

    const dynamicsBalance = el(
      "div",
      { class: "account-info__dynamics cursor" },
      { id: "dynamics" },
      [
        el("h2", { class: "account-info__title-h2" }, "Динамика баланса"),
        chartWrapper,
      ]
    );

    const accounts = localStorage.getItem("account") || null;
    let listArray = [];

    if (accounts && accounts) listArray = JSON.parse(accounts);

    const accountList = listArray
      .filter((item) => item !== account.account)
      .map((item) => item);

    const backAccount = button("Вернуться назад", "secondary", "back");
    const toSend = button("Отправить", "secondary", "email");
    const sendMoneyInput = el(
      "input",
      { class: "account-info__input" },
      { type: "number" }
    );
    let accountSelect = new CustomSelect("Номер счета", accountList, "input");
    const accountSelectWrapper = el("div", {
      class: "account-info__select-wrapper",
    });

    setChildren(accountSelectWrapper, accountSelect.createCustom());

    backAccount.addEventListener("click", async (event) => {
      event.preventDefault();
      router.navigate(`/account/`);
    });
    let transactionTableList = makeTransactionList(account, 1, 10);
    setChildren(history, transactionTableList);

    // Отправка средств на другой счет
    toSend.addEventListener("click", async (event) => {
      event.preventDefault();
      const newListArray = listArray;
      const body = {
        from: account.account.trim(),
        to: accountSelect._selectValue.trim(),
        amount: sendMoneyInput.value.trim(),
      };

      const data = await transaction(token, body);

      if (!data.payload) {
        const main = document.getElementById("account-info");
        const allertInfo = allert(data.error);
        main.appendChild(allertInfo);

        setTimeout(() => {
          main.removeChild(allertInfo);
        }, 3000);

        return;
      }

      if (!newListArray.includes(accountSelect._selectValue)) {
        newListArray.push(accountSelect._selectValue);

        setUserData(newListArray, "account");

        const newAccountList = newListArray
          .filter((item) => item !== account.account)
          .map((item) => item);

        accountSelect = new CustomSelect(
          "Номер счета",
          newAccountList,
          "input"
        );

        sendMoneyInput.value = "";
        setChildren(accountSelectWrapper, accountSelect.createCustom());
      } else {
        setUserData(newListArray, "account");

        const newAccountList = newListArray
          .filter((item) => item !== account.account)
          .map((item) => item);

        accountSelect = new CustomSelect(
          "Номер счета",
          newAccountList,
          "input"
        );

        sendMoneyInput.value = "";
        setChildren(accountSelectWrapper, accountSelect.createCustom());
      }

      const accountUpdate = await getAccountPage(token, id);
      const balance = document.getElementById("balance");
      balance.textContent = `${Math.round(accountUpdate.balance).toLocaleString(
        "ru-RU"
      )} ₽`;
      transactionTableList = makeTransactionList(accountUpdate, 1, 10);
      chartInfo = chartDate(accountUpdate, 6);
      chart.data.labels = chartInfo.month;
      chart.data.datasets[0].data = chartInfo.data;

      chart.update();

      setChildren(history, transactionTableList);
    });
    // Переход на подробную страницу счета
    historyBlock.addEventListener("click", (event) => {
      event.preventDefault();
      router.navigate(`/account/detailed/${id}`);
    });

    dynamicsBalance.addEventListener("click", (event) => {
      event.preventDefault();
      router.navigate(`/account/detailed/${id}`);
    });
    // Основной контейнер
    const accountInfo = el(
      "section",
      { class: "account-info", id: "account-info" },
      [
        el("div", { class: "account-info__container container" }, [
          el("div", { class: "account-info__info" }, [
            el("div", { class: "account-info__info-wrapper" }, [
              el("h2", { class: "account-info__title" }, "Просмотр счёта"),
              el(
                "p",
                { class: "account-info__number" },
                `№ ${account.account}`
              ),
            ]),
            el("div", { class: "account-info__info-wrapper" }, [
              backAccount,
              el(
                "p",
                { class: "account-info__balance" },
                `Баланс`,
                el(
                  "span",
                  { class: "account-info__balance-sum" },
                  { id: "balance" },
                  `${Math.round(account.balance).toLocaleString("ru-RU")} ₽`
                )
              ),
            ]),
          ]),
          el("div", { class: "account-info__grid" }, [
            el("div", { class: "account-info__new-transaction" }, [
              el("h2", { class: "account-info__title-h2" }, "Новый перевод"),
              el("form", { class: "account-info__form" }, [
                el(
                  "label",
                  { class: "account-info__label" },
                  "Номер счёта получателя"
                ),
                accountSelectWrapper,
                el("label", { class: "account-info__label" }, "Сумма перевода"),
                sendMoneyInput,
                el("div", { class: "account-info__btn-wrapper" }, toSend),
              ]),
            ]),
            dynamicsBalance,
            historyBlock,
          ]),
        ]),
      ]
    );

    return accountInfo;
  } catch (error) {
    console.error("Ошибка в currencyPage:", error.message);

    return el(
      "div",
      { class: "error" },
      "Не удалось загрузить данные пользователя."
    );
  }
}
