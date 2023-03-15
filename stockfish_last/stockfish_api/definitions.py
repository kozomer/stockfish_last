import jdatetime
from dateutil.relativedelta import relativedelta
from datetime import datetime
import requests
from bs4 import BeautifulSoup

def jalali_to_greg(day,month,year):
    gregorian_date = jdatetime.date(year,month,day).togregorian()
    return gregorian_date

def greg_to_jalali(year,month,day):
    jalili_date =  jdatetime.date.fromgregorian(day=day,month=month,year=year)
    return jalili_date

def current_jalali_date():
     current_date = datetime.now().date()
     jalali_current_date = greg_to_jalali(current_date.year,current_date.month,current_date.day)

     return jalali_current_date

def calculate_experience_rating(job_start_date):
    current_date = datetime.now().date()
    jalali_current_date = greg_to_jalali(current_date.year,current_date.month,current_date.day)
    year_diff = jalali_current_date.year - job_start_date.year
    month_diff = jalali_current_date.month - job_start_date.month
    total_diff = (month_diff + (year_diff * 12))/12
    
    if total_diff > 5:
        return 1.30
    elif 3 <= total_diff <= 5:
        return 1.15
    elif 1 <= total_diff < 3:
        return 1.05
    else:
        return 1.00

def calculate_sale_rating(sale_amount):
    print(type(sale_amount))

    if 1000 <= sale_amount:
        return 1.30
    elif 750 <= sale_amount < 1000:
        return 1.20
    elif 500 <= sale_amount < 750:
        return 1.10
    else:
        return 1.00



def get_exchange_rate():
    url = "https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=IRR"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    rate_element = soup.find("p", class_="result__BigRate-sc-1bsijpp-1 iGrAod")
    rate_text = rate_element.text
    rate_value = rate_text.split(" ")[0].replace(",", "")
    rate_float = float(rate_value)
    rounded_rate = round(rate_float, 2)

    return rounded_rate