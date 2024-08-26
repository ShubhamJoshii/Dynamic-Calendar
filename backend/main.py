from fastapi import FastAPI, HTTPException
app = FastAPI()
from model import UpdateSchedule, TypeSchedule, ReSchedule

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app.mount("/assets", StaticFiles(directory="../frontend/dist/assets"), name="assets")

from model import Calendar

from database import (
    fetchSchedules,
    createSchedule,
    ReScheduleFun,
    updateSchedule,
    deleteSchedule,
)

from fastapi.middleware.cors import CORSMiddleware


origins = ["http://localhost:3000",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
        
@app.post("/api/allSchedule")
async def get_schedule(request: TypeSchedule):
    # print(request.typeAllowed)
    response = await fetchSchedules(request.typeAllowed)
    return response


@app.post("/api/schedule")
async def post_schedule(schedule:Calendar):
    response = await createSchedule(schedule)
    if response :
        return response
    raise HTTPException(404, "Something Went Wrong / Bad Request")

@app.put("/api/reschedule/{id}")
async def put_schedule(id:str, data:ReSchedule):
    response = await ReScheduleFun(id,data.date, data.time)
    if response :
        return response
    raise HTTPException(404, "Something Went Wrong / Bad Request")

@app.put("/api/schedule/{id}")
async def update_schedule(id:str, data:UpdateSchedule):
    # print(data)
    response = await updateSchedule(id,data)
    if response :
        return response
    raise HTTPException(404, "Something Went Wrong / Bad Request")
    
@app.delete("/api/schedule/{id}")
async def delete_schedule(id):
    response = await deleteSchedule(id)
    if response :
        return response
    raise HTTPException(404, "Something Went Wrong / Bad Request")


@app.get("/{catchall:path}")
async def serve_react_app(catchall: str):
    return FileResponse("../frontend/dist/index.html")