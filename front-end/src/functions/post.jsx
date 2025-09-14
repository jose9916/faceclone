export const createPost = (type, background, text, images, userId, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/createPost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      background,
      text,
      images,
      user: userId, // 👈 mandamos el userId
    }),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          ok: false,
          message: payload?.message || "Error creando el post",
        };
      }

      return {
        ok: true,
        message: "Post creado correctamente",
        data: payload, // 🔥 aquí ya llega con user populado desde el backend
      };
    })
    .catch((err) => ({
      ok: false,
      message: err.message,
    }));
};

// ✅ reactPost corregido
export const reactPost = (postId, react, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/reactPost`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, react }),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }

      // 🔥 Aquí ya devolvemos lo que manda el backend (added, removed, updated)
      return payload;
    })
    .catch((err) => ({ error: true, message: err.message }));
};

export const getReacts = (postId, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/getReacts/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        // si la respuesta no fue 200-299
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }
      return payload;
    })
    .catch((err) => {
      return err.message;
    });
};

export const comment = (postId, comment, image, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/comment`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, comment, image }),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }

      // 🔥 Backend devuelve newComments.comments
      return payload;
    })
    .then((data) => data) // aquí ya tienes los comentarios actualizados
    .catch((err) => ({ error: true, message: err.message }));
};

export const savePost = (postId, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/savePost/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}), // backend no necesita body, pero fetch requiere algo si envías headers
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          ok: false,
          message: payload?.message || "Error al guardar el post",
        };
      }

      return {
        ok: true,
        message: payload?.message || "Post guardado correctamente",
        data: payload,
      };
    })
    .catch((err) => ({
      ok: false,
      message: err.message,
    }));
};

export const deletePost = (postId, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/deletePost/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        return {
          status: "error",
          message: payload?.message || "Error eliminando el post",
        };
      }
      return payload; // {status:"ok"}
    })
    .catch((err) => ({
      status: "error",
      message: err.message,
    }));
};
