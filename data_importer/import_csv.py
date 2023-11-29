import sys
import csv
import sqlite3
import pandas as pd
from itertools import islice

def insert_data(conn, df):
    cur = conn.cursor()
    query = "INSERT INTO statistic (country_code, year, metric, value) VALUES (?, ?, ?, ?)"
    cur.executemany(query, df)
    conn.commit()
    cur.close()
    conn.close()
    
def parse_inflation_rate():    
    with open('inflation', 'r') as f:
        reader = csv.DictReader(islice(f, 4, None))
        values = [(row['Country Code'], year, 'inflation_rate', float(value))
                  for row in reader
                  for year in range(2000, 2024)
                  if (value := row.get(str(year)))]
        return values

def parse_gdp_capita():
    with open('gdp', 'r') as f:
        reader = csv.DictReader(islice(f, 4, None))
        values = [(row['Country Code'], year, 'gdp_capita', float(value))
                  for row in reader
                  for year in range(2000, 2024)
                  if (value := row.get(str(year)))]
        return values

def parse_unemployment_rate():
    with open('unemployment', 'r') as f:
        reader = csv.DictReader(islice(f, 4, None))
        values = [(row['Country Code'], year, 'unemployment_rate', float(value))
                  for row in reader
                  for year in range(2000, 2024)
                  if (value := row.get(str(year)))]
        return values

def parse_publications():
    with open('publications.csv', 'r') as f:
        reader = csv.DictReader(islice(f, 1, None))
        values = [(row['Country Code'], year, 'publications', float(value))
                  for row in reader
                  if (year := len(row[1]) <= 3 and int(row[1]) >= 2000 and int(row[1]) <= 2024)
                  if (value := str(row[3]))]
        return values

def parse_avg_schooling(conn,filename):
    with open('avg_schooling.csv', 'r') as f:
        reader = csv.DictReader(islice(f, 1, None))
        values = [(row['Country Code'], year, 'avg_schooling', float(value))
                  for row in reader
                  if (year := len(row[1]) <= 3 and int(row[1]) >= 2000 and int(row[1]) <= 2024)
                  if (value := str(row[3]))]
        return values

def parse_education_expenses():
    with open('exp_education', 'r') as f:
        reader = csv.DictReader(islice(f, 4, None))
        values = [(row['Country Code'], year, 'exp_education', float(value))
                  for row in reader
                  for year in range(2000, 2024)
                  if (value := row.get(str(year)))]
        return values

def parse_life_expectancy():
    with open('life_expectancy.csv', 'r') as f:
        reader = csv.DictReader(islice(f, 4, None))
        values = [(row['Country Code'], year, 'life_expectancy', float(value))
                  for row in reader
                  for year in range(2000, 2024)
                  if (value := row.get(str(year)))]
        return values

def parse_mortality_rate():
    with open('mortality.csv', 'r') as f:
        reader = csv.DictReader(islice(f, 4, None))
        values = [(row['Country Code'], year, 'mortality_rate', float(value))
                  for row in reader
                  for year in range(2000, 2024)
                  if (value := row.get(str(year)))]
        return values

def parse_mental_disorder_rate():
    with open('mental_dis.csv', 'r') as f:
        reader = csv.DictReader(islice(f, 1, None))
        values = [(row['Country Code'], year, 'mental_dis', float(value))
                  for row in reader
                  if (year := len(row[1]) <= 3 and int(row[1]) >= 2000 and int(row[1]) <= 2024)
                  if (value := str(row[3]))]
        return values

def parse_hdi(conn,filename):
    with open('hdi.csv', 'r') as f:
        reader = csv.DictReader(islice(f, 1, None))
        values = [(row['Country Code'], year, 'hdi', float(value))
                  for row in reader
                  if (year := len(row[1]) <= 3 and int(row[1]) >= 2000 and int(row[1]) <= 2024)
                  if (value := str(row[3]))]
        return values

def parse_gini():
    with open('gini.csv', 'r') as f:
        reader = csv.DictReader(islice(f, 4, None))
        values = [(row['Country Code'], year, 'gini', float(value))
                  for row in reader
                  for year in range(2000, 2024)
                  if (value := row.get(str(year)))]
        return values

def parse_life_satisfaction():
    with open('life_satisfaction.csv', 'r') as f:
        reader = csv.DictReader(islice(f, 1, None))
        values = [(row['Country Code'], year, 'life_satisfaction', float(value))
                  for row in reader
                  if (year := len(row[1]) <= 3 and int(row[1]) >= 2000 and int(row[1]) <= 2024)
                  if (value := str(row[3]))]
        return values

if __name__ == '__main__':
    conn = sqlite3.connect('countrymatchup.db')

    for f in [
            parse_inflation_rate, parse_gdp_capita, parse_unemployment_rate, parse_publications, parse_avg_schooling,
            parse_education_expenses, parse_life_expectancy, parse_mortality_rate, parse_mental_disorder_rate,
            parse_gini, parse_hdi, parse_life_satisfaction
        ]:
        values = f()
        insert_data(conn, values)



