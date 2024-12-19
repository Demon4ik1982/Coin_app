import "babel-polyfill";

import Navigo from "navigo";
import { el, setChildren } from "redom";
import header from "./components/header/header.js";
import { renderLogin } from "./components/login/login.js";
import { userBill } from "./pages/userBill/userBill.js";
import { currencyPage } from "./pages/currency/currency.js";
import { cashMachinePage } from "./pages/cashMachine/cashMachine.js";
import { loginUser } from "./api/api.js";
import { setUserData } from "./util/setUserData.js";
import { accountPage } from "./pages/accountPage/accountPage.js";
import "./styles/main.scss";
import { allert } from "./components/allert/allert.js";
import Loader from "./components/loader/loader.js";
import { detailedPage } from "./pages/detailedPage/detailedPage.js";

const main = el("main", { class: "main" }, { id: "main" });
setChildren(window.document.body, [header, main]);

const router = new Navigo("/", { hash: false });
export default router;

let token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1") || null;
const loader = new Loader()

function cleanupScroll() {
  if (window.cleanupScrollListener) {
    window.cleanupScrollListener();
}
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const elements = {
  coinNav: document.getElementById("coin-nav"),
  exitButton: document.getElementById("exit"),
  cashMachineButton: document.getElementById("cash-machine"),
  billButton: document.getElementById("bill"),
  currencyButton: document.getElementById("currency"),
};

// Обновление навигации в зависимости от токена
const updateNavigation = () => {
  if (token) {
    elements.coinNav.style.display = "block";
  } else {
    elements.coinNav.style.display = "none";
    router.navigate("/");
  }
};

// Обработчики событий
const setupEventListeners = () => {
  elements.cashMachineButton.addEventListener("click", () => {
    router.navigate("/cash-machine");
  });

  elements.billButton.addEventListener("click", () => {
    router.navigate("/account");
  });

  elements.currencyButton.addEventListener("click", () => {
    router.navigate("/currency");
  });

  elements.exitButton.addEventListener("click", (event) => {
    event.preventDefault();
    setUserData("", "token");
    token = null;
    updateNavigation();
    router.navigate("/");
  });
};

// Маршруты
const setupRoutes = () => {
  router
    .on("/", async () => {
      cleanupScroll()
      if (token) {
        router.navigate("/account");
        elements.coinNav.style.display = "block";
        setChildren(main, await userBill(token));
      } else {
        elements.coinNav.style.display = "none";
        setChildren(main, renderLogin());
        setupLoginForm();
      }
    })
    .on("/cash-machine", async () => {
      cleanupScroll()
      loader.show();
      setChildren(main, loader.el)
      await delay(500);
      setChildren(main, await cashMachinePage(token));
      loader.hide();
    })
    .on("/account/:id", async ({ data: { id } }) => {
      cleanupScroll()
      loader.show();
      setChildren(main, loader.el)
      await delay(500);
      setChildren(main, await accountPage(token, id));
      loader.hide();
    })
    .on("/account/detailed/:id", async ({ data: { id } }) => {
      cleanupScroll()
      loader.show();
      setChildren(main, loader.el)
      await delay(500);
      setChildren(main, await detailedPage(token, id));
      loader.hide();
    })
    .on("/account", async () => {
      cleanupScroll()
      loader.show();
      setChildren(main, loader.el)
      await delay(500);
      setChildren(main, await userBill(token));
      loader.hide();
    })
    .on("/currency", async () => {
      cleanupScroll()
      loader.show();
      setChildren(main, loader.el)
      await delay(500);
      setChildren(main, await currencyPage(token));
      loader.hide();
    })
    .notFound(() => {
      setChildren(main, el("div", "Page not found"));
    });

  router.resolve();
};

// Настройка формы логина
const setupLoginForm = () => {
  const userForm = document.getElementById("login-form");

  userForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userLogin = document.getElementById("login");
    const userPassword = document.getElementById("password");

    const login = userLogin.value;
    const password = userPassword.value;

    const data = await loginUser(login, password);

    if (!data.payload) {
      const main = document.getElementById("login-account");
      const allertInfo = allert(data.error);
      main.appendChild(allertInfo);

      setTimeout(() => {
        main.removeChild(allertInfo);
      }, 3000);

      return;
    }

    token = data.payload.token;
    router.navigate("/account");
    setUserData(token, "token");
    updateNavigation();
    setChildren(main, await userBill(token));
  });
};

// Инициализация приложения
const initializeApp = () => {
  setupEventListeners();
  setupRoutes();
  updateNavigation();
};

initializeApp();
