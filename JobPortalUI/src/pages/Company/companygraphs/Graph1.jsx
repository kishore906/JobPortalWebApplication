import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

export function Graph1({ graphData }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Total Jobs Posted By Companies By Month",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Jobs Posted",
        data: graphData?.map((d) => d.jobsCount),
        backgroundColor: "rgb(156,163,175)",
      },
      {
        label: "Application received",
        data: graphData?.map((d) => d.applicationsCount),
        backgroundColor: "rgb(45,44,50)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
