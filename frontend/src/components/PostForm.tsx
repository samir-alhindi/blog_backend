"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { PostDetail } from "@/lib/types";
import Markdown from "@/components/Markdown";
import ImageCropModal from "@/components/ImageCropModal";

export default function PostForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: PostDetail;
}) {
  const t = useTranslations("Editor");
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initial?.image ?? null
  );
  const [rawImage, setRawImage] = useState<{ src: string; name: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const onPickImage = (file: File | null) => {
    if (!file) return;
    setRawImage({ src: URL.createObjectURL(file), name: file.name });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("body", body);
      if (image) form.append("image", image);

      const url =
        mode === "create"
          ? `${API_BASE_URL}/posts/`
          : `${API_BASE_URL}/posts/${initial!.slug}/`;

      const saved = await apiFetch<PostDetail>(url, {
        method: mode === "create" ? "POST" : "PATCH",
        body: form,
      });

      router.push(`/posts/${saved.slug}`);
    } catch (err) {
      if (err instanceof ApiError && err.body && typeof err.body === "object") {
        setError(Object.values(err.body as Record<string, string[]>).flat().join(" "));
      } else {
        setError(t("error"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg pb-32">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block font-ui text-sm mb-2 text-on-surface-variant">
            {t("coverImage")} {mode === "edit" && t("coverImageKeep")}
          </label>
          <label className="block cursor-pointer group">
            {imagePreview ? (
              <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="font-ui text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {image ? t("changeCover") : t("replaceCover")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="aspect-[21/9] rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:border-primary transition-colors">
                <span className="text-2xl">＋</span>
                <span className="font-ui text-sm">{t("addCover")}</span>
                <span className="font-ui text-xs">{t("cropHint")}</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onPickImage(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("titlePlaceholder")}
          required
          className="w-full bg-transparent font-display text-3xl md:text-4xl font-bold placeholder:text-outline border-none focus:outline-none focus:ring-0 pb-4 border-b border-outline-variant"
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-ui text-xs text-on-surface-variant">
              {t("markdownHint")}
            </span>
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="font-ui text-xs text-primary hover:opacity-80"
            >
              {preview ? t("write") : t("preview")}
            </button>
          </div>
          {preview ? (
            <div className="min-h-[40vh] border-b border-outline-variant pb-4">
              {body.trim() ? (
                <Markdown>{body}</Markdown>
              ) : (
                <p className="font-ui text-sm text-on-surface-variant">
                  {t("nothingToPreview")}
                </p>
              )}
            </div>
          ) : (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("bodyPlaceholder")}
              required
              rows={16}
              className="w-full bg-transparent font-article text-lg text-on-background outline-none resize-y min-h-[40vh]"
            />
          )}
        </div>

        {error && <p className="font-ui text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-ui text-on-surface-variant px-4 py-2"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-on-primary font-ui px-6 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting
              ? t("saving")
              : mode === "create"
              ? t("publish")
              : t("saveChanges")}
          </button>
        </div>
      </form>

      {rawImage && (
        <ImageCropModal
          src={rawImage.src}
          fileName={rawImage.name}
          aspect={21 / 9}
          title={t("cropCover")}
          onCancel={() => setRawImage(null)}
          onCropped={(file) => {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setRawImage(null);
          }}
        />
      )}
    </div>
  );
}
