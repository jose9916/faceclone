import { useEffect, useReducer, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { profileReducer } from "../../functions/reducers";
import { Header } from "../../components/header/index.jsx";
import "./style.css";
import { Cover } from "./Cover";
import { ProfilePictureInfos } from "./ProfilePictureInfos";
import { ProfileMenu } from "./ProfileMenu";
import { PplYouMayKnow } from "./PplYouMayKnow";
import { CreatePost } from "../../components/createPost";
import { GridPosts } from "./GridPosts";
import { Post } from "../../components/post";
import { Photos } from "./Photos";
import { Friends } from "./Friends";
import { Intro } from "../../components/intro";
import { useMediaQuery } from "react-responsive";
import { CreatePostPopup } from "../../components/createPostPopup/index.jsx";
export function Profile({ getAllPosts }) {
  const [visible, setVisible] = useState(false);

  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  const userName = username === undefined ? user.username : username;
  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: {},
    error: "",
  });

  const [photos, setPhotos] = useState({});

  useEffect(() => {
    getProfile();
  }, [userName]);
  useEffect(() => {
    setOtherName(profile?.details?.otherName);
  }, [profile]);

  const visitor = userName !== user.username;
  const [othername, setOtherName] = useState();

  const getProfile = () => {
    dispatch({ type: "PROFILE_REQUEST" });

    const url = `${import.meta.env.VITE_APP_API}/getProfile/${userName}`;
    const path = `${userName}/*`;
    const max = 30;
    const sort = "desc";

    // 1️⃣ Primero pedimos el perfil
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          const msg =
            payload?.message || res.statusText || `HTTP ${res.status}`;
          throw new Error(msg);
        }
        return payload;
      })
      .then((data) => {
        if (data.ok === false) {
          navigate("/profile");
          return;
        }

        // 2️⃣ Si el perfil existe, pedimos también las fotos
        const photosUrl = `${import.meta.env.VITE_APP_API}/listImages`;

        return fetch(photosUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ path, sort, max }),
        }).then(async (res) => {
          const payload = await res.json().catch(() => null);
          if (!res.ok) {
            const msg =
              payload?.message || res.statusText || `HTTP ${res.status}`;
            throw new Error(msg);
          }
          return { data, photos: payload }; // combinamos perfil + fotos
        });
      })
      .then((result) => {
        if (!result) return; // si ya navegó porque no encontró perfil
        dispatch({ type: "PROFILE_SUCCESS", payload: result.data });
        setPhotos(result.photos);
      })
      .catch((err) => {
        dispatch({
          type: "PROFILE_ERROR",
          payload: err.message,
        });
      });
  };

  const profileTop = useRef(null);
  const leftSide = useRef(null);
  const [height, setHeight] = useState();
  const [leftHeight, setLeftHeight] = useState();
  const [scrollHeight, setScrollHeight] = useState();
  useEffect(() => {
    setHeight(profileTop.current.clientHeight + 300);
    setLeftHeight(leftSide.current.clientHeight);
    window.addEventListener("scroll", getScroll, { passive: true });
    return () => {
      window.addEventListener("scroll", getScroll, { passive: true });
    };
  }, [loading, scrollHeight]);
  const check = useMediaQuery({
    query: "(min-width:901px)",
  });
  const getScroll = () => {
    setScrollHeight(window.pageYOffset);
  };

  return (
    <div className="profile">
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={profile?.posts}
          dispatch={dispatch}
          profile
        />
      )}
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="profile_top" ref={profileTop}>
        <div className="profile_container">
          <Cover
            cover={profile.cover}
            visitor={visitor}
            photos={photos.resources}
          />
          <ProfilePictureInfos
            profile={profile}
            visitor={visitor}
            photos={photos.resources}
            othername={othername}
          />
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PplYouMayKnow />
            <div
              className={`profile_grid ${
                check && scrollHeight >= height && leftHeight > 1000
                  ? "scrollFixed showLess"
                  : check &&
                    scrollHeight >= height &&
                    leftHeight < 1000 &&
                    "scrollFixed showMore"
              }`}
            >
              <div className="profile_left" ref={leftSide}>
                <Intro
                  detailss={profile.details}
                  visitor={visitor}
                  setOthername={setOtherName}
                />
                <Photos
                  username={userName}
                  token={user.token}
                  photos={photos}
                />
                <Friends friends={profile.friends} />
                <div className="relative_fb_copyright">
                  <Link to="/">Privacy </Link>
                  <span>. </span>
                  <Link to="/">Terms </Link>
                  <span>. </span>
                  <Link to="/">Advertising </Link>
                  <span>. </span>
                  <Link to="/">
                    Ad Choices <i className="ad_choices_icon"></i>{" "}
                  </Link>
                  <span>. </span>
                  <Link to="/"></Link>Cookies <span>. </span>
                  <Link to="/">More </Link>
                  <span>. </span> <br />
                  Meta © 2022
                </div>
              </div>
              <div className="profile_right">
                {!visitor && (
                  <CreatePost user={user} profile setVisible={setVisible} />
                )}
                <GridPosts />
                <div className="posts">
                  {profile.posts && profile.posts.length ? (
                    profile.posts.map((post) => (
                      <Post post={post} user={user} key={post._id} profile />
                    ))
                  ) : (
                    <div className="no_posts">No posts available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
