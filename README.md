# TOC Assignment

## Installation

Clone the project and install the required dependencies.

### 1. Install Backend Dependencies

From the root project directory:

```bash
npm install
```

### 2. Install Frontend Dependencies

Go to the `frontend` directory:

```bash
cd ./frontend
npm install
```

After installation, return to the root project directory:

```bash
cd ..
```

---

## Run the Project

Run the following command from the **root project directory**:

```bash
npm run dev
```

This command starts both the frontend and backend simultaneously.

### Frontend

* Framework: Vite
* Port: `5173`
* URL: http://localhost:5173/

### Backend

* Framework: FastAPI
* Server: Uvicorn
* Port: `8000`
* URL: http://127.0.0.1:8000

---

## Expected Output

When the project starts successfully, the terminal should show something similar to:

```text
> assignment@1.0.0 frontend
> cd frontend && npm run dev

> assignment@1.0.0 backend
> cd backend && cd app && python -m uvicorn api:app --reload

INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.

> toc@0.0.0 dev
> vite

VITE v8.3.0  ready in 2089 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Access the Application

Open the frontend in your browser:

```text
http://localhost:5173/
```

The backend API is available at:

```text
http://127.0.0.1:8000
```
---
## Input Format

The application accepts user information in the following format:

| Field         | Format                | Example                                                          |
| ------------- | --------------------- | ---------------------------------------------------------------- |
| Card Number   | `XXXX-XXXX-XXXX-XXXX` | `1234-5678-9012-3456`                                            |
| Email         | Email address         | `example@gmail.com`                                              |
| Phone         | `XXX-XXX-XXXX`        | `091-759-5508`                                                   |
| Date of Birth | `DD/MM/YYYY`          | `05/05/2549`                                                     |
| Address       | Thai address          | `123 ซอยลาดพร้าว ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร` |

### Input Example

```text
1234-5678-9012-3456
example@gmail.com
091-759-5508
DOB: 05/05/2549
Address: 123 ซอยลาดพร้าว ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร
```
---

## Stop the Servers

To stop both the frontend and backend servers, press:

```text
Ctrl + C
```

Then confirm termination if prompted.
