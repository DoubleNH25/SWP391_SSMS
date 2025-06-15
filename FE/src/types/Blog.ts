export interface BlogResponse {
  id: string;
  userId: string;
  userName: string;
  title: string;
  image?: string;
  content: string;
  excerpt?: string;
  view: number;
  createdTime: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  category?: string; // Frontend specific
}

export interface BlogRequest {
  title: string;
  imageFile?: File;
  imageUrl?: string;
  content: string;
  excerpt?: string;
  category?: string; // Frontend specific
}
