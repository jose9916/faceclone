// functions/user.js
export const updateprofilePicture = (url, token) => {
  const endpoint = `${import.meta.env.VITE_APP_API}/updateProfilePicture`;

  return fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ url }),
  })
    .then((res) =>
      // Empaquetamos ok + payload para un manejo de errores uniforme
      res
        .json()
        .catch(() => null)
        .then((payload) => ({ ok: res.ok, payload }))
    )
    .then(({ ok, payload }) => {
      if (!ok) {
        const msg = payload?.message || "Error actualizando la foto de perfil.";
        throw new Error(msg);
      }
      // Tu backend responde con el propio URL (no lo usamos, solo confirmamos que fue OK)
      return "ok";
    })
    .catch((err) => err.message);
};

// functions/user.js
export const updateCover = (url, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/updateCover`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = payload?.message || res.statusText || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      return payload;
    })
    .then((data) => {
      return data ? "ok" : "error";
    })
    .catch((err) => {
      return err.message;
    });
};

// functions/user.js

export const addFriend = (id, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/addFriend/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }
      return "ok";
    })
    .catch((err) => err.message);
};

export const cancelRequest = (id, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/cancelRequest/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }
      return "ok";
    })
    .catch((err) => err.message);
};

export const follow = (id, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/follow/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }
      return "ok";
    })
    .catch((err) => err.message);
};

export const unfollow = (id, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/unfollow/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }
      return "ok";
    })
    .catch((err) => err.message);
};

export const acceptRequest = (id, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/acceptRequest/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }
      return "ok";
    })
    .catch((err) => err.message);
};

export const unfriend = (id, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/unfriend/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }
      return "ok";
    })
    .catch((err) => err.message);
};

export const deleteRequest = (id, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/deleteRequest/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          payload?.message || res.statusText || `HTTP ${res.status}`
        );
      }
      return "ok";
    })
    .catch((err) => err.message);
};

export const search = (searchTerm, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/search/${searchTerm}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}), // el backend no usa body, pero fetch requiere algo si defines headers
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          ok: false,
          message: payload?.message || "Error en la búsqueda",
        };
      }

      // 🔹 Backend devuelve un array de usuarios
      return {
        ok: true,
        data: payload,
      };
    })
    .catch((err) => ({
      ok: false,
      message: err.message,
    }));
};

export const addToSearchHistory = (searchUser, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/addToSearchHistory`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ searchUser }),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          ok: false,
          message: payload?.message || "Error al agregar a historial",
        };
      }

      // 🔹 Backend no devuelve nada explícito (solo hace update en DB)
      // devolvemos un mensaje genérico de éxito
      return {
        ok: true,
        message: "Historial actualizado correctamente",
        data: payload,
      };
    })
    .catch((err) => ({
      ok: false,
      message: err.message,
    }));
};

export const getSearchHistory = (token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/getSearchHistory`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          ok: false,
          message: payload?.message || "Error obteniendo historial",
        };
      }

      // 🔹 El backend devuelve un array con el historial de búsqueda
      return {
        ok: true,
        data: payload,
      };
    })
    .catch((err) => ({
      ok: false,
      message: err.message,
    }));
};

export const removeFromSearch = (searchUser, token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/removeFromSearch`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ searchUser }),
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          ok: false,
          message: payload?.message || "Error al eliminar del historial",
        };
      }

      return {
        ok: true,
        message: "Usuario eliminado del historial correctamente",
        data: payload,
      };
    })
    .catch((err) => ({
      ok: false,
      message: err.message,
    }));
};

export const getFriendsPageInfos = (token) => {
  return fetch(`${import.meta.env.VITE_APP_API}/getFriendsPageInfos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          ok: false,
          message:
            payload?.message || "Error obteniendo la información de amigos",
        };
      }

      return {
        ok: true,
        data: {
          friends: payload.friends || [],
          requests: payload.requests || [],
          sentRequests: payload.sentRequests || [],
        },
      };
    })
    .catch((err) => ({
      ok: false,
      message: err.message,
    }));
};
