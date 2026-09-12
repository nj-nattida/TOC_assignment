import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    cardNumber: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [savedData, setSavedData] = useState(null);

  // -----------------------------
  // Format Card Number
  // 1234567890123456
  // ↓
  // 1234-5678-9012-3456
  // -----------------------------
  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 16);

    return numbers.replace(/(\d{4})(?=\d)/g, "$1-");
  };

  // -----------------------------
  // Format Phone Number
  // 0932457894
  // ↓
  // 093-245-7894
  // -----------------------------
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 10);

    if (numbers.length <= 3) {
      return numbers;
    }

    if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }

    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  };

  // -----------------------------
  // Format DOB
  // DDMMYYYY
  // ↓
  // DD/MM/YYYY
  // -----------------------------
  const formatDOB = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);

    if (numbers.length <= 2) {
      return numbers;
    }

    if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }

    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
  };

  // -----------------------------
  // Validate Form
  // -----------------------------
  const validate = () => {
    const newErrors = {};

    // ===== CARD =====
    const cardDigits = formData.cardNumber.replace(/\D/g, "");

    if (!cardDigits) {
      newErrors.cardNumber = "Please enter your card number.";
    } else if (cardDigits.length !== 16) {
      newErrors.cardNumber =
        "Card number must contain 16 digits.";
    }

    // ===== EMAIL =====
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // ===== PHONE =====
    const phoneDigits = formData.phone.replace(/\D/g, "");

    if (!phoneDigits) {
      newErrors.phone = "Please enter your phone number.";
    } else if (phoneDigits.length !== 10) {
      newErrors.phone =
        "Phone number must contain 10 digits.";
    }

    // ===== DOB =====
    if (!formData.dob) {
      newErrors.dob = "Please enter your date of birth.";
    } else {
      const dobMatch = formData.dob.match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
      );

      if (!dobMatch) {
        newErrors.dob =
          "Date of birth must be in DD/MM/YYYY format.";
      } else {
        const day = Number(dobMatch[1]);
        const month = Number(dobMatch[2]);
        const year = Number(dobMatch[3]);
        const currentYear = new Date().getFullYear() + 543;

        if (
          month < 1 ||
          month > 12 ||
          year < 2400 ||
          year > currentYear
        ) 
        {
          newErrors.dob = "Please enter a valid date of birth.";
        } 
        else {
          const daysInMonth = new Date(year - 543,month,0).getDate();
          if (day < 1 || day > daysInMonth) {
            newErrors.dob = "Please enter a valid date of birth.";
          }
        }
      }
    }

    // ===== ADDRESS =====
    const address = formData.address.trim();

    if (!address) {
      newErrors.address = "Please enter your address.";
    } else {
      // ต้องมีเลขที่บ้านด้านหน้า
      const hasHouseNumber = /^\d+/.test(address);

      // ต้องมีรายละเอียดหลังเลขที่บ้าน
      const remainingAddress = address
        .replace(/^\d+/, "")
        .trim();

      if (!hasHouseNumber) {
        newErrors.address =
          "Address must start with a house number.";
      } else if (remainingAddress.length === 0) {
        newErrors.address =
          "Please enter additional address details.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Handle Input
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    }

    if (name === "phone") {
      formattedValue = formatPhone(value);
    }

    if (name === "dob") {
      formattedValue = formatDOB(value);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });

    // ลบ error ของช่องนั้นเมื่อผู้ใช้เริ่มแก้
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // -----------------------------
  // Submit
  // -----------------------------
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!validate()) {
  //     return;
  //   }

  //   // Mock Backend
  //   const mockResponse = {
  //     cardNumber: "****-****-****-3456",
  //     email: "s**********@gmail.com",
  //     phone: "***-***-7894",
  //     dob: "**/**/2549",
  //     address: formData.address,
  //   };

  //   setSavedData(mockResponse);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", JSON.stringify(formData));
    if (!validate()) {
      return;
    }

    try {
      const response = await fetch("/submit",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer information.");
      }

      const data = await response.json();

      // เอาข้อมูลที่ backend ส่งกลับมาแสดง
      setSavedData(data.masked_data);
    } catch (error) {
      console.error(error);
      alert("Unable to save customer information.");
    }
  };

  return (
    <div className="container">

      {!savedData ? (
        <>
          <h1>Customer Information</h1>

          <form onSubmit={handleSubmit}>

            {/* CARD */}
            
            <div className="label-row">
              <label>Credit Card Number</label>

              <span className="info">
                ⓘ
                <span className="tooltip">
                Enter 16 digits. The "-" will be added automatically.
                </span>
              </span>
            </div>

            <input
              type="text"
              name="cardNumber"
              placeholder="1234-5678-9012-3456"
              value={formData.cardNumber}
              onChange={handleChange}
              className={
                errors.cardNumber ? "input-error" : ""
              }
              inputMode="numeric"
            />


            {errors.cardNumber && (
              <span className="error">
                {errors.cardNumber}
              </span>
            )}


            {/* EMAIL */}
            <div className="label-row">
              <label>
              Email
              </label>
            </div>
            

            <input
              type="text"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              title="Enter a valid email address, e.g. example@gmail.com"
            />

            {errors.email && (
              <span className="error">
                {errors.email}
              </span>
            )}


            {/* PHONE */}
            <div className="label-row">
              <label>
              Phone Number
              </label>
            </div>
            
            <input
              type="text"
              name="phone"
              placeholder="093-245-7894"
              value={formData.phone}
              onChange={handleChange}
              className={
                errors.phone ? "input-error" : ""
              }
              inputMode="numeric"
            />


            {errors.phone && (
              <span className="error">
                {errors.phone}
              </span>
            )}


            {/* DOB */}
            <div className="label-row">
              <label>
              Date of Birth
              </label>
            </div>
            

            <input
              type="text"
              name="dob"
              placeholder="DD/MM/YYYY"
              value={formData.dob}
              onChange={handleChange}
              className={
                errors.dob ? "input-error" : ""
              }
              inputMode="numeric"
            />


            {errors.dob && (
              <span className="error">
                {errors.dob}
              </span>
            )}


            {/* ADDRESS */}
           
            <div className="label-row">
              <label>Address</label>
                <span className="info">
                  ⓘ
                  <span className="tooltip">
                  Start with your house number and include additional address details.
                  </span>
                </span>
            </div>

            <textarea
              name="address"
              placeholder="689 ซอย... ถนน... แขวง... เขต..."
              value={formData.address}
              onChange={handleChange}
              className={
                errors.address ? "input-error" : ""
              }
            />

          

            {errors.address && (
              <span className="error">
                {errors.address}
              </span>
            )}


            <button type="submit">
              Save Information
            </button>

          </form>
        </>
      ) : (
        <>
          <h1>Saved Information</h1>

          <div className="result">

            <div className="result-item">
              <span className="result-label">Credit Card</span>
              <span className="result-value">{savedData.cardNumber}</span>
            </div>

            <div className="result-item">
              <span className="result-label">Email</span>
              <span className="result-value">{savedData.email}</span>
            </div>

            <div className="result-item">
              <span className="result-label">Phone Number</span>
              <span className="result-value">{savedData.phone}</span>
            </div>

            <div className="result-item">
              <span className="result-label">Date of Birth</span>
              <span className="result-value">{savedData.dob}</span>
            </div>

            <div className="result-item">
              <span className="result-label">Address</span>
              <span className="result-value">{savedData.address}</span>
            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default App;