import { el } from "redom";

export function makeCurrencyList(params) {
  const list = Object.values(params).map((currency) => {
    return el(
      "li",
      { class: "currency__currency-user-item" },
      el("span", { class: "currency__code" }, currency.code),
      el("span", { class: "currency__dots" }, ""),
      el(
        "span",
        { class: "currency__amount" },
        currency.amount.toLocaleString()
      )
    );
  });
  return list;
}
