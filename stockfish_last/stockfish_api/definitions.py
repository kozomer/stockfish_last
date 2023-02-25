import jdatetime

def jalali_to_greg(day,month,year):
    gregorian_date = jdatetime.date(year,month,day).togregorian()
    return gregorian_date

def greg_to_jalali(day,month,year):
    jalili_date =  jdatetime.date.fromgregorian(day=day,month=month,year=year)
    return jalili_date 