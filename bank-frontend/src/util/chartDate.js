export function chartDate(account, n) {
  const todayMonth = new Date(account.transactions.at(-1).date).getMonth();
  const todayYear = new Date(account.transactions.at(-1).date).getFullYear();

  let rangeDate = [];

  for (let index = 0; index < n; index++) {
    let month = todayMonth - index;
    let year = todayYear;
    if (month < 0) {
      month = 11 + month;
      year--;
    }
    rangeDate.push({
      month: month,
      year: year,
    });
  }


  const transactionData = rangeDate.map((date) => {
    return Math.round(
      account.transactions
        .filter((item) => {
          const transactionDate = new Date(item.date);
          return (
            transactionDate.getMonth() === date.month &&
            transactionDate.getFullYear() === date.year
          );
        })
        .reduce((total, transaction) =>
        {
          if(transaction.from === account.account) return total - transaction.amount;
        return total + transaction.amount;
      }
        , 0)
    );
  });

  const sendtransactionData = rangeDate.map((date) => {
    return Math.round(
      account.transactions
        .filter((item) => {
          const transactionDate = new Date(item.date);
          return (
            transactionDate.getMonth() === date.month &&
            transactionDate.getFullYear() === date.year
          );
        })
        .reduce((total, transaction) =>
        {
          if(transaction.from === account.account) return total + transaction.amount;
        return total;
      }
        , 0)
    );
  });


  const monthNames = [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];

  const monthsWithNames = rangeDate.map((item) => monthNames[item.month]);

  return {
    data: transactionData.reverse(),
    send: sendtransactionData.reverse(),
    month: monthsWithNames.reverse()
  }
}
