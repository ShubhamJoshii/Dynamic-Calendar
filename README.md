# Dynamic Calendar API Assignment

## Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ShubhamJoshii/Dynamic-Calendar.git
   cd Dynamic-Calendar
   ```
   
2. **Open two diffrent terminals**

3. **Frontend:** In one terminal, Follow this instructions for running frontend locally on PORT [3000](http://localhost:3000/).

```bash
   cd frontend
   npm install
   npm run dev
```

4. **Backend:** In second terminal, Follow this instructions for running backend locally on PORT [8000](http://localhost:8000/).
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## API Reference
### Base URL
The base URL for all endpoints is: `[http://localhost:8000](http://localhost:8000)`

### CORS
Cross-Origin Resource Sharing (CORS) is enabled to allow requests from `[http://localhost:3000](http://localhost:3000)`.


### **Endpoints**
#### 1. Get All Schedules

- **URL**: `/api/allSchedule`
- **Method**: `GET`

#### 2. Create Schedule

- **URL**: `/api/schedule`
- **Method**: `POST`

#### 3. Reschedule

- **URL**: `/api/reschedule/{id}`
- **Method**: `PUT`

#### 4. Update Schedule

- **URL**: `/api/schedule/{id}`
- **Method**: `PUT`

#### 5. Delete Schedule

- **URL**: `/api/schedule/{id}`
- **Method**: `DELETE`

## Video Link   https://youtu.be/DenZ3X7PcG4

## Some ScreenShots

### Monthly Calendar View with Public Holidays
![image](https://github.com/user-attachments/assets/e8a795b6-acee-45a5-81eb-c107ac69de6b)

### Weekly Calendar View
![image](https://github.com/user-attachments/assets/acec20b1-c250-45db-8fe8-ad73e54b942f)

### Daily Calendar View
![image](https://github.com/user-attachments/assets/9d6c79ad-e55e-4097-894c-074fc5e1ac00)

### Schedules View
![image](https://github.com/user-attachments/assets/ca4d20a1-3285-4a0d-ae7b-421db8ff5e9e)

### Edit View
![image](https://github.com/user-attachments/assets/94830cc5-0cd5-46e5-96f4-a4662b7c6cd8)

### ToolTip for Schedules deleting, View and More
![image](https://github.com/user-attachments/assets/08c81d22-ec45-4971-bdeb-839988ca1390)




---

