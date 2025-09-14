// services/uploadImages.js
export const uploadImages = (formData, path, token) => {
  const url = `${import.meta.env.VITE_APP_API}/uploadImages`;

  return fetch(url, {
    method: "POST",
    // ⚠️ NO pongas "Content-Type": "multipart/form-data" cuando usas FormData:
    // el navegador añade el boundary automáticamente.
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData, // debe incluir 'path' y los 'file' que ya agregaste antes
  })
    .then(async (res) => {
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = payload?.message || res.statusText || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      // El backend responde con un array de objetos { url }
      return payload;
    })
    .then((data) => data) // segundo then como pediste
    .catch((err) => err.message); // string con el mensaje de error
};
