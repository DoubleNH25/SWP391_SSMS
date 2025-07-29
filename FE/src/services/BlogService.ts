import ApiClient from "@/utils/ApiBase";
import { BlogRequest, BlogResponse } from "@/types/Blog";

export async function FetchAllBlogs(): Promise<BlogResponse[]> {
  const response = await ApiClient<BlogResponse[]>({
    method: "GET",
    endpoint: "/blogs",
  });
  return response.data;
}

export async function FetchBlogById(blogId: string): Promise<BlogResponse> {
  const response = await ApiClient<BlogResponse>({
    method: "GET",
    endpoint: `/blogs/${blogId}`,
  });
  return response.data;
}

export async function CreateBlog(blog: BlogRequest): Promise<BlogResponse> {
  const formData = new FormData();
  formData.append("title", blog.title);
  formData.append("content", blog.content);
  if (blog.excerpt) formData.append("excerpt", blog.excerpt);
  if (blog.imageFile) formData.append("imageFile", blog.imageFile);
  if (blog.imageUrl) formData.append("imageUrl", blog.imageUrl);

  const response = await ApiClient<BlogResponse>({
    method: "POST",
    endpoint: "/blogs",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    requiresToken: true,
  });
  return response.data;
}

export async function UpdateBlog(id: string, blog: BlogRequest): Promise<void> {
  const formData = new FormData();
  formData.append("title", blog.title);
  formData.append("content", blog.content);
  if (blog.excerpt) formData.append("excerpt", blog.excerpt);
  if (blog.imageFile) formData.append("imageFile", blog.imageFile);
  if (blog.imageUrl) formData.append("imageUrl", blog.imageUrl);

  await ApiClient<void>({
    method: "PUT",
    endpoint: `/blogs/${id}`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    requiresToken: true,
  });
}

export async function DeleteBlog(id: string): Promise<void> {
  await ApiClient<void>({
    method: "DELETE",
    endpoint: `/blogs/${id}`,
    requiresToken: true,
  });
}

export async function IncrementBlogView(id: string): Promise<void> {
  await ApiClient<void>({
    method: "POST",
    endpoint: `/blogs/${id}/view`,
  });
}

export async function FetchMyBlogs(): Promise<BlogResponse[]> {
  const response = await ApiClient<BlogResponse[]>({
    method: "GET",
    endpoint: "/blogs/my-blogs",
    requiresToken: true,
  });
  return response.data;
}

export async function UploadBlogImage(
  file: File
): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await ApiClient<{ imageUrl: string }>({
    method: "POST",
    endpoint: "/blogs/upload-image",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    requiresToken: true,
  });
  return response.data;
}
