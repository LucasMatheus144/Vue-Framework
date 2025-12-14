import { http } from "./api";

export async function getPersonagens({ page = 0, limit = 10, name } = {}) {
  const query = { page, limit };

  const trimmed = typeof name === "string" ? name.trim() : "";
  if (trimmed) query.name = trimmed;

  const { data } = await http.get("/characters", { params: query });
  return data;
}
