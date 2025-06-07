# Blog API Documentation

## Overview
Blog CRUD API với tích hợp Cloudinary để upload ảnh từ máy tính. API hỗ trợ đầy đủ các chức năng Create, Read, Update, Delete cho blog posts.

## Endpoints

### 1. Get All Blogs
```
GET /api/blogs
```
**Description:** Lấy danh sách tất cả blogs  
**Authorization:** Không cần  
**Response:** Array of BlogResponse objects

### 2. Get Blog by ID
```
GET /api/blogs/{id}
```
**Description:** Lấy thông tin chi tiết một blog  
**Authorization:** Không cần  
**Parameters:** 
- `id` (string): Blog ID

### 3. Create Blog
```
Frontend có thể gửi request như sau:

const formData = new FormData();
formData.append('Title', 'Blog Title');
formData.append('Content', '<p>HTML content from editor</p>');
formData.append('ImageFile', fileInput.files[0]);

fetch('/api/blogs', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token },
  body: formData
});

POST /api/blogs
Content-Type: multipart/form-data
```
**Description:** Tạo blog mới với khả năng upload ảnh  
**Authorization:** Required (Bearer token)  
**Request Body (Form Data):**
- `Title` (string, required): Tiêu đề blog
- `Content` (string, required): Nội dung HTML của blog
- `Excerpt` (string, optional): Tóm tắt blog
- `ImageFile` (file, optional): File ảnh upload từ máy tính
- `ImageUrl` (string, optional): URL ảnh (nếu không upload file)

### 4. Update Blog
```
PUT /api/blogs/{id}
Content-Type: multipart/form-data
```
**Description:** Cập nhật blog (chỉ tác giả mới có thể update)  
**Authorization:** Required (Bearer token)  
**Parameters:**
- `id` (string): Blog ID
**Request Body (Form Data):** Same as Create Blog

### 5. Delete Blog
```
DELETE /api/blogs/{id}
```
**Description:** Xóa blog (soft delete - chỉ tác giả mới có thể xóa)  
**Authorization:** Required (Bearer token)  
**Parameters:**
- `id` (string): Blog ID

### 6. Increment View Count
```
POST /api/blogs/{id}/view
```
**Description:** Tăng số lượt xem blog  
**Authorization:** Không cần  
**Parameters:**
- `id` (string): Blog ID

### 7. Get Blogs by User ID
```
GET /api/blogs/user/{userId}
```
**Description:** Lấy danh sách blogs của một user cụ thể  
**Authorization:** Không cần  
**Parameters:**
- `userId` (string): User ID

### 8. Get My Blogs
```
GET /api/blogs/my-blogs
```
**Description:** Lấy danh sách blogs của user hiện tại  
**Authorization:** Required (Bearer token)

### 9. Upload Image
```
POST /api/blogs/upload-image
Content-Type: multipart/form-data
```
**Description:** Upload ảnh riêng lẻ (có thể dùng cho editor)  
**Authorization:** Required (Bearer token)  
**Request Body (Form Data):**
- `image` (file, required): File ảnh

**Response:**
```json
{
  "imageUrl": "https://res.cloudinary.com/..."
}
```

## Data Models

### BlogResponse
```json
{
  "id": "string",
  "userId": "string",
  "userName": "string",
  "title": "string",
  "image": "string|null",
  "content": "string",
  "excerpt": "string|null",
  "view": "number",
  "createdTime": "datetime",
  "createdBy": "string|null",
  "updatedTime": "datetime",
  "updatedBy": "string|null"
}
```

## Usage Examples

### Frontend JavaScript Example
```javascript
// Create blog with image
const formData = new FormData();
formData.append('Title', 'My Blog Title');
formData.append('Content', '<p>HTML content here</p>');
formData.append('Excerpt', 'Short description');
formData.append('ImageFile', fileInput.files[0]); // File from input

fetch('/api/blogs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});

// Upload image separately
const imageFormData = new FormData();
imageFormData.append('image', imageFile);

fetch('/api/blogs/upload-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: imageFormData
})
.then(response => response.json())
.then(data => {
  console.log('Image URL:', data.imageUrl);
});
```

## Features
- ✅ Full CRUD operations
- ✅ Image upload via Cloudinary
- ✅ HTML content support
- ✅ View count tracking
- ✅ User-based blog filtering
- ✅ Soft delete
- ✅ Authorization & ownership validation
- ✅ Multipart form data support

## Notes
- Ảnh được upload lên Cloudinary và tự động resize (500x500px)
- Chỉ tác giả blog mới có thể update/delete blog của mình
- Content field hỗ trợ HTML từ frontend
- API sử dụng JWT authentication
- Soft delete: blogs bị xóa không hiển thị nhưng vẫn lưu trong database
