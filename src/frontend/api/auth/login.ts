import { http } from "@/api/http";
import z from "zod/v3";

export const loginSchema = z.object({
  username: z
    .string()
    .min(2, { message: "用户名至少2个字符" })
    .max(20, { message: "用户名不能超过20个字符" }),
  password: z.string().min(5, { message: "密码至少5个字符" }),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  storages: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      path: z.string(),
    }),
  ),
  user: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string(),
    username: z.string(),
  }),
});

export type LoginDto = z.infer<typeof loginSchema>;

export function login(loginData: LoginDto) {
  return http
    .post("login", {
      json: loginData,
    })
    .json<z.infer<typeof loginResponseSchema>>()
    .then((data) => loginResponseSchema.parse(data))
    .catch((error) => {
      throw error;
    });
}
