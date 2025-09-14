import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../functions/post";
import { uploadImages } from "../../functions/uploadImages";
import { updateprofilePicture } from "../../functions/user"; // mantiene el nombre que ya usas
import { getCroppedImg } from "../../helpers/getCroppedImg.jsx";
import PulseLoader from "react-spinners/PulseLoader";
import Cookies from "js-cookie";

export function UpdateProfilePicture({
  setImage,
  image,
  setError,
  setShow,
  pRef,
}) {
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const slider = useRef(null);
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const zoomIn = () => {
    slider.current.stepUp();
    setZoom(slider.current.value);
  };
  const zoomOut = () => {
    slider.current.stepDown();
    setZoom(slider.current.value);
  };

  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(image, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setImage(img);
          return;
        }
        return img; // blob URL
      } catch (err) {
        console.error(err);
        setError?.("No se pudo recortar la imagen.");
        return null;
      }
    },
    [croppedAreaPixels, image, setImage, setError]
  );

  const updateProfielPicture = () => {
    setLoading(true);

    getCroppedImage()
      .then((imgUrl) => {
        if (!imgUrl) throw new Error("No se pudo obtener el recorte.");
        return fetch(imgUrl).then((r) => r.blob());
      })
      .then((blob) => {
        const path = `${user.username}/profile_pictures`;
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("path", path);
        return uploadImages(formData, path, user.token);
      })
      .then((upload) => {
        if (typeof upload === "string") throw new Error(upload);
        const photoUrl = upload?.[0]?.url;
        if (!photoUrl) throw new Error("No se pudo subir la imagen.");
        return updateprofilePicture(photoUrl, user.token).then((upd) => ({
          upd,
          photoUrl,
          upload,
        }));
      })
      .then(({ upd, photoUrl, upload }) => {
        if (upd !== "ok") {
          throw new Error(
            typeof upd === "string"
              ? upd
              : "No se pudo actualizar la foto de perfil."
          );
        }
        const text = (description || "").trim();
        return createPost(
          "profilePicture",
          null,
          text,
          upload,
          user.id,
          user.token
        ).then((postResp) => ({ postResp, photoUrl }));
      })
      .then(({ postResp, photoUrl }) => {
        const postOk = postResp === "ok" || postResp?.ok === true;
        if (!postOk) {
          throw new Error(
            typeof postResp === "string"
              ? postResp
              : "No se pudo crear el post."
          );
        }

        // ✅ Éxito: actualiza UI/local
        if (pRef?.current) {
          pRef.current.style.backgroundImage = `url(${photoUrl})`;
        }
        Cookies.set("user", JSON.stringify({ ...user, picture: photoUrl }));
        dispatch({ type: "UPDATEPICTURE", payload: photoUrl });

        setImage("");
        setShow?.(false);

        // 🔄 Recarga la página (solo en éxito)
        setTimeout(() => {
          window.location.reload();
        }, 0);
        // Alternativa si usas react-router v6:
        // const navigate = useNavigate();  navigate(0);
      })
      .catch((e) => {
        setError?.(e?.message || "Error al actualizar la foto de perfil.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="postBox update_img">
      <div className="box_header">
        <div className="small_circle" onClick={() => setImage("")}>
          <i className="exit_icon"></i>
        </div>
        <span>Update profile picture</span>
      </div>

      <div className="update_image_desc">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea_blue details_input"
        />
      </div>

      <div className="update_center">
        <div className="crooper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            cropShape="round"
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
          />
        </div>
        <div className="slider">
          <div className="slider_circle hover1" onClick={zoomOut}>
            <i className="minus_icon"></i>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.2}
            ref={slider}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
          <div className="slider_circle hover1" onClick={zoomIn}>
            <i className="plus_icon"></i>
          </div>
        </div>
      </div>

      <div className="flex_up">
        <div className="gray_btn" onClick={() => getCroppedImage("show")}>
          <i className="crop_icon"></i>Crop photo
        </div>
        <div className="gray_btn">
          <i className="temp_icon"></i>Make Temporary
        </div>
      </div>

      <div className="flex_p_t">
        <i className="public_icon"></i>
        Your profile picture is public
      </div>

      <div className="update_submit_wrap">
        <div className="blue_link" onClick={() => setImage("")}>
          Cancel
        </div>
        <button
          className="blue_btn"
          disabled={loading}
          onClick={updateProfielPicture}
        >
          {loading ? <PulseLoader color="#fff" size={5} /> : "Save"}
        </button>
      </div>
    </div>
  );
}
