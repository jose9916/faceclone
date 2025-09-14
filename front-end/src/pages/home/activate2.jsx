import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import ActivateForm from "./ActivateForm";
import "./style.css";
import axios from "axios";
import Cookies from "js-cookie";
export default function Activate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((user) => ({ ...user }));
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useParams();
  useEffect(() => {
    activateAccount();
  }, []);
  const activateAccount = async () => {
    setLoading(true);

    return fetch(`${import.meta.env.VITE_APP_API}/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }), // el backend solo necesita esto
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Activation failed");
        return data;
      })
      .then((data) => {
        setError("");
        setSuccess(data.message); // "Account has been activated successfully"

        // Si hay usuario en esta pestaña, márcalo como verificado
        if (user) {
          Cookies.set("user", JSON.stringify({ ...user, verified: true }));
          dispatch({ type: "VERIFY", payload: true });
        }

        setTimeout(() => {
          // Si quieres, puedes mandar a /login cuando no hay user:
          navigate(user ? "/" : "/login");
        }, 3000);
      })
      .catch((err) => {
        setSuccess("");
        setError(err.message || "Something went wrong.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="home">
      {success && (
        <ActivateForm
          type="success"
          header="Account verification succeded."
          text={success}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account verification failed."
          text={error}
          loading={loading}
        />
      )}
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  );
}
