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
    time_diff = relativedelta(datetime.now().date(), job_start_date)
    years = time_diff.years + (time_diff.months / 12)
    if years > 5:
        return 1.30
    elif 3 <= years <= 5:
        return 1.15
    elif 1 <= years < 3:
        return 1.05
    else:
        return 1.00