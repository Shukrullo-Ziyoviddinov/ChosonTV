import { useEffect, useMemo, useRef, useState } from "react";
import { createTriller, fetchTrillers } from "../../services/trillerApi";
import { getVideoEmbed } from "../../utils/videoEmbed";
import "./TrillerForm.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

function UploadIcon() {
  return (
    <svg className="triller-form__upload-icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19 20H5v-2h14v2zM11 16h2v-6h3l-4-4-4 4h3v6z"
      />
    </svg>
  );
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function toMediaUrl(path) {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
}

export default function TrillerForm({
  onCancel,
  onSaved,
  mode = "create",
  initialData = null,
  onSubmitData,
}) {
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    trillerId: "",
    nameUz: "",
    nameRu: "",
    descriptionUz: "",
    descriptionRu: "",
    img: "",
    imagePreview: "",
    trillerVideo: "",
    isActive: true,
    sortOrder: "1",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const img = initialData?.img || "";
      setForm({
        trillerId: String(initialData.trillerId ?? initialData.id ?? ""),
        nameUz: initialData?.name?.uz || "",
        nameRu: initialData?.name?.ru || "",
        descriptionUz: initialData?.description?.uz || "",
        descriptionRu: initialData?.description?.ru || "",
        img,
        imagePreview: img,
        trillerVideo: initialData?.trillerVideo || "",
        isActive: initialData?.isActive !== false,
        sortOrder: String(initialData?.sortOrder ?? 1),
      });
      return;
    }

    const loadNextId = async () => {
      try {
        const rows = await fetchTrillers();
        const maxId = rows.reduce(
          (max, item) => Math.max(max, Number(item.trillerId ?? item.id) || 0),
          0
        );
        const nextSort =
          rows.reduce((max, item) => Math.max(max, Number(item.sortOrder) || 0), 0) +
          1;
        setForm((prev) => ({
          ...prev,
          trillerId: String(maxId + 1),
          sortOrder: String(nextSort),
        }));
      } catch {
        /* ignore */
      }
    };
    loadNextId();
  }, [mode, initialData]);

  const canSave = useMemo(() => {
    return (
      form.nameUz.trim() &&
      form.nameRu.trim() &&
      form.img &&
      form.trillerVideo.trim()
    );
  }, [form.nameUz, form.nameRu, form.img, form.trillerVideo]);

  const patch = (patchData) => setForm((prev) => ({ ...prev, ...patchData }));

  const videoRaw = form.trillerVideo.trim();
  const embed = getVideoEmbed(videoRaw);
  const embedUrl = embed?.embedUrl || "";
  const videoPreview = embedUrl || toMediaUrl(videoRaw);
  const imagePreviewSrc = form.imagePreview
    ? toMediaUrl(form.imagePreview)
    : "";

  const onPickImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageData = await toDataUrl(file);
    patch({ img: imageData, imagePreview: imageData });
    if (event.target) event.target.value = "";
  };

  const onSubmit = async () => {
    if (!canSave) {
      setError("Nomi (UZ/RU), rasm va video URL majburiy.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = {
        trillerId: Number(form.trillerId) || undefined,
        name: {
          uz: form.nameUz.trim(),
          ru: form.nameRu.trim(),
        },
        description: {
          uz: form.descriptionUz.trim(),
          ru: form.descriptionRu.trim(),
        },
        img: form.img,
        trillerVideo: form.trillerVideo.trim(),
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 1,
      };
      if (mode === "edit" && onSubmitData) {
        await onSubmitData(payload);
      } else {
        await createTriller(payload);
      }
      onSaved?.();
    } catch (e) {
      setError(e.message || "Saqlashda xatolik.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="triller-form">
      <label className="triller-form__label" htmlFor="triller-id">
        Triller ID
      </label>
      <input
        id="triller-id"
        className="triller-form__input"
        type="number"
        min="1"
        value={form.trillerId}
        onChange={(e) => patch({ trillerId: e.target.value })}
      />

      <label className="triller-form__label" htmlFor="triller-name-uz">
        Nomi (UZ)
      </label>
      <input
        id="triller-name-uz"
        className="triller-form__input"
        type="text"
        placeholder="Soul — Rasmiy Triller"
        value={form.nameUz}
        onChange={(e) => patch({ nameUz: e.target.value })}
      />

      <label className="triller-form__label" htmlFor="triller-name-ru">
        Nomi (RU)
      </label>
      <input
        id="triller-name-ru"
        className="triller-form__input"
        type="text"
        placeholder="Душа — Официальный трейлер"
        value={form.nameRu}
        onChange={(e) => patch({ nameRu: e.target.value })}
      />

      <label className="triller-form__label" htmlFor="triller-desc-uz">
        Tavsif (UZ)
      </label>
      <textarea
        id="triller-desc-uz"
        className="triller-form__textarea"
        rows={3}
        value={form.descriptionUz}
        onChange={(e) => patch({ descriptionUz: e.target.value })}
      />

      <label className="triller-form__label" htmlFor="triller-desc-ru">
        Tavsif (RU)
      </label>
      <textarea
        id="triller-desc-ru"
        className="triller-form__textarea"
        rows={3}
        value={form.descriptionRu}
        onChange={(e) => patch({ descriptionRu: e.target.value })}
      />

      <label className="triller-form__label">Rasm</label>
      <button
        type="button"
        className="triller-form__upload"
        onClick={() => fileRef.current?.click()}
      >
        {imagePreviewSrc ? (
          <img
            className="triller-form__img-preview"
            src={imagePreviewSrc}
            alt="Triller rasm"
          />
        ) : (
          <div className="triller-form__upload-inner">
            <UploadIcon />
            <span>Rasm yuklash</span>
            <small>JPG, PNG, WEBP, AVIF</small>
          </div>
        )}
      </button>
      <input
        ref={fileRef}
        className="triller-form__file-input"
        type="file"
        accept="image/*"
        onChange={onPickImage}
      />

      <label className="triller-form__label" htmlFor="triller-video">
        Video URL (mp4, YouTube yoki Mover.uz)
      </label>
      <input
        id="triller-video"
        className="triller-form__input"
        type="text"
        placeholder="https://youtu.be/... | https://mover.uz/watch/... | /video/trailer.mp4"
        value={form.trillerVideo}
        onChange={(e) => patch({ trillerVideo: e.target.value })}
      />
      <div className="triller-form__preview-box">
        {embedUrl ? (
          <iframe
            key={embedUrl}
            className="triller-form__video-preview triller-form__video-preview--embed"
            src={embedUrl}
            title="Video preview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : videoPreview ? (
          <video
            key={videoPreview}
            className="triller-form__video-preview"
            src={videoPreview}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <span className="triller-form__preview-empty">
            Video URL kiriting — preview shu yerda chiqadi
          </span>
        )}
      </div>

      <label className="triller-form__switch">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => patch({ isActive: e.target.checked })}
        />
        <span>Faol</span>
      </label>

      <label className="triller-form__label" htmlFor="triller-sort">
        Tartib (sortOrder)
      </label>
      <input
        id="triller-sort"
        className="triller-form__input"
        type="number"
        min="1"
        value={form.sortOrder}
        onChange={(e) => patch({ sortOrder: e.target.value })}
      />

      {error ? <p className="triller-form__error">{error}</p> : null}

      <div className="triller-form__actions">
        <button type="button" className="triller-form__cancel-btn" onClick={onCancel}>
          Bekor qilish
        </button>
        <button
          type="button"
          className="triller-form__save-btn"
          onClick={onSubmit}
          disabled={saving}
        >
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>
    </div>
  );
}
