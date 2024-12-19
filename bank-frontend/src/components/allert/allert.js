import { el, setChildren } from "redom";

export function allert(data) {
  const information = {
    unknowncurrencycode: "передан неверный валютный код, код не поддерживается системой (валютный код списания или валютный код зачисления",
    overdraftprevented: "попытка перевести больше, чем доступно на счёте списания",
    invalidamount: "не указана сумма перевода, или она отрицательная",
    notenoughcurrency: "на валютном счёте списания нет средств",
    invalidpassword: "пытытка войти с неверным паролем",
    nosuchuser: "пользователя с таким логином не существует",
    invalidaccountfrom: "не указан адрес счёта списания, или этот счёт не принадлежит нам",
    invalidaccountto:  "не указан счёт зачисления, или этого счёта не существует",
    overdraftprevented: "вы попытались перевести больше денег, чем доступно на счёте списания",
  }


  return el('div', { class: 'allert' }, el('span', { class: 'allert__info' }, information[data.replace(/\s/g, '').toLowerCase()]))
}
