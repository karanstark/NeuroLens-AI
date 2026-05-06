import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RiskRadar = ({ data }) => {
  const chartData = {
    labels: ['Heart', 'Metabolic', 'Immunity', 'Liver', 'Stress'],
    datasets: [
      {
        label: 'Health Profile',
        data: [
          data?.heart_health || 50,
          data?.metabolic_health || 50,
          data?.immunity || 50,
          data?.liver_health || 50,
          data?.stress_level || 50,
        ],
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: '#0ea5e9',
        borderWidth: 2,
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0ea5e9',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#94a3b8', font: { size: 12 } },
        ticks: { display: false, max: 100, min: 0 },
        suggestedMin: 0,
        suggestedMax: 100
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RiskRadar;
