import requests
import time
import random

URL = 'http://regalista.herokuapp.com'
LOG_BODY = False

while True:
    print(f'Sending request to {URL}')
    try:
        response = requests.get(URL)
        message = f'Response: {response.status_code}' + (f': {response.text}' if LOG_BODY else '') + '\n'
        print(message)
    except Exception as e:
        print(e)
    wait_time = random.randint(20, 60)
    print(f'Waiting {wait_time} seconds until next request...')
    time.sleep(wait_time)
