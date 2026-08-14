"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedFile, type PixelCrop } from "@/lib/crop-image";

/**
 * Full-screen crop overlay. The user zooms/repositions inside a fixed-aspect
 * frame; on confirm we hand back a cropped JPEG File ready to upload.
 */
export default function ImageCropModal({
  src,
  fileName,
  aspect,
  cropShape = "rect",
  title,
  onCancel,
  onCropped,
}: {
  src: string;
  fileName: string;
  aspect: number;
  cropShape?: "rect" | "round";
  title?: string;
  onCancel: () => void;
  onCropped: (file: File) => void;
}) {
  const t = useTranslations("CropModal");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<PixelCrop | null>(null);
  const [saving, setSaving] = useState(false);

  const onComplete = useCallback((_area: unknown, areaPixels: PixelCrop) => {
    setPixels(areaPixels);
  }, []);

  const apply = async () => {
    if (!pixels) return;
    setSaving(true);
    try {
      onCropped(await getCroppedFile(src, pixels, fileName));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <button
          type="button"
          onClick={onCancel}
          className="font-ui text-sm text-white/80 hover:text-white"
        >
          {t("cancel")}
        </button>
        <span className="font-ui text-sm">{title ?? t("defaultTitle")}</span>
        <button
          type="button"
          onClick={apply}
          disabled={saving || !pixels}
          className="font-ui text-sm font-medium text-primary disabled:opacity-50"
        >
          {saving ? t("saving") : t("apply")}
        </button>
      </div>

      <div className="relative flex-grow">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={cropShape}
          showGrid={cropShape === "rect"}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onComplete}
        />
      </div>

      <div className="px-6 py-5 flex items-center gap-4">
        <span className="font-ui text-xs text-white/70">{t("zoom")}</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-grow accent-primary"
        />
      </div>
    </div>
  );
}
