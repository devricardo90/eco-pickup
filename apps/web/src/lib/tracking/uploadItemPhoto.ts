const apiBaseUrl = process.env.ECOPICKUP_API_BASE_URL;

type UploadPhotoResult = { ok: true } | { ok: false; error: string };

export async function uploadItemPhoto(
  itemId: string,
  accessToken: string,
  file: File
): Promise<UploadPhotoResult> {
  if (!apiBaseUrl) {
    return {
      ok: false,
      error: "Upload is not configured. Set ECOPICKUP_API_BASE_URL."
    };
  }

  const body = new FormData();
  body.append("file", file, file.name);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/v1/pickup-items/${itemId}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body
    });
  } catch {
    return { ok: false, error: "Could not upload photo right now." };
  }

  if (response.status === 400) {
    try {
      const problem = await response.json() as { errors?: Record<string, string[]> };
      const first = problem.errors?.["file"]?.[0];
      if (first) {
        return { ok: false, error: first };
      }
    } catch {
      // ignore parse errors
    }
    return { ok: false, error: "Invalid file." };
  }

  if (response.status === 401) {
    return { ok: false, error: "Session expired. Please log in again." };
  }

  if (response.status === 404) {
    return { ok: false, error: "Item not found." };
  }

  if (!response.ok) {
    return { ok: false, error: "Upload failed. Please try again." };
  }

  return { ok: true };
}
