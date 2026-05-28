"use client";

import { useActionState, useEffect, useRef } from "react";
import { ui } from "@/components/ui-primitives";
import type { UploadPhotoActionState } from "@/lib/auth/types";

type ItemPhotoUploadFormProps = {
  category: string;
  photoCount: number;
  action: (prev: UploadPhotoActionState, formData: FormData) => Promise<UploadPhotoActionState>;
};

const MAX_PHOTOS = 5;
const initialState: UploadPhotoActionState = {};

export function ItemPhotoUploadForm({ category, photoCount, action }: ItemPhotoUploadFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const atLimit = photoCount >= MAX_PHOTOS;

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <div className={ui.mutedSurface}>
      <div className="flex items-center justify-between gap-4">
        <p className={ui.label}>{category}</p>
        <span className="text-xs text-slate-500">
          {photoCount}/{MAX_PHOTOS} photos
        </span>
      </div>

      {atLimit ? (
        <p className="mt-3 text-xs text-slate-500">
          Maximum of {MAX_PHOTOS} photos reached for this item.
        </p>
      ) : (
        <form ref={formRef} action={formAction} className="mt-3 flex flex-col gap-2">
          <input
            accept="image/jpeg,image/png,image/webp"
            className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-800 file:mr-3 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-900 file:transition file:hover:bg-emerald-100"
            disabled={isPending}
            name="file"
            type="file"
          />
          <p className="text-xs text-slate-500">JPEG, PNG or WebP · max 10 MB</p>

          {state.error ? (
            <p className={ui.noticeError}>{state.error}</p>
          ) : null}

          {state.ok ? (
            <p className={ui.noticeSuccess}>Photo uploaded successfully.</p>
          ) : null}

          <button
            className={ui.softButton}
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Uploading..." : "Upload photo"}
          </button>
        </form>
      )}
    </div>
  );
}
