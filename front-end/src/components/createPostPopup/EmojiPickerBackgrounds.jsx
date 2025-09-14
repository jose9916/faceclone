import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { useMediaQuery } from "react-responsive";

export function EmojiPickerBackgrounds({
  text,
  user,
  setText,
  type2,
  background,
  setBackground,
}) {
  //comienzo
  const [picker, setPicker] = useState(false);
  const [showBgs, setShowBgs] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);
  const bgRef = useRef(null);
  const insertingRef = useRef(false);
  useEffect(() => {
    if (textRef.current) {
      textRef.current.selectionStart = cursorPosition;
      textRef.current.selectionEnd = cursorPosition;
      textRef.current.focus();
    }
  }, [cursorPosition]);
  // v4: onEmojiClick(emojiData, event)
  const handleEmoji = (emojiData, event) => {
    event?.stopPropagation?.();
    // evita ejecuciones múltiples del mismo click
    if (insertingRef.current) return;
    insertingRef.current = true;
    const emoji = emojiData.emoji;
    const ref = textRef.current;
    // hacemos la inserción de forma atómica con el "prev" actual
    setText((prev) => {
      if (!ref) {
        // sin ref, anexamos al final
        setCursorPosition(prev.length + emoji.length);
        return prev + emoji;
      }
      const start = ref.selectionStart ?? prev.length;
      const end = ref.selectionEnd ?? prev.length;
      const before = prev.slice(0, start);
      const after = prev.slice(end);
      const next = before + emoji + after;
      // movemos el cursor justo después del emoji
      setCursorPosition(start + emoji.length);
      return next;
    });
    // opcional: cierra el picker tras elegir
    setPicker(false);
    // libera el lock en el próximo tick
    // (evita que el mismo click vuelva a entrar)
    queueMicrotask
      ? queueMicrotask(() => (insertingRef.current = false))
      : setTimeout(() => (insertingRef.current = false), 0);
  };
  //final
  /*  const [picker, setPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);
  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  }; */
  const postBackgrounds = [
    "../../../images/postbackgrounds/1.jpg",
    "../../../images/postbackgrounds/2.jpg",
    "../../../images/postbackgrounds/3.jpg",
    "../../../images/postbackgrounds/4.jpg",
    "../../../images/postbackgrounds/5.jpg",
    "../../../images/postbackgrounds/6.jpg",
    "../../../images/postbackgrounds/7.jpg",
    "../../../images/postbackgrounds/8.jpg",
    "../../../images/postbackgrounds/9.jpg",
  ];
  const backgroundHanlder = (i) => {
    bgRef.current.style.backgroundImage = `url(${postBackgrounds[i]})`;
    setBackground(postBackgrounds[i]);
    bgRef.current.classList.add("bgHandler");
  };
  const removeBackground = (i) => {
    bgRef.current.style.backgroundImage = "";
    setBackground("");
    bgRef.current.classList.remove("bgHandler");
  };

  const sm = useMediaQuery({
    query: "(mac-width: 550px)",
  });
  return (
    <div className={type2 ? "images_input" : ""}>
      <div className={!type2 ? "flex_center" : ""} ref={bgRef}>
        <textarea
          ref={textRef}
          maxLength="250"
          value={text}
          placeholder={`What's on your mind, ${user.first_name}`}
          className={`post_input ${type2 ? "input2" : ""}${
            sm && !background && "10"
          }`}
          onChange={(e) => setText(e.target.value)}
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current.value.length * 0.1 - 32)
                : "0"
            }%`,
          }}
        ></textarea>
      </div>
      <div className={!type2 ? "post_emojis_wrap" : ""}>
        {picker && (
          <div
            className={`comment_emoji_picker ${
              type2 ? "movepicker2" : "rlmove"
            }`}
          >
            <Picker onEmojiClick={handleEmoji} />
          </div>
        )}
        {!type2 && (
          <img
            src="../../../icons/colorful.png"
            alt=""
            onClick={() => {
              setShowBgs((prev) => !prev);
            }}
          />
        )}
        {!type2 && showBgs && (
          <div className="post_backgrounds">
            <div
              className="no_bg"
              onClick={() => {
                removeBackground();
              }}
            ></div>
            {postBackgrounds.map((bg, i) => (
              <img
                src={bg}
                key={i}
                alt=""
                onClick={() => {
                  backgroundHanlder(i);
                }}
              />
            ))}
          </div>
        )}

        <i
          className={`emoji_icon_large ${type2 ? "moveleft" : ""}`}
          onClick={() => {
            setPicker((prev) => !prev);
          }}
        ></i>
      </div>
    </div>
  );
}
