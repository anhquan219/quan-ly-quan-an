import { z } from "zod";

const configSchema = z.object({
  NEXT_PUNLIC_API_END_POINT: z.string(),
  NEXT_PUNLIC_URL: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUNLIC_API_END_POINT: process.env.NEXT_PUNLIC_API_END_POINT,
  NEXT_PUNLIC_URL: process.env.NEXT_PUNLIC_URL,
});

if (!configProject.success) {
  console.error(configProject.error.errors);
  throw new Error("ENV không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
