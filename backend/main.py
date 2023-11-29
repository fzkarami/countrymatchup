#from typing import Union
import sqlite3

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create a FastAPI instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#get the list of the countries and their codes
@app.get("/countries")
def list_countries():
    # Connect to the database and execute a query to retrieve country names and codes
    with sqlite3.connect('countrymatchup.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT name, countrycode FROM country')
        countries = [{"name": row[0], "countryCode": row[1]} for row in cursor]
    return countries

#Get the metrics for the selected countries (country 1 and country 2)
@app.get("/stats")
def get_countries_stats(c1: str, c2: str):
    
    with sqlite3.connect('countrymatchup.db') as conn:
        # Open a cursor to perform database operations 
        cursor = conn.cursor()

        #Query to retrieve and process statistics data for the selected countries
        #first: get the data for the selected country number 1
        #second: get the data for the selected country number 2
        #third: get the data to display and previous metric values for the past year and calculate the rate of change
        query = """
              WITH country1_data AS (
                SELECT statistic.year, statistic.metric, country.countrycode as c1_country, statistic.value as c1_value
                FROM statistic, country
                WHERE statistic.country_code = country.country_code3 and country.countrycode=? AND statistic.value IS NOT NULL
              ),
              country2_data AS (
                SELECT statistic.year, statistic.metric, country.countrycode as c2_country, statistic.value as c2_value
                FROM statistic, country
                WHERE statistic.country_code = country.country_code3 and country.countrycode=? AND statistic.value IS NOT NULL
              ),
              data AS (
                SELECT 
                    country1_data.year, country1_data.metric, country1_data.c1_country, country1_data.c1_value,LAG(country1_data.c1_value, -1) OVER (PARTITION BY country1_data.metric ORDER BY country1_data.year DESC) AS c1_prev_value,
                    country2_data.c2_country, country2_data.c2_value,LAG(country2_data.c2_value, -1) OVER (PARTITION BY country2_data.metric ORDER BY country2_data.year DESC) AS c2_prev_value
                FROM country1_data
                    JOIN country2_data ON country1_data.year = country2_data.year AND country1_data.metric = country2_data.metric
                ORDER by country1_data.metric,country1_data.year desc
              )
              SELECT * 
              FROM (
                SELECT data.year,data.metric,data.c1_country,data.c1_value,c1_prev_value, ROUND(((data.c1_value - data.c1_prev_value) / data.c1_prev_value) * 100, 2) as c1_value_change,
                  CASE WHEN (((data.c1_value - data.c1_prev_value) / data.c1_prev_value) * 100)  > 0 THEN 'increase' WHEN (((data.c1_value - data.c1_prev_value) / data.c1_prev_value) * 100)  < 0 THEN 'decrease' ELSE 'neutral' END AS direction_c1,
                  CASE WHEN (((data.c1_value - data.c1_prev_value) / data.c1_prev_value) * 100)  > 0 THEN 'green' WHEN (((data.c1_value - data.c1_prev_value) / data.c1_prev_value) * 100)  < 0 THEN 'red' ELSE 'gray' END AS color_c1,
                  data.c2_country,data.c2_value,c2_prev_value, ROUND(((data.c2_value - data.c2_prev_value) / data.c2_prev_value) * 100, 2) as c2_value_change,
                  CASE WHEN (((data.c2_value - data.c2_prev_value) / data.c2_prev_value) * 100)  > 0 THEN 'increase' WHEN (((data.c2_value - data.c2_prev_value) / data.c2_prev_value) * 100)  < 0 THEN 'decrease' ELSE 'neutral' END AS direction_c2,
                  CASE WHEN (((data.c2_value - data.c2_prev_value) / data.c2_prev_value) * 100)  > 0 THEN 'green'  WHEN (((data.c2_value - data.c2_prev_value) / data.c2_prev_value) * 100)  < 0 THEN 'red' ELSE 'gray' END AS color_c2,
                ROW_NUMBER() OVER (PARTITION BY data.metric ORDER BY data.year desc) AS row_num
                    FROM data
              ) AS subquery
              WHERE row_num <= 10
              ORDER BY subquery.metric, subquery.year;
        """
        cursor.execute(query, (c1, c2))
        rows = cursor.fetchall()
        cursor.close

        # initializes an empty dictionary
        data = {}

        # Process the retrieved data: c1 for the selected country1 and c2 for the for selected country2
        for row in rows:
          year, metric, _, c1_value, _, c1_value_change, direction_c1, color_c1, _, c2_value, _, c2_value_change, direction_c2, color_c2, _  = row
          if metric not in data:
              # Fill the  key with its nested structure and initial values
              data[metric] = {
                  "labels": [year],
                  "c1": [c1_value],
                  "c2": [c2_value],
                  "last_value": {
                            "c1": {"value": None, "roc": None, "direction": None, "color": None},
                            "c2": {"value": None, "roc": None, "direction": None, "color": None},
                  },
              }
          else:
              # Append the values to the existing key data
              data[metric]["labels"].append(year)
              data[metric]["c1"].append(c1_value)
              data[metric]["c2"].append(c2_value)

              # Update the "last_value" with the values from the last year 
              data[metric]["last_value"]["c1"]["value"] = c1_value
              data[metric]["last_value"]["c1"]["roc"] = c1_value_change
              data[metric]["last_value"]["c1"]["direction"] = direction_c1
              data[metric]["last_value"]["c1"]["color"] = getRocColor(metric, c1_value_change)
              data[metric]["last_value"]["c2"]["value"] = c2_value
              data[metric]["last_value"]["c2"]["roc"] = c2_value_change
              data[metric]["last_value"]["c2"]["direction"] = direction_c2
              data[metric]["last_value"]["c2"]["color"] = getRocColor(metric, c2_value_change)

    return data

#attribute the colors according to the rate of change 'roc': Green , Red or Grey(for no change)
def getRocColor(metric, roc):
    if roc == None:
        return "gray"
    if roc > 0:
        if metric in ["inflation_rate", "unemployment_rate", "mortality_rate", "gdp_per_capita", "mental_dis_rate","gini"]:
            return "red"
        return "green"
    elif roc < 0:
        if metric in ["inflation_rate", "unemployment_rate", "mortality_rate", "gdp_per_capita", "mental_dis_rate","gini"]:
            return "green"
        return "red"
    else:
        return "gray"

