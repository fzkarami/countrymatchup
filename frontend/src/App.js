import "./App.css";
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Select from 'react-select'
import Footer from "./footer";
import Stat from "./Stat";
import axios from 'axios';

//const baseURL = "http://127.0.0.1:8000"
const baseURL = "https://api.countrymatchup.com"

export default function App() {

  const [countries, setCountries] = useState([])
  const [country1, setCountry1] = useState({name: "Canada", countryCode: "CA"})
  const [country2, setCountry2] = useState({name: "France", countryCode: "FR"})
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    axios.get(`${baseURL}/countries`)
      .then(res => {
        setCountries(res.data);
      })
      .catch(err => {
        console.log(err)
      })
    }, [])

  useEffect(() => {
    axios.get(`${baseURL}/stats?c1=${country1.countryCode}&c2=${country2.countryCode}`)
      .then(res => {
        setStats(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    }, [country1, country2])

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="-m-1.5 p-1.5">
          <img className="h-16 w-auto" src={`${process.env.PUBLIC_URL}/logo.png`} alt="" />
        </div>
      </nav>
      <div className="mt-6 text-s leading-5 text-gray-600 text-center font-medium">
          This is a portfolio project to showcase my data analysis skills. It compares country data on various metrics.<br></br>
          Please find the steps I've taken at the end of this page.
        </div>
      {/* form section */}
      <div 
          className=" bg-white p-6 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900">
          Select two countries to compare
          </h2>
        </div>
      <div className="mx-auto grid max-w-xl grid-cols-3 text-center">
        <div 
          className="rounded-2xl bg-white p-6 shadow-lg ring-2 ring-indigo-500 px-2 py-5 cursor-pointer relative"
          onClick={() => {setSelectedCountry(1)}}
        >
          <div className="absolute top-1 right-1 h-6 w-6 flex justify-center items-center text-indigo-500">
            <PencilSquareIcon className="h-5 w-5" aria-hidden="true"/>
          </div>
          <img className="mx-auto h-24 w-24 rounded-full md:h-40 md:w-36" src={`https://hatscripts.github.io/circle-flags/flags/${country1.countryCode.toLowerCase()}.svg`} alt="" />
          <h2 className="text-3xl font-semibold leading-8 text-gray-900">
            {country1.name}
          </h2>
        </div>
        <div className="text-4xl font-semibold text-gray-700 flex justify-center items-center"><span className="">VS</span></div>
        <div 
          onClick={() => {setSelectedCountry(2)}}
          className="rounded-2xl bg-white p-6 shadow-lg ring-2 ring-orange-400 px-2 py-5 cursor-pointer relative"
        >
          <div className="absolute top-1 right-1 h-6 w-6 flex justify-center items-center text-orange-400">
            <PencilSquareIcon className="h-5 w-5" aria-hidden="true"/>
          </div>
          <img className="mx-auto h-24 w-24 rounded-full md:h-40 md:w-36" src={`https://hatscripts.github.io/circle-flags/flags/${country2.countryCode.toLowerCase()}.svg`} alt="" />
          <h2 className="text-3xl font-semibold leading-8 text-gray-900">
            {country2.name}
          </h2>
        </div>
      </div>

      {/* stats section */}
      <div className="mt-20 mx-auto max-w-7xl items-center justify-between p-6 lg:px-8">
        <h2 className=" font-semibold leading-6 text-gray-900 text-3xl inline-block">
          <img className="h-14 w-auto pr-2 inline-block" src={`${process.env.PUBLIC_URL}/economy.png`} alt="" />
          <span className="align-text-bottom">Economy</span>
        </h2>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
          <Stat name="GDP Per Capita" {...stats.gdp_capita} />
          <Stat name="Inflation Rate" {...stats.inflation_rate} />
          <Stat name="Unemployment Rate" {...stats.unemployment_rate} />
        </dl>
      </div>

      {/* stats section */}
      <div className="mt-20 mx-auto max-w-7xl items-center justify-between p-6 lg:px-8">
        <h2 className="font-semibold leading-6 text-gray-900 text-3xl inline-block">
          <img className="h-14 w-auto pr-2 inline-block" src={`${process.env.PUBLIC_URL}/healthcare.png`} alt="" />
          <span className="align-text-bottom">Heathcare</span>
        </h2>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
          <Stat name="Mortality Rate" {...stats.mortality_rate} />
          <Stat name="Mental Disease Rate" {...stats.mental_dis_rate} />
          <Stat name="Life Expectancy" {...stats.life_expectancy} />
        </dl>
      </div>

      {/* stats section */}
      <div className="mt-20 mx-auto max-w-7xl items-center justify-between p-6 lg:px-8">
        <h2 className="font-semibold leading-6 text-gray-900 text-3xl inline-block">
          <img className="h-14 w-auto pr-2 inline-block" src={`${process.env.PUBLIC_URL}/education.png`} alt="" />
          <span className="align-text-bottom">Education</span>
        </h2>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
          <Stat name="Scientific Publications" {...stats.publications} />
          <Stat name="Years of Schooling" {...stats.avg_schooling} />
          <Stat name="Education Spending" {...stats.exp_education} />
        </dl>
      </div>

      {/* stats section */}
      <div className="mt-20 mx-auto max-w-7xl items-center justify-between p-6 lg:px-8">
        <h2 className="font-semibold leading-6 text-gray-900 text-3xl inline-block">
          <img className="h-14 w-auto pr-2 inline-block" src={`${process.env.PUBLIC_URL}/wellness.png`} alt="" />
          <span className="align-text-bottom">Well-being</span>
        </h2>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
          <Stat name="Income Inequality" {...stats.gini} />
          <Stat name="Human Development Index" {...stats.hdi} />
          <Stat name="Life Satisfaction" {...stats.life_satisfaction} />
        </dl>
      </div>

      {/* form modal */}
      <Transition.Root show={!!selectedCountry} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setSelectedCountry}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5 h-44">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Select a country
                      </Dialog.Title>
                      <div className="mt-2">
                        <Select 
                          onChange={(e) => {
                            if (selectedCountry === 1) setCountry1({name: e.label, countryCode: e.value});
                            if (selectedCountry === 2) setCountry2({name: e.label, countryCode: e.value});
                            setSelectedCountry(false);
                          }}
                          options={countries.map((country) => {
                              return {value: country.countryCode, label: country.name}
                            })
                          }
                          maxMenuHeight={100}
                          menuIsOpen={true}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>   
      <div className="mt-20 mx-auto max-w-7xl items-center justify-between p-6 lg:px-8">
      <div className="font-semibold	">Project steps:<br></br></div>
       - Gathered data from diverse sources and imported it into a database using Python scripts.<br></br>
       - Conducted data cleaning and transformation for improved quality and consistency.<br></br>
       - Performed data calculations and extraction using SQL queries.<br></br>
       - Created a user-friendly website using Create React App and Tailwind CSS for the frontend application.<br></br>
       - Developed a Python backend application for data processing and serving using FastAPI<br></br>
       - Enhanced data visualization with human-readable formatting using functions like Humanize.<br></br>
       - Deployed the project on Google Cloud for accessibility using Docker.
       </div>
      {/* footer section */}
      <Footer />
      <span className="text-red-500 text-green-500 text-gray-500 text-red-800 text-green-800 text-gray-800 bg-red-100 bg-green-100 bg-gray-100"></span>
    </header>
  )
}