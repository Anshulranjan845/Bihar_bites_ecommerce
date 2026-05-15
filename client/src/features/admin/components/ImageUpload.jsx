import { useState } from "react";

import { uploadImage } from "../services/uploadService";

export default function ImageUpload({ image, setImage }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const response = await uploadImage(file);

      setImage(response.imageUrl);

      setUploading(false);
    } catch (error) {
      console.log(error);

      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleUpload}
        className="w-full border p-3 rounded"
      />

      {uploading && <p>Uploading image...</p>}

      {image && (
        <img
          src={image}
          alt="preview"
          className="w-40 h-40 object-cover rounded-lg border"
        />
      )}
    </div>
  );
}
