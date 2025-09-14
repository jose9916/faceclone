import { useState } from "react";
import { Footer } from "../../components/login/Footer.jsx";
import { LoginForm } from "../../components/login/LoginForm.jsx";
import { RegisterForm } from "../../components/login/RegisterForm.jsx";
import "./style.css";

export function Login() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="login">
      <div className="login_wrapper">
        <LoginForm setVisible={setVisible} />
        {visible && <RegisterForm setVisible={setVisible} />}
        <Footer />
      </div>
    </div>
  );
}
