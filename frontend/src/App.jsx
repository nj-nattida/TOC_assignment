import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [savedData, setSavedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: input,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const result = await response.json();

      setSavedData(result.masked_data);
    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to the server. Please make sure the backend is running."
      );

      setSavedData(null);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (error) {
      setError("");
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
                Enter each piece of information on a
                separate line.
              </span>
            </span>
          </div>

          <textarea
            id="customerInput"
            value={input}
            onChange={handleInputChange}
            className={error ? "input-error" : ""}
            placeholder={`1234-5678-9012-3456
            example@gmail.com
            091-759-5508
            DOB: 05/05/2549
            Address: 123 ซอยลาดพร้าว ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร`}
          />

          {error && (
            <span className="error">
              {error}
            </span>
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
              setError("");
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