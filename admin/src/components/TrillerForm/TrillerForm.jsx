import { useEffect, useMemo, useState } from "react";
import { createTriller, fetchTrillers } from "../../services/trillerApi";
import "./TrillerForm.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    trillerId: "",
    nameUz: "",
    nameRu: "",
    descriptionUz: "",
    descriptionRu: "",
    img: "",
    trillerVideo: "",
    isActive: true,
    sortOrder: "1",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        trillerId: String(initialData.trillerId ?? initialData.id ?? ""),
        nameUz: initialData?.name?.uz || "",
        nameRu: initialData?.name?.ru || "",
        descriptionUz: initialData?.description?.uz || "",
        descriptionRu: initialData?.description?.ru || "",
        img: initialData?.img || "",
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
      form.trillerVideo.trim()
    );
  }, [form.nameUz, form.nameRu, form.trillerVideo]);

  const patch = (patchData) => setForm((prev) => ({ ...prev, ...patchData }));

  const imgPreview = toMediaUrl(form.img.trim());
  const videoPreview = toMediaUrl(form.trillerVideo.trim());

  const onSubmit = async () => {
    if (!canSave) {
      setError("Nomi (UZ/RU) va video URL majburiy.");
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
        img: form.img.trim(),
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

      <label className="triller-form__label" htmlFor="triller-img">
        Rasm URL
      </label>
      <input
        id="triller-img"
        className="triller-form__input"
        type="text"
        placeholder="/img/movie-4.5-1.avif yoki https://..."
        value={form.img}
        onChange={(e) => patch({ img: e.target.value })}
      />
      <div className="triller-form__preview-box">
        {imgPreview ? (
          <img
            className="triller-form__img-preview"
            src={imgPreview}
            alt="Triller rasm"
          />
        ) : (
          <span className="triller-form__preview-empty">
            Rasm URL kiriting — preview shu yerda chiqadi
          </span>
        )}
      </div>

      <label className="triller-form__label" htmlFor="triller-video">
        Video URL
      </label>
      <input
        id="triller-video"
        className="triller-form__input"
        type="text"
        placeholder="/video/trailer.mp4 yoki https://..."
        value={form.trillerVideo}
        onChange={(e) => patch({ trillerVideo: e.target.value })}
      />
      <div className="triller-form__preview-box">
        {videoPreview ? (
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
