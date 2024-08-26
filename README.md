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
![Screenshot 2024-08-26 223352](https://github.com/user-attachments/assets/c92c7936-30d4-4e3a-8076-834364952d47)

### Weekly Calendar View
![Screenshot 2024-08-26 223537](https://github.com/user-attachments/assets/f6b9df36-fa1e-4aad-85b7-288419b667bb)

### Daily Calendar View
![Screenshot 2024-08-26 223701](https://github.com/user-attachments/assets/7fa19ede-6116-45b3-bd4d-f7bf1d14424d)

### Schedules View
![Screenshot 2024-08-26 223756](https://github.com/user-attachments/assets/50a01897-9237-4acf-bc27-d7759a7eb11f)

### Edit View
![Screenshot 2024-08-26 223904](https://github.com/user-attachments/assets/53c7d919-f4c6-41e1-8552-57bb50fbe4e4)

### ToolTip for Schedules deleting, View and More
![Screenshot 2024-08-26 223844](https://github.com/user-attachments/assets/69833310-2e78-4db3-a6bb-10657cb62d7b)




---

