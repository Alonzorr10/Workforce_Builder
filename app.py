
from bs4 import BeautifulSoup
import requests

URL = "https://alonzorr10.github.io/Workforce_Builder/"
r = requests.get(URL)

soup = BeautifulSoup(r.content, 'html5lib')

occupation = []
freeTime = []
sleepHours = []
daysAvailable = []
daysNotAvailable = []

table = soup.find('div', attrs = {'id': 'fields'})


print(soup.prettify())

