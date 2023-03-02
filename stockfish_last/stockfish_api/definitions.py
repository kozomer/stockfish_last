import jdatetime
from dateutil.relativedelta import relativedelta
from datetime import datetime

def jalali_to_greg(day,month,year):
    gregorian_date = jdatetime.date(year,month,day).togregorian()
    return gregorian_date

def greg_to_jalali(day,month,year):
    jalili_date =  jdatetime.date.fromgregorian(day=day,month=month,year=year)
    return jalili_date 

def calculate_experience_rating(job_start_date):
    current_date = datetime.now().date()
    jalali_current_date = greg_to_jalali(current_date.day,current_date.month,current_date.year)
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