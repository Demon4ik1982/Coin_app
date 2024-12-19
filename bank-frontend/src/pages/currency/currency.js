import { el, setChildren } from "redom";
import redArrow from "../../asset/images/arrow_red.svg";
import greenArrow from "../../asset/images/arrow_green.svg";
import {
  currencyBuy,
  getCurrencyCode,
  getCurrencyList,
  userAccounts,
} from "../../api/api";
import { CustomSelect } from "../../components/customSelect/customSelect";
import { button } from "../../ui/button";
import { makeCurrencyList } from "../../util/currenncyList";
import { allert } from "../../components/allert/allert";
import { dragAndDpop } from "../../util/dragAndDrop";

export async function currencyPage(token) {
  try {
    const data = await userAccounts(token);
    const currencyList = await getCurrencyList(token);
    const currencyCode = await getCurrencyCode(token);
    const currencyCodeListFrom = new CustomSelect(
      "Валюта",
      currencyCode,
      "select",
      "bottom"
    );
    const currencyCodeListTo = new CustomSelect(
      "Валюта",
      currencyCode,
      "select",
      "bottom"
    );
    const selectWrapperFrom = el("div", { class: "currency__select-wrapper" });
    const selectWrapperTo = el("div", { class: "currency__select-wrapper" });
    const currencyChangeButton = button("Обменять");
    const sendMoneyInput = el(
      "input",
      { class: "currency__input" },
      { type: "number" }
    );
    const currencyUserList = el("ul", {
      class: "currency__currency-user-list",
    });

    setChildren(selectWrapperFrom, currencyCodeListFrom.createCustom());
    setChildren(selectWrapperTo, currencyCodeListTo.createCustom());

    currencyChangeButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const body = {
        from: currencyCodeListFrom.selectValue,
        to: currencyCodeListTo.selectValue,
        amount: sendMoneyInput.value,
      };
      const newList = await currencyBuy(token, body);

      if (!newList.payload) {
        const main = document.getElementById("currency-page");
        const allertInfo = allert(newList.error);
        main.appendChild(allertInfo);

        setTimeout(() => {
          main.removeChild(allertInfo);
        }, 3000);
        return;
      }

      const newUserCurrencyList = makeCurrencyList(newList.payload);
      sendMoneyInput.value = "";
      setChildren(selectWrapperFrom, currencyCodeListFrom.createCustom());
      setChildren(selectWrapperTo, currencyCodeListTo.createCustom());
      setChildren(currencyUserList, newUserCurrencyList);
    });

    const userCurrencyList = makeCurrencyList(currencyList);
    setChildren(currencyUserList, userCurrencyList);

    // Websocket
    const currencyChange = [];
    let count = 19;

    setTimeout(() => {
      const element = document.querySelector(".currency__realtime-list");
      if (element) {
        const height = element.offsetHeight;
        count = Math.round(height / 45);
      } else {
        console.log("Элемент не найден!");
      }
    }, 1000);

    const currencyChangeListWrapper = el("ul", {
      class: "currency__currency-user-list",
    });

    const socket = new WebSocket("ws://localhost:3000/currency-feed");

    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection established");
    });

    socket.addEventListener("message", (event) => {
      const receivedData = JSON.parse(event.data);
      currencyChange.push(receivedData);

      if (currencyChange.length >= count) currencyChange.splice(0, 1);

      const currencyChangeList = currencyChange.map((data) => {
        const arrowRed = el(
          "img",
          { class: "currency__arrow" },
          { src: redArrow }
        );
        const arrowGreen = el(
          "img",
          { class: "currency__arrow" },
          { src: greenArrow }
        );
        return el(
          "li",
          { class: "currency__currency-user-item" },
          el("span", { class: "currency__code" }, `${data.from}/${data.to}`),
          el(
            "span",
            {
              class:
                data.change === 1
                  ? "currency__dots-green"
                  : "currency__dots-red",
            },
            ""
          ),
          el(
            "span",
            { class: "currency__rate" },
            data.rate,
            data.change === 1 ? arrowGreen : arrowRed
          )
        );
      });
      setChildren(currencyChangeListWrapper, currencyChangeList);
    });

    socket.addEventListener("close", (event) => {
      console.error("WebSocket connection closed");
    });


    // Создание контейнера для drag and drop
    const draggableContainer = el("div", { class: "currency__grid draggable-container", id: "draggable-container" }, [
      el("div",
        { class: "currency__currency-list draggable-item", id: "currency-list", draggable: "true" },
        [
          el("h2", { class: "currency__title-h2" }, "Ваши валюты"),
          currencyUserList,
        ]
      ),
      el("div", { class: "currency__realtime-list draggable-item", draggable: "true" }, [
        el(
          "h2",
          { class: "currency__title-h2" },
          "Изменение курсов в реальном времени"
        ),
        currencyChangeListWrapper,
      ]),
      el("div", { class: "currency__currency-list draggable-item", draggable: "true" }, [
        el("h2", { class: "currency__title-h2" }, "Обмен валюты"),

        el("div", { class: "currency__grid-change" }, [
          el(
            "span",
            { class: "currency__text" },
            "Из",
            selectWrapperFrom
          ),
          el("span", { class: "currency__text" }, "в", selectWrapperTo),
          el(
            "div",
            { class: "currency__button-wrapper" },
            currencyChangeButton
          ),
          el(
            "label",
            { class: "currency__label" },
            "Сумма",
            sendMoneyInput
          ),
        ]),
      ]),
    ])

    dragAndDpop(draggableContainer)

    // Основной контейнер
    const currencyInfo = el(
      "section",
      { class: "currency", id: "currency-page" },
      [
        el("div", { class: "currency__container container" }, [
          el("h2", { class: "currency__title" }, "Валютный обмен"),
          draggableContainer,
        ]),
      ]
    );

    return currencyInfo;
  } catch (error) {
    console.error("Ошибка в currencyPage:", error.message);
    console.log(error.message);

    return el(
      "div",
      { class: "error" },
      "Не удалось загрузить данные пользователя."
    );
  }
}
