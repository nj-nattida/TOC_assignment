import re 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class UserData(BaseModel):
    cardNumber: str
    email: str
    phone: str
    dob: str
    address: str

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

@app.post("/submit")
async def submit_data(data: UserData):
    masked_data = masking_data(data)
    return {"masked_data": masked_data}

def masking_data(data: UserData):
    credit_num = data.cardNumber
    email = data.email
    phone_number = data.phone
    datebirth = data.dob
    address = data.address
    
    datebirth_pattern = r'(\d{2})/(\d{2})/(\d{2})(\d{2})'
    address_pattern_mask = r'^\d{1,5}'
    credit_pattern_mask = r'\d{4}-\d{4}-\d{4}'
    phone_pattern_mask = r'\d{3}-\d{3}'

    
    masked_credit_num = re.sub(credit_pattern_mask, 'XXXX-XXXX-XXXX', credit_num)
    masked_email = re.sub(r'^(.)(.*)(.@.*)$', r'\1***\3', email)
    masked_phone_number = re.sub(phone_pattern_mask, 'XXX-XXX', phone_number)
    masked_datebirth = re.sub(datebirth_pattern, 'XX/XX/\\3XX', datebirth)
    masked_address = re.sub(address_pattern_mask,'XXX',address)

    return {
    "cardNumber": masked_credit_num,
    "email": masked_email,
    "phone": masked_phone_number,
    "dob": masked_datebirth,
    "address": masked_address
}
