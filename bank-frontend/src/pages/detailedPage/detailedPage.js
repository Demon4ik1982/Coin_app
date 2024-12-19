import { el, setChildren } from "redom";
import { button } from "../../ui/button";
import { getAccountPage } from "../../api/api";
import router from "../../main";
import { makeTransactionList } from "../../util/makeTransactionList";
import { makeChart } from "../../util/makeChart";
import { makeDynamicsChart } from "../../util/makedynamicsChart";
import { chartDate } from "../../util/chartDate";

export async function detailedPage(token, id) {
  try {
    const account = await getAccountPage(token, id);
    const backAccount = button("Вернуться назад", "secondary", "back");
    const history = el("ul", { class: "history-table__list" });
    let pageColums = 25

    const transactionTableList = makeTransactionList(account, 1, pageColums);

    const chartWrapper = el("div", { class: "chart-wrapper" });
    const canvas = el("canvas", { id: "myChart", class: "canvas" });
    const ctx = canvas.getContext("2d");

    const dynamicsChartWrapper = el("div", { class: "chart-wrapper" });
    const dynamicsCanvas = el("canvas", { id: "myDynamicsChart", class: "canvas" });
    const dynamicsCtx = dynamicsCanvas.getContext("2d");

    let chartInfo = chartDate(account, 12);

    makeChart(chartInfo, ctx);
    makeDynamicsChart(chartInfo, dynamicsCtx)

    const dynamicsBalance = el("div", { class: "account-info__dynamics" }, { id: "dynamics" }, [
      el("h2", { class: "account-info__title-h2" }, "Динамика баланса"),
      chartWrapper,
    ])
    const ratioBalance = el("div", { class: "account-info__dynamics" }, { id: "dynamics" }, [
      el("h2", { class: "account-info__title-h2" }, "Соотношение входящих исходящих транзакций"),
      dynamicsChartWrapper,
    ])
    let isLoading = false;

    function checkPosition() {
      if (isLoading) return;

      const height = document.body.offsetHeight;
      const screenHeight = window.innerHeight;
      const scrolled = window.scrollY;
      const threshold = height - screenHeight / 6;
      const position = scrolled + screenHeight;

      if (position >= threshold && pageColums < account.transactions.length) {
        isLoading = true;

        pageColums = Math.min(pageColums + 25, account.transactions.length);
        console.log(`Отображаем строки с 1 по ${pageColums}`);

        const transactionTableList = makeTransactionList(account, 1, pageColums);
        setChildren(history, transactionTableList);

        setTimeout(() => {
          isLoading = false;
        }, 100);
      } else if (pageColums >= account.transactions.length) {
        console.log("Все данные загружены");
        window.removeEventListener("scroll", checkPosition);
      }
    }

    window.addEventListener("scroll", checkPosition);

    window.cleanupScrollListener = () => {
      window.removeEventListener("scroll", checkPosition);
      window.cleanupScrollListener = null;
  };

    setChildren(chartWrapper, canvas);
    setChildren(dynamicsChartWrapper, dynamicsCanvas);
    setChildren(history, transactionTableList);

    backAccount.addEventListener('click', (event) => {
      event.preventDefault();
      router.navigate(`/account/${id}`);
    })

    const detailedInfo = el(
        "section",
        { class: "detailed-info", id: "detailed-info" },
        [
          el("div", { class: "detailed-info__container container" }, [
            el("div", { class: "detailed-info__info" }, [
              el("div", { class: "detailed-info__info-wrapper" }, [
                el("h2", { class: "detailed-info__title" }, "История баланса"),
                el("p", { class: "detailed-info__number" }, `№ ${account.account}`),
              ]),
              el("div", { class: "detailed-info__info-wrapper" }, [
                backAccount,
                el("p", { class: "detailed-info__balance" }, `Баланс`,
                  el("span", { class: "detailed-info__balance-sum" , id: "balance" }, `${Math.round(account.balance).toLocaleString("ru-RU")} ₽`)
                ),
              ]),
            ]),
            el("div", { class: "detailed-info__grid" }, [
              dynamicsBalance,
              ratioBalance,
              el("div", { class: "detailed-info__history" }, [
                el("h2", { class: "detailed-info__title-h2" }, "История переводов"),
                el(
                  "div",
                  { class: "detailed-info__history-table history-table" },
                  el("div", { class: "history-table__title" },
                    el("span", { class: "history-table__title-item" }, "Счёт отправителя"),
                    el("span", { class: "history-table__title-item" }, "Счёт получателя"),
                    el("span", { class: "history-table__title-item" }, "Сумма"),
                    el("span", { class: "history-table__title-item" }, "Дата")
                  ),
                  history
                ),
              ]),
            ]),
          ]),
        ]
      );

      return detailedInfo;
  } catch (error) {
    console.error("Ошибка в currencyPage:", error.message);

    return el(
      "div",
      { class: "error" },
      "Не удалось загрузить данные пользователя."
    );
  }
}
