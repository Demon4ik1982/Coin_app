export function loadYandexMaps() {
  return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?apikey=290d456f-45c9-43db-9a79-527be6cdd381&lang=ru_RU";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Yandex Maps API failed to load"));
      document.head.appendChild(script);
  });
}
