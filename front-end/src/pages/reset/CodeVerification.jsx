import { Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginInput } from "../../components/inputs/logininput/index.jsx";
import * as Yup from "yup";

export function CodeVerification({
  code,
  setCode,
  error,
  loading,
  setLoading,
  setVisible,
  setError,
  userInfos,
}) {
  const validateCode = Yup.object({
    code: Yup.string()
      .required("Code is required")
      .min("5", "Code must be 5 characters.")
      .max("5", "Code must be 5 characters."),
  });
  const { email } = userInfos;

  const verifyCode = () => {
    setLoading(true);

    return fetch(`${import.meta.env.VITE_APP_API}/validateResetCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "Verification failed");
        }
        return data; // { message: "ok" }
      })
      .then(() => {
        setError("");
        setVisible(3);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /*  const verifyCode = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/validateResetCode`,
        { email, code }
      );
      setVisible(3);
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  }; */
  console.log(email);
  return (
    <div className="reset_form">
      <div className="reset_form_header">Code verification</div>
      <div className="reset_form_text">
        Please enter code that been sent to your email.
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          code,
        }}
        validationSchema={validateCode}
        onSubmit={() => {
          verifyCode();
        }}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="text"
              name="code"
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code"
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Cancel
              </Link>
              <button type="submit" className="blue_btn">
                Continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
