import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState({});
  const [savedData, setSavedData] = useState(null);

  const parseInput = (value) => {
    const parts = value.split(",");

    if (parts.length < 5) {
      return null;
    }

    const cardNumber = parts[0].trim();
    const email = parts[1].trim();
    const phone = parts[2].trim();
    const dob = parts[3].trim();

    const address = parts
      .slice(4)
      .join(",")
      .replace(/^Address:\s*/, "")
      .trim();

    return {
      cardNumber,
      email,
      phone,
      dob,
      address,
    };
  };

  const validateData = (data) => {
    const newErrors = {};

    /*
     * =========================
     * Credit Card
     * =========================
     */

    const cardDigits = data.cardNumber.replace(/\D/g, "");

    if (!cardDigits) {
      newErrors.cardNumber =
        "Missing card number. It must contain 16 digits.";
    } else if (cardDigits.length !== 16) {
      newErrors.cardNumber =
        "Card number must contain 16 digits.";
    } else if (
      !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(
        data.cardNumber
      )
    ) {
      newErrors.cardNumber =
        "Invalid card number format. Example: 1234-5678-9012-3456";
    }

    /*
     * =========================
     * Email
     * =========================
     */

    if (!data.email) {
      newErrors.email = "Missing email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      newErrors.email =
        "Invalid email format. Example: example@gmail.com";
    }

    /*
     * =========================
     * Phone
     * =========================
     */

    const phoneDigits = data.phone.replace(/\D/g, "");

    if (!phoneDigits) {
      newErrors.phone =
        "Missing phone number. It must contain 10 digits.";
    } else if (phoneDigits.length !== 10) {
      newErrors.phone =
        "Phone number must contain 10 digits.";
    } else if (
      !/^\d{3}-\d{3}-\d{4}$/.test(data.phone)
    ) {
      newErrors.phone =
        "Invalid phone number format. Example: 091-759-5508";
    }

    /*
     * =========================
     * Date of Birth
     * =========================
     */

    if (!data.dob) {
      newErrors.dob =
        "Missing date of birth. Example:05/05/2549";
    } else if (
      !/^\s*\d{2}\/\d{2}\/\d{4}$/.test(data.dob)
    ) {
      newErrors.dob =
        "Invalid date of birth format. Example:05/05/2549";
    } else {
      const datePart = data.dob
        .replace(/^DOB:\s*/, "")
        .trim();

      const [day, month, year] = datePart
        .split("/")
        .map(Number);

      const currentYear =
        new Date().getFullYear() + 543;

      if (
        month < 1 ||
        month > 12 ||
        year < 2400 ||
        year > currentYear
      ) {
        newErrors.dob =
          "Invalid date of birth. Example: DOB: 05/05/2549";
      } else {
        const daysInMonth = new Date(
          year - 543,
          month,
          0
        ).getDate();

        if (day < 1 || day > daysInMonth) {
          newErrors.dob =
            "Invalid date of birth. Example: DOB: 05/05/2549";
        }
      }
    }

    /*
     * =========================
     * Address
     * =========================
     *
     * Required:
     * Address:
     * 1. House number
     * 2. Soi (optional)
     * 3. Road
     * 4. Subdistrict
     * 5. District
     * 6. Province
     */

    if (!data.address) {
      newErrors.address =
        "Missing address. Example: Address: 123 ซอยลาดพร้าว ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร";
    } 
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedData = parseInput(input);

    if (!parsedData) {
      setErrors({
        input:
          "Information is incomplete. Please provide Card Number, Email, Phone Number, DOB, and Address.",
      });
      return;
    }

    const newErrors = validateData(parsedData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer information.");
      }

      const responseData = await response.json();
      setSavedData(responseData.masked_data);
      setErrors({});
    } catch (error) {
      console.error(error);
      alert("Unable to save customer information.");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  return (
    <div className="container">
      <h1>Customer Information</h1>

      {!savedData ? (
        <form onSubmit={handleSubmit}>
          <div className="label-row">
            <label htmlFor="customerInput">
              Customer Information
            </label>

            <span className="info">
              ⓘ
              <span className="tooltip">
                Enter information in this order:
                Card Number, Email, Phone Number,
                DOB, and Address. Separate each
                section with a comma.
              </span>
            </span>
          </div>

          <textarea
            id="customerInput"
            value={input}
            onChange={handleInputChange}
            className={
              errors.input ||
              errors.cardNumber ||
              errors.email ||
              errors.phone ||
              errors.dob ||
              errors.address
                ? "input-error"
                : ""
            }
            placeholder="1234-5678-9012-3456, example@gmail.com, 091-759-5508, DOB: 05/05/2549, Address: 123 ซอยลาดพร้าว ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร"
          />

          {errors.input && (
            <span className="error">
              {errors.input}
            </span>
          )}

          {!errors.input &&
            Object.keys(errors).length > 0 && (
              <div className="validation-summary">
                <div className="summary-title">
                  Please check your information:
                </div>

                {errors.cardNumber && (
                  <div>• {errors.cardNumber}</div>
                )}

                {errors.email && (
                  <div>• {errors.email}</div>
                )}

                {errors.phone && (
                  <div>• {errors.phone}</div>
                )}

                {errors.dob && (
                  <div>• {errors.dob}</div>
                )}

                {errors.address && (
                  <div>• {errors.address}</div>
                )}
              </div>
            )}

          <button type="submit">
            Save
          </button>
        </form>
      ) : (
        <>
          <div className="saved-header">
            <h2>Saved Information</h2>
            <p>
              Customer information has been saved
              successfully.
            </p>
          </div>

          <div className="result">
            <div className="result-item">
              <span className="result-label">
                Credit Card
              </span>
              <span className="result-value">
                {savedData.cardNumber}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">
                Email
              </span>
              <span className="result-value">
                {savedData.email}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">
                Phone Number
              </span>
              <span className="result-value">
                {savedData.phone}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">
                Date of Birth
              </span>
              <span className="result-value">
                {savedData.dob}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">
                Address
              </span>
              <span className="result-value">
                {savedData.address}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="edit-button"
            onClick={() => {
              setSavedData(null);
              setErrors({});
            }}
          >
            Edit Information
          </button>
        </>
      )}
    </div>
  );
}

export default App;