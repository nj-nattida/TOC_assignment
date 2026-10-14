import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [savedData, setSavedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", input);
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
      console.log("Response:", result);
      setSavedData(result);
    } catch (error) {
      console.error(error);
    //   setSavedData(result);
    //  } catch (error) {
    //    console.error(error);
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
                              {savedData.cardNumber?.map((cardNumber, index) => (
                  <div key={index}>
                    <span className="result-value">{cardNumber}</span>
                  </div>
                ))}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">
                Email
              </span>
              <span className="result-value">
                {savedData.email?.map((email, index) => (
                  <div key={index}>
                    <span className="result-value">{email}</span>
                  </div>
                ))}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">
                Phone Number
              </span>
              <span className="result-value">
                {savedData.phone?.map((phone, index) => (
                  <div key={index}>
                    <span className="result-value">{phone}</span>
                  </div>
                ))}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">
                Date of Birth
              </span>
              <span className="result-value">
                {savedData.dob?.map((dob, index) => (
                  <div key={index}>
                    <span className="result-value">{dob}</span>
                  </div>
                ))}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">
                Address
              </span>
              <span className="result-value">
                                {savedData.address?.map((address, index) => (
                  <div key={index}>
                    <span className="result-value">{address}</span>
                  </div>
                ))}
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
      <a
  href="https://github.com/nj-nattida/TOC_assignment.git"
  target="_blank"
  rel="noopener noreferrer"
  className="github-link"
  aria-label="View source code on GitHub"
>
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 24 12C24 5.37 18.63 0 12 0z" />
  </svg>

  <span>Source Code</span>
</a>
    </div>
  );
}

export default App;