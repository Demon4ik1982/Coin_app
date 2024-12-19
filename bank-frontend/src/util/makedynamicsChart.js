import {
  Chart,
  BarElement,
  BarController,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarElement,
  BarController,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export function makeDynamicsChart(chartInfo, ctx) {
  const sendValue = Math.max(...chartInfo.send);
  const receivingValue = Math.max(...chartInfo.data);

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartInfo.month,
      datasets: [
        {
          label: "Расходы",
          data: chartInfo.send,
          backgroundColor: "#FD4E5D",
          stack: "stack1",
        },
        {
          label: "Доходы",
          data: chartInfo.data,
          backgroundColor: "#76CA66",
          stack: "stack1",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 20,
              weight: 700,
            },
          },
        },
        y: {
          grid: {
            display: true,
          },
          position: "right",
          min: 0,
          max: receivingValue + sendValue,
          ticks: {
            callback: function (value) {
              if (value === this.min || value === this.max) {
                return value.toLocaleString('ru-RU');
              }
              return '';
            },
            font: {
              size: 20,
              weight: 500,
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      barPercentage: 1,
      categoryPercentage: 0.8,
    },
    plugins: [
      {
        id: "chartBorder",
        beforeDraw(chart) {
          const ctx = chart.ctx;
          const { left, right, top, bottom } = chart.chartArea;
          ctx.save();
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.strokeRect(left, top, right - left, bottom - top);
          ctx.restore();
        },
      },
    ],
  });
  return chart;
}
