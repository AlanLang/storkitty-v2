import { http } from "@/api/http";

export function deleteFile(dto: { path: string; name: string }) {
  return http.delete("file", {
    json: dto,
  });
}
