import re 
from fastapi import FastAPI, Body
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
async def submit_data(data: str = Body(...)):
    #print("Received data:", data)
    masked_data = masking_data(data)
    return masked_data

def parse_data(data):
    result = {
        "credit_num": "",
        "email": "",
        "phone_number": "",
        "datebirth": "",
        "address": ""
    }

    emails = re.findall(
        r'[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}',
        data
    )
    if emails:
        result["email"] = emails[0]

    credit = re.search(
        r'(?<!\d)(?:\d[ -]?){15}\d(?!\d)',
        data
    )
    if credit:
        result["credit_num"] = credit.group().strip()
        
    phones = re.findall(
        r'(?<!\d)(?:\+66|0)[ -]?\d(?:[ -]?\d){8,9}(?!\d)',
        data
    )
    result["phone_number"] = [
        re.sub(r'[ -]', '', phone)
        for phone in phones
    ]

    dob = re.search(
        r'(?:DOB|Date of Birth|Birthdate)\s*:\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        data,
        re.IGNORECASE
    )
    if dob:
        result["datebirth"] = dob.group(1)

    address = re.search(
        r'Address\s*:\s*(.+)',
        data,
        re.IGNORECASE
    )
    if address:
        result["address"] = address.group(1).strip()

    return result
def masking_data(data: str):
    result = parse_data(data)
    credit_num = result["credit_num"]
    email = result["email"]
    phone_number = result["phone_number"]
    datebirth = result["datebirth"]
    address = result["address"]
    datebirth = datebirth.removeprefix("DOB: ")
    address = address.removeprefix("Address: ")
    
    datebirth_pattern = r'(\d{2})/(\d{2})/(\d{2})(\d{2})'
    address_pattern_mask = r'^\d{1,5}'
    credit_pattern_mask = r'\d{4}-\d{4}-\d{4}'
    phone_pattern_mask = r'\d{3}-\d{3}'

    
    masked_credit_num = re.sub(credit_pattern_mask, 'XXXX-XXXX-XXXX', credit_num)
    masked_email = re.sub(
        r'^(.)(.*)(.@.*)$',
        r'\1***\3',
        email
    )
    masked_phone_number = [
        re.sub(r'\d(?=(?:\D*\d){4})', 'X', phone)
        for phone in phone_number
    ]

    masked_phone_number = [
    f"{phone[:3]}-{phone[3:6]}-{phone[6:]}"
    if len(phone) == 10 else phone
    for phone in masked_phone_number
    ]
    masked_datebirth = re.sub(datebirth_pattern, 'XX/XX/\\3XX', datebirth)
    masked_address = re.sub(
        r'^\d+(?:/\d+)?',
        lambda m: re.sub(r'\d', 'X', m.group()),
        address
    )

    return {
    "cardNumber": masked_credit_num,
    "email": masked_email,
    "phone": masked_phone_number,
    "dob": masked_datebirth,
    "address": masked_address
}
