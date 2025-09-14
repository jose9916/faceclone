import { useEffect, useRef, useState } from "react";
import "./style.css";
import Picker from "emoji-picker-react";
import { EmojiPickerBackgrounds } from "./EmojiPickerBackgrounds";
import { AddToYourPost } from "./AddToYourPost";
import { ImagePreview } from "./ImagePreview";
import { useClickOutside } from "../../helpers/clickOutside";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import { PostError } from "./PostError";
import { dataURItoBlob } from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
export function CreatePostPopup({
  user,
  setVisible,
  posts,
  dispatch,
  profile,
}) {
  const popup = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");
  useClickOutside(popup, () => {
    setVisible(false);
  });
  const postSubmit = async () => {
    if (!background && !(images && images.length) && !text?.trim()) return;

    setLoading(true);
    setError("");

    try {
      let createRes;

      if (background) {
        createRes = await createPost(
          null,
          background,
          text,
          null,
          user.id,
          user.token
        );
      } else if (images && images.length) {
        const postImages = images.map((img) => dataURItoBlob(img));
        const path = `${user.username}/post_images`;

        const formData = new FormData();
        formData.append("path", path);
        postImages.forEach((image) => formData.append("file", image));

        const uploadRes = await uploadImages(formData, path, user.token);
        if (typeof uploadRes === "string") throw new Error(uploadRes);

        createRes = await createPost(
          null,
          null,
          text,
          uploadRes,
          user.id,
          user.token
        );
      } else {
        createRes = await createPost(
          null,
          null,
          text,
          null,
          user.id,
          user.token
        );
      }

      // 🔹 Validación: tu createPost devuelve { ok, message, data }
      if (!createRes.ok) {
        throw new Error(createRes?.message || "Error al crear el post");
      }

      // ✅ Éxito
      setBackground("");
      setText("");
      setImages([]);
      setVisible(false);

      // 🔹 Actualiza redux con el nuevo post
      dispatch({
        type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS", // si estás en feed
        payload: [createRes.data, ...posts],
      });

      // 👉 Si también usas profileReducer cuando estás en perfil:
      // dispatch({
      //   type: "PROFILE_SUCCESS",
      //   payload: { ...profile, posts: [createRes.data, ...profile.posts] },
      // });
    } catch (e) {
      setError(e?.message || "Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setVisible(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>

        {!showPrev ? (
          <>
            <EmojiPickerBackgrounds
              text={text}
              user={user}
              setText={setText}
              showPrev={showPrev}
              setBackground={setBackground}
              background={background}
            />
          </>
        ) : (
          <ImagePreview
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
            setError={setError}
          />
        )}
        <AddToYourPost setShowPrev={setShowPrev} />
        <button
          className="post_submit"
          onClick={() => {
            postSubmit();
          }}
          disabled={loading}
        >
          {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}
