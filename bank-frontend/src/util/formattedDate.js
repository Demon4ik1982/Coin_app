export function formattedDate(amountDate) {
  const date = new Date(amountDate);
  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return formattedDate
}
