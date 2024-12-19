import { el } from "redom";
import { getBanksPoints, userAccounts } from "../../api/api";
import { loadYandexMaps } from "../../util/loadYandexMaps";


export async function cashMachinePage(token) {
  try {


    const coordinates = await getBanksPoints(token);

    function init() {
      const map = new ymaps.Map("map", {
        center: [59.93, 30.31],
        zoom: 10,
      });

      coordinates.map((point) => {
        const placemark = new ymaps.Placemark([point.lat, point.lon]);

        map.geoObjects.add(placemark);
      })
    }

    loadYandexMaps().then(() => ymaps.ready(init)).catch((error) => console.error(error));

    const cashMachineInfo = el(
      "section",
      { class: "cash-machine", id: "cash-machine-page" },
      [
        el("div", { class: "cash-machine__container container" }, [
          el("h2", { class: "cash-machine__title" }, "Карта банкоматов"),
          el('div', { id: 'map', class: "cash-machine__map", style: "width: 1300 min-height: 728" })
        ]),
      ]
    );

    return cashMachineInfo;
  } catch (error) {
    console.error("Ошибка в currencyPage:", error.message);

    return el(
      "div",
      { class: "error" },
      "Не удалось загрузить данные пользователя."
    );
  }
}
