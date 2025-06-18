import { RoleViewModel } from "@/types/Role";
import ApiClient from "@/utils/ApiBase";

export async function FecthRoles(): Promise<RoleViewModel[]> {
  try {
    const response = await ApiClient<RoleViewModel[]>({
      method: 'GET',
      endpoint: '/roles',
    });
    return response?.data || [];
  } catch (err) {
    console.error("Failed to get roles:", err);
    return [];
  }
}