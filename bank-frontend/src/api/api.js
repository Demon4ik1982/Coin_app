export async function loginUser(login, password) {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login, password }),
  });
  const data = await response.json();
  return { payload: data.payload, error: data.error };
}

export async function userAccounts(token) {
  const response = await fetch("http://localhost:3000/accounts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data.payload;
}

export async function createAccount(token) {
  const response = await fetch("http://localhost:3000/create-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data.payload;
}

export async function getAccountPage(token, id) {
  const response = await fetch(`http://localhost:3000/account/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data.payload;
}

export async function transaction(token, body) {
  const response = await fetch(`http://localhost:3000/transfer-funds/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      from: body.from,
      to: body.to,
      amount: body.amount,
    }),
  });
  const data = await response.json();
  return { payload: data.payload, error: data.error };
}

export async function currencyBuy(token, body) {
  const response = await fetch(`http://localhost:3000/currency-buy/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      from: body.from,
      to: body.to,
      amount: body.amount,
    }),
  });
  const data = await response.json();
  return { payload: data.payload, error: data.error };
}

export async function getCurrencyList(token) {
  const response = await fetch(`http://localhost:3000/currencies/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data.payload;
}

export async function getCurrencyCode(token) {
  const response = await fetch(`http://localhost:3000/all-currencies/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data.payload;
}

export async function getBanksPoints(token) {
  const response = await fetch(`http://localhost:3000/banks/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data.payload;
}
