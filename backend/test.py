import re
def masking_data(data: str):
    credit_num,email,phone_number,datebirth,address = data.split(",")
    credit_pattern = r'\d{4}-\d{4}-\d{4}-\d{4}'
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'\d{3}-\d{3}-\d{4}'
    datebirth_pattern = r'(\d{2})/(\d{2})/(\d{2})(\d{2})'
    address_pattern_mask = r'^\d{1,5}'
    credit_pattern_mask = r'\d{4}-\d{4}-\d{4}'
    phone_pattern_mask = r'\d{3}-\d{3}'

    masked_credit_num = re.sub(credit_pattern_mask, 'XXXX-XXXX-XXXX-', credit_num)
    masked_email = re.sub(r'(?<=.).(?=.*@)', '*', email)
    masked_phone_number = re.sub(phone_pattern_mask, 'XXX-XXX', phone_number)
    masked_datebirth = re.sub(datebirth_pattern, 'XX/XX/\\3XX', datebirth)
    masked_address = re.sub(address_pattern_mask,'XXX',address)

    return masked_credit_num,masked_email,masked_phone_number,masked_datebirth,masked_address

print(masking_data("4111-2222-3333-4444,test@example.com,081-234-5678,15/08/2003,689 ลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง "))
