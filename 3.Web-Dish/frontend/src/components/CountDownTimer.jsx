import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import useCountdown from '../hooks/Countdown';
// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const CountdownComponent = ({initialTimer}) => {
  const { minutes, seconds, start, pause, reset, isActive } = useCountdown(initialTimer);
  const remainingTime = minutes * 60 + seconds;
  const elapsedTime = initialTimer - remainingTime;

  const data = {
    labels: ['Elapsed Time', 'Remaining Time'],
    datasets: [
      {
        data: [elapsedTime, remainingTime],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000, // Duration of the animation in milliseconds
      easing: 'easeOutQuart', // Easing function for the animation
    },
    plugins: {
      tooltip: {
        enabled: false, // Disable tooltips for better visibility
      },
      legend: {
        display: false, // Hide legend
      },
    },
    cutout: '70%', // Defines the size of the inner radius (donut size)
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      
      <div className="relative w-72 h-72">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-black">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-4">
        <button
          className={"px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"}
          onClick={start}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
</svg>

        </button>

        <button className='px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600'
        onClick={pause}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" />
</svg>

        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={reset}
        >
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
</svg>

        </button>
      </div>
    </div>
  );
};

export default CountdownComponent;
