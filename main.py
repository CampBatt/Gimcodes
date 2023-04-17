from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests as reqs
import random
import time
import asyncio

class priority_code(BaseModel):
    new_code: str
    password: str



async def find_code():
    global x
    global code
    global time_found
    global not_looking
    x2 = x
    looking = True
    s = reqs.Session()
    while looking:
        payload = {
            "code":int(x)
        }
        req = s.post("https://www.gimkit.com/api/matchmaker/find-info-from-code", payload)
        response_headers = req.headers
        requests_left = int(response_headers["X-Ratelimit-Remaining"])
        stat_code = req.status_code
        print(x)
        if stat_code == 200:
            code = x
            time_found = time.time()
            looking = False
            not_looking = True
        if stat_code != 500 and code != 200:
            print(stat_code)
        if requests_left <= 50:
            print("only 50 requests left, sleeping for 5 secconds")
            await asyncio.sleep(5)
        if x2 + 500 == x:
            await asyncio.sleep(1)
            x2 = x

        x += 1
        if x == 1000000:
            x = 10000

origins = [
    "http://127.0.0.1:8000/",
    "127.0.0.1:8000/",
    "http://localhost:8000",
    'http://127.0.0.1:5500/index.html',
    'http://127.0.0.1:5500',
    "127.0.0.1:5500/index.html",
    "127.0.0.1:5500"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


code = "000000"
prio_code = "_ _ _ _ _ _"
time_found = time.time() - 120
not_looking = True
has_not_pleased = True

x = 873200

@app.post('/prio_code')
async def set_new_code(prio:priority_code):
    global has_not_pleased
    global prio_code
    password = prio.password
    if password == 'please' and has_not_pleased:
        prio_code = prio.new_code
        has_not_pleased = False
        return {'message': 'You have good manners so ill let it slide one time'}
        

    if password == '5902':
        prio_code = prio.new_code
        return {'message':'Succesfuly Set New Priority Code'}
    
    if password != '5902' and password != 'please' or not has_not_pleased and password == 'please':
        return {'message':'Wrong password'}
    


@app.get('/setup')
async def roottt():
    global code
    global time_found
    global time_ago
    global time_unit
    global prio_code
    global not_looking
    time_ago = round((time.time() - time_found)/60)
    time_unit = 'minutes'
    if time_ago >= 60:
        time_ago = round(time_ago/60)
        time_unit = 'hours'
    return{'code':code, 'time':time_ago, 'time_unit':time_unit, 'prio_code':prio_code, 'not_looking':not_looking}

@app.get('/test')
async def roott():
    return {'can_continue':not_looking}

@app.get('/')
async def root():
    task = asyncio.create_task(find_code())
    global not_looking
    global code
    if not_looking:
        not_looking = False
        find_code()
        await task
    return {'code':code, 'not_looking':not_looking}

