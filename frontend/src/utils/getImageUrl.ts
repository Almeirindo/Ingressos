// src/utils/getImageUrl.ts
export function getImageUrl(path?: string | null): string {
  if (!path) {
    return "/placeholder.png"; // podes criar uma imagem padrão em /public
  }

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${baseURL}${path}`;
}
