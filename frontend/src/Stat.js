import { ArrowDownIcon, ArrowUpIcon, MinusSmallIcon } from '@heroicons/react/20/solid'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Humanize from 'humanize-plus';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display: false,

    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
  scales: {
    y: {
      grid: {
        drawBorder: false,
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 12,
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'nearest',
  },

};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function getSource(metric) {
  switch (metric) {
    case 'GDP Per Capita':
    case 'Inflation Rate':
    case 'Unemployment Rate':
    case 'Mortality Rate':
    case 'Life Expectancy':
    case 'Education Spending':
    case 'Income Inequality':
      return 'World Bank data';
    case 'Mental Disease Rate':
    case 'Scientific Publications':
    case 'Years of Schooling':
    case 'Human Development Index':
    case 'Life Satisfaction':
      return 'Our World in Data';
    default:
      return '';
  }
}


function getNote(metric) {
  switch (metric) {
    case 'GDP Per Capita':
      return 'GDP per capita in US$.';
    case 'Inflation Rate':
      return 'Inflation rate, consumer prices.';
    case 'Unemployment Rate':
      return 'Unemployment (% of total labor force).';
    case 'Mortality Rate':
      return 'Mortality rate, under-5 (per 1,000 live births).';
    case 'Life Expectancy':
      return 'Life expectancy at birth, total (years).';
    case 'Education Spending':
      return 'Spending on education (% of government expenditure).'
    case 'Income Inequality':
      return 'Distribution of income, Gini Index.';
    case 'Mental Disease Rate':
      return 'Prevalence of mental disorders (% of population).';
    case 'Scientific Publications':
      return 'Scientific articles per million people.';
    case 'Years of Schooling':
      return 'Expected years of schooling.';
    case 'Human Development Index':
      return 'Human Development Index (HDI).';
    case 'Life Satisfaction':
      return 'Average responses to the "Cantril Ladder" question.';
    default:
      return '';
  }
}

export default function Stat(item) {
  const labels = item.labels;
  const chartData = {
    labels,
    datasets: [
      {
        data: item.c1,
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderColor: 'rgb(99, 102, 241)',
        fill: true,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: 'rgb(99, 102, 241)',
      },
      {
        data: item.c2,
        borderColor: 'rgb(251, 146, 60)',
        fill: false,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: 'rgb(203, 213, 225)',
      },
    ],
  };
 
  let arrow2Icon = ''
  if (item.last_value?.c2?.direction === 'increase') {
    arrow2Icon = <ArrowUpIcon
      className={`-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-${item.last_value?.c2?.color}-500`}
      aria-hidden="true"
    />
  } else if (item.last_value?.c2?.direction === 'decrease') {
    arrow2Icon = <ArrowDownIcon
      className={`-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-${item.last_value?.c2?.color}-500`}
      aria-hidden="true"
    />
  } else if (item.last_value?.c2?.direction === 'neutral') {
    arrow2Icon = <MinusSmallIcon
      className={`-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-${item.last_value?.c2?.color}-500`}
      aria-hidden="true"
    />
  }


  let arrow1Icon = ''
  if (item.last_value?.c1?.direction === 'increase') {
    arrow1Icon = <ArrowUpIcon
      className={`-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-${item.last_value?.c1?.color}-500`}
      aria-hidden="true"
    />
  } else if (item.last_value?.c1?.direction === 'decrease') {
    arrow1Icon = <ArrowDownIcon
      className={`-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-${item.last_value?.c1?.color}-500`}
      aria-hidden="true"
    />
  } else if (item.last_value?.c1?.direction === 'neutral') {
    arrow1Icon = <MinusSmallIcon
      className={`-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-${item.last_value?.c1?.color}-500`}
      aria-hidden="true"
    />
  }

  return (
    <div key={item.name} className="px-4 py-5 sm:p-6">
      <dt className="text-base text-xl font-semibold font-normal text-gray-900">{item.name}</dt>

      <dd className="mt-1 flex items-baseline md:block justify-between lg:flex">
        <div className='flex items-baseline'>
          <div className="text-2xl font-semibold text-indigo-600">
            {item.last_value?.c1?.value > 1000 ? Humanize.compactInteger(item.last_value?.c1?.value, 1) : item.last_value?.c1?.value}
          </div>
          <div
            className={classNames(
              `bg-${item.last_value?.c1?.color}-100 text-${item.last_value?.c1?.color}-800`,
              'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0 ml-2'
            )}
          >
            {arrow1Icon}
            {item.last_value?.c1?.roc}%
          </div>
        </div>
        <div className='flex items-baseline'>
          <div className="text-2xl font-semibold text-orange-400">
            {item.last_value?.c2?.value > 1000 ? Humanize.compactInteger(item.last_value?.c2?.value, 1) : item.last_value?.c2?.value}
          </div>
          <div
            className={classNames(
              `bg-${item.last_value?.c2?.color}-100 text-${item.last_value?.c2?.color}-800`,
              'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0 ml-2'
            )}
          >
            {arrow2Icon}
            {item.last_value?.c2?.roc}%
          </div>
        </div>
      </dd>
      <Line className="mt-10" options={chartOptions} data={chartData} />

      <div className="mt-6 text-xs leading-5 text-gray-600">
        <span>Source: {getSource(item.name)}</span>
        <br />
        <span>* {getNote(item.name)}</span>
      </div>
    </div>
  )
}