import { useState } from "react";
import "./style.css";

export function SendVerification({ user }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendVerificationLink = () => {
    return fetch(`${import.meta.env.VITE_APP_API}/sendVerification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({}), // en tu caso el body es vacío
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to send verification link");
        }
        return data;
      })
      .then((data) => {
        setError("");
        setSuccess(data.message); // "Email verification link has been sent to your email."
      })
      .catch((err) => {
        setSuccess("");
        setError(err.message || "Something went wrong.");
      });
  };

  return (
    <div className="send_verification">
      <span>
        Your account is not verified, verify your account before it gets deleted
        after a month from creating.
      </span>
      <a
        onClick={() => {
          sendVerificationLink();
        }}
      >
        click here to resend verification link
      </a>
      {success && <div className="success_text">{success}</div>}
      {error && <div className="error_text">{error}</div>}
    </div>
  );
}
