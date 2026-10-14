import re
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware

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
    return masking_data(data)


def parse_data(data: str):
    result = {
        "credit_num": [],
        "email": [],
        "phone_number": [],
        "datebirth": [],
        "address": []
    }

    result["email"] = re.findall(
        r'[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}',
        data
    )

    result["credit_num"] = re.findall(
        r'(?<!\d)(?:\d[ -]?){15}\d(?!\d)',
        data
    )

    phones = re.findall(
        r'(?<!\d)(?:\+66|0)[ -]?\d(?:[ -]?\d){8,9}(?!\d)',
        data
    )

    result["phone_number"] = [
        re.sub(r'[ -]', '', phone)
        for phone in phones
    ]

    result["datebirth"] = re.findall(
        r'(?:DOB|Date of Birth|Birthdate)\s*:\s*'
        r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        data,
        re.IGNORECASE
    )

    result["address"] = re.findall(
    r'Address\s*:\s*(.*?)'
    r'(?=\s*(?:Address|payment|DOB|Date of Birth|Birthdate|Phone|'
    r'alt contact|email)\s*:?\s*|$)',
    data,
    re.IGNORECASE
)

    result["address"] = [
        address.strip()
        for address in result["address"]
        if address.strip()
    ]
    return result


def mask_email(email: str):
    username, domain = email.rsplit("@", 1)

    if len(username) == 1:
        masked = username
    elif len(username) == 2:
        masked = username[0] + "*" + username[-1]
    else:
        masked = (
            username[0]
            + "*" * (len(username) - 2)
            + username[-1]
        )

    return f"{masked}@{domain}"


def masking_data(data: str):
    result = parse_data(data)

    masked_credit_num = []

    for card in result["credit_num"]:
        digits = re.sub(r'\D', '', card)
        masked_credit_num.append(
            f"XXXX-XXXX-XXXX-{digits[-4:]}"
            if len(digits) == 16 else card
        )

    masked_email = [
        mask_email(email)
        for email in result["email"]
    ]

    masked_phone_number = []

    for phone in result["phone_number"]:
        if len(phone) == 10:
            masked_phone_number.append(
                f"XXX-XXX-{phone[-4:]}"
            )
        else:
            masked_phone_number.append(phone)

    masked_datebirth = []

    for date in result["datebirth"]:
        match = re.fullmatch(
            r'(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})',
            date
        )

        if match:
            separator = "/" if "/" in date else "-"
            year = match.group(3)
            masked_datebirth.append(
                f"XX{separator}XX{separator}{year}"
            )
        else:
            masked_datebirth.append(date)

    masked_address = [
        re.sub(
            r'^\s*\d+(?:/\d+)?',
            lambda m: re.sub(r'\d', 'X', m.group()),
            address.strip()
        )
        for address in result["address"]
    ]

    return {
        "cardNumber": masked_credit_num,
        "email": masked_email,
        "phone": masked_phone_number,
        "dob": masked_datebirth,
        "address": masked_address
    }
