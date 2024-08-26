from model import Calendar, UpdateSchedule
from bson import ObjectId
import motor.motor_asyncio
from fastapi import HTTPException


client = motor.motor_asyncio.AsyncIOMotorClient("mongodb+srv://shubhamjoshii676:M0v8e7JCBTffqEt9@cluster0.l1uqq.mongodb.net/HelpCenter?retryWrites=true&w=majority&appName=Cluster0")
database = client.Calendar
collection = database.Schedule

async def fetchSchedules(typeAllowed):
    result = []
    schedules =  collection.find({"type":{"$in":typeAllowed}}).sort({ "date": 1, "time": 1 });
    async for doc in schedules:
        doc["_id"] = str(doc["_id"])
        result.append(Calendar(**doc))
    
    return result

async def createSchedule(data):
    doc = data.dict(exclude_unset=True, exclude={"id"})
    result = await collection.insert_one(doc)
    return data

async def ReScheduleFun(id:str,date:str,time:str):
    try:
        object_id = ObjectId(id)
        print(id,date,time)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    result = await collection.update_one({"_id":object_id},{"$set":{
        "date":date,
        "time":time
    }})

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Schedule not found or nothing to update")

    return {"msg":"Schedule Updated"}

async def updateSchedule(id:str,data:UpdateSchedule):
    try:
        object_id = ObjectId(id)
        print(id,data);
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    result = await collection.update_one({"_id":object_id},{"$set":{
        "title": data.title,
        "description": data.description,
        "date": data.date,
        "time": data.time,
        "duration": data.duration,
        "type": data.type
    }})

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Schedule not found or nothing to update")

    return {"msg":"Schedule Updated"}


async def deleteSchedule(id:str):
    try:
        object_id = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    result = await collection.delete_one({"_id":object_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Schedule not found")

    return {"msg": "Schedule deleted successfully"}