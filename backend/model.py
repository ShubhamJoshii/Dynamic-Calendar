from pydantic import BaseModel, Field
from typing import Optional, List

class Calendar(BaseModel):
    id: Optional[str] = Field(None,alias="_id")
    title: str
    description: str
    date: str
    time: str
    duration: int
    type:str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class ReSchedule(BaseModel):
    time:str
    date:str

class UpdateSchedule(BaseModel):
    title: str
    description: str
    date: str
    time: str
    duration: int
    type:str

class TypeSchedule(BaseModel):
    typeAllowed: List[str]