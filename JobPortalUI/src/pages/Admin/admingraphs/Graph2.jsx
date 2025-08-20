import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "November",
  "December",
];

export function Graph2({ graphData }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Number of Job Applications By Month",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Job Applications",
        data: graphData.map((d) => d.applicationsCount),
        borderColor: "rgb(216,214,206)",
        backgroundColor: "rgb(46, 48, 47)",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
