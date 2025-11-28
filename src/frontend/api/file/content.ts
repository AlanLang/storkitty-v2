import { http } from "@/api/http";

export const getFileContent = async (path: string) => {
  return http.get(`file/${path}`).text();
};

export const saveFileContent = async (path: string, content: string) => {
  return http.put<void>(`file/${path}`, {
    json: {
      content,
    },
  });
};
