import "./index.css";
import { Routes, Route } from "react-router-dom";
import "./styles/icons/icons.css";
import { Login } from "./pages/login/index.jsx";
import { Profile } from "./pages/profile/index.jsx";
import { Home } from "./pages/home/index.jsx";
import { LoggedInRoutes } from "./routes/LoggedInRoutes.jsx";
import { NotLoggedInRoutes } from "./routes/NotLoggedInRoutes.jsx";
import { Activate } from "./pages/home/activate.jsx";
import { Reset } from "./pages/reset/index.jsx";
import { useSelector } from "react-redux";
import { CreatePostPopup } from "./components/createPostPopup/index.jsx";
import { postsReducer } from "./functions/reducers";
import { useEffect, useReducer, useState } from "react";
import { Friends } from "./pages/friends/index.jsx";

function App() {
  const [visible, setVisible] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });
  useEffect(() => {
    getAllPosts();
  }, []);
  // dentro de App.jsx
  const getAllPosts = async () => {
    dispatch({ type: "POSTS_REQUEST" });

    const url = `${import.meta.env.VITE_APP_API}/getAllPosts`;

    return fetch(url, {
      method: "GET",
      headers: {
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
      },
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          const msg =
            payload?.message || res.statusText || `HTTP ${res.status}`;
          throw new Error(msg);
        }
        return payload; // array de posts
      })
      .then((data) => {
        dispatch({ type: "POSTS_SUCCESS", payload: data });
      })
      .catch((err) => {
        dispatch({ type: "POSTS_ERROR", payload: err.message });
      });
  };
  console.log(posts);
  return (
    <div>
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={posts}
          dispatch={dispatch}
        />
      )}
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/profile"
            element={
              <Profile setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />

          <Route
            path="/profile/:username"
            element={
              <Profile setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />

          <Route
            path="/friends"
            element={
              <Friends setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/friends/:type"
            element={
              <Friends setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
          <Route
            path="/"
            element={
              <Home
                setVisible={setVisible}
                posts={posts}
                loading={loading}
                getAllPosts={getAllPosts}
              />
            }
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
