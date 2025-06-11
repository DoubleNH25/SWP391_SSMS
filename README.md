# 📘 School Medical Management System API Documentation

This project is a **School Medical Management System** designed for managing student health records, medical events, and communication between school nurses and parents.

---

## 🌐 Swagger UI
API documentation is available at:
https://localhost:7172/swagger/index.html

Most endpoints require JWT authentication via the `Authorization` header.

---

## 1. Authentication APIs

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/auth/parent/send-otp` | Gửi OTP đến số điện thoại phụ huynh | Public |
| POST | `/api/auth/parent/verify-otp` | Xác minh OTP để đăng nhập | Public |
| POST | `/api/auth/login` | Đăng nhập bằng email và mật khẩu | Public |

---

## 2. User & Role Management

### Users
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/users` | Lấy tất cả người dùng | Admin |
| GET | `/api/users/{id}` | Lấy người dùng theo ID | Admin |
| POST | `/api/users` | Tạo người dùng mới | Admin |
| PUT | `/api/users/{id}` | Cập nhật người dùng | Admin |
| DELETE | `/api/users/{id}` | Xóa người dùng | Admin |
| GET | `/api/users/profile` | Lấy hồ sơ người dùng hiện tại | Authenticated |
| PUT | `/api/users/profile` | Cập nhật hồ sơ người dùng hiện tại | Authenticated |
| POST | `/api/users/import-students` | Nhập học sinh từ Excel | Admin, Manager |
| GET | `/api/users/students` | Lấy tất cả học sinh | Admin, Manager, Nurse |
| GET | `/api/users/students/{studentId}` | Lấy học sinh theo ID | Admin, Manager, Nurse |
| POST | `/api/users/students` | Tạo học sinh bởi admin | Admin |
| PUT | `/api/users/students/{studentId}` | Cập nhật học sinh | Parent, Admin |
| DELETE | `/api/users/students/{studentId}` | Xóa học sinh | Admin, Manager |
| GET | `/api/users/parents/get-all-parent` | Lấy tất cả phụ huynh | Admin, Manager, Nurse |

### Roles
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/roles` | Lấy tất cả role | Admin |
| GET | `/api/roles/{id}` | Lấy role theo ID | Admin |
| POST | `/api/roles` | Tạo role mới | Admin |
| PUT | `/api/roles/{id}` | Cập nhật role | Admin |
| DELETE | `/api/roles/{id}` | Xóa role | Admin |

---

## 3. School Classes

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/school-classes` | Lấy tất cả lớp học | Admin, Manager, Nurse |
| GET | `/api/school-classes/{id}` | Lấy lớp học theo ID | Admin, Manager, Nurse |
| POST | `/api/school-classes` | Tạo lớp học | Admin, Manager |
| PUT | `/api/school-classes/{id}` | Cập nhật lớp học | Admin, Manager |
| DELETE | `/api/school-classes/{id}` | Xóa lớp học | Admin, Manager |

---

## 4. Medical Events

### Health Activities
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/medical-events/health-activities/all` | Lấy tất cả hoạt động sức khỏe | Admin, Manager, Nurse |
| GET | `/api/medical-events/health-activities/approve-reject` | Lấy hoạt động đã duyệt/từ chối | Admin, Manager, Nurse |
| GET | `/api/medical-events/health-activities/pending` | Lấy hoạt động chờ duyệt | Admin, Manager, Nurse |
| POST | `/api/medical-events/health-activities` | Tạo hoạt động sức khỏe | Nurse |
| PUT | `/api/medical-events/health-activities/{id}/approve-or-reject` | Duyệt/từ chối hoạt động | Admin, Manager |
| PUT | `/api/medical-events/health-activities/{id}` | Cập nhật hoạt động | Nurse, Admin, Manager |
| DELETE | `/api/medical-events/health-activities/{id}` | Xóa hoạt động | Nurse, Admin, Manager |

### Vaccination Campaigns
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/medical-events/vaccination-campaigns/all` | Lấy tất cả chiến dịch tiêm chủng | Admin, Manager, Nurse |
| GET | `/api/medical-events/vaccination-campaigns/pending` | Lấy chiến dịch chờ duyệt | Admin, Manager, Nurse |
| GET | `/api/medical-events/vaccination-campaigns/approve-reject` | Lấy chiến dịch đã duyệt/từ chối | Admin, Manager, Nurse, Parent |
| POST | `/api/medical-events/vaccination-campaigns` | Tạo chiến dịch tiêm chủng | Nurse |
| PUT | `/api/medical-events/vaccination-campaigns/{id}/approve-or-reject` | Duyệt/từ chối chiến dịch | Admin, Manager |
| PUT | `/api/medical-events/vaccination-campaigns/{id}` | Cập nhật chiến dịch | Nurse, Admin, Manager |
| DELETE | `/api/medical-events/vaccination-campaigns/{id}` | Xóa chiến dịch | Nurse, Admin, Manager |

### Activity Consents
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/medical-events/activity-consents/health-activities/{healthActivityId}` | Lấy đồng thuận hoạt động sức khỏe | Admin, Manager, Nurse |
| GET | `/api/medical-events/activity-consents/vaccination-campaigns/{vaccinationCampaignId}` | Lấy đồng thuận tiêm chủng | Admin, Manager, Nurse |

---

## 5. Medical Management

### Medical Stock, Incident, Usage
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/medical/stock` | Tạo kho y tế | Admin, Manager, Nurse |
| DELETE | `/api/medical/stock/{id}` | Xóa kho y tế | Admin, Manager, Nurse |
| GET | `/api/medical/stock/{id}` | Lấy kho y tế theo ID | Admin, Manager, Nurse |
| GET | `/api/medical/stock` | Lấy tất cả kho y tế | Admin, Manager, Nurse |
| PUT | `/api/medical/stock/{id}` | Cập nhật kho y tế | Admin, Manager, Nurse |
| POST | `/api/medical/incident` | Tạo sự cố y tế | Admin, Manager, Nurse |
| DELETE | `/api/medical/incident/{id}` | Xóa sự cố y tế | Admin, Manager, Nurse |
| GET | `/api/medical/incident/{id}` | Lấy sự cố y tế theo ID | Admin, Manager, Nurse, Parent |
| GET | `/api/medical/incident` | Lấy tất cả sự cố y tế | Admin, Manager, Nurse, Parent |
| PUT | `/api/medical/incident/{id}` | Cập nhật sự cố y tế | Admin, Manager, Nurse |
| POST | `/api/medical/usage` | Tạo sử dụng y tế | Admin, Manager, Nurse |
| DELETE | `/api/medical/usage/{id}` | Xóa sử dụng y tế | Admin, Manager, Nurse |
| PUT | `/api/medical/usage/{id}` | Cập nhật sử dụng y tế | Admin, Manager, Nurse |

### Medical Requests (CRUD, State, Search)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/medical/request` | Tạo medical request | Admin, Manager, Nurse |
| GET | `/api/medical/request` | Lấy tất cả medical request | Admin, Manager, Nurse |
| GET | `/api/medical/request/{id}` | Lấy chi tiết request | Admin, Manager, Nurse |
| PUT | `/api/medical/request/{id}` | Cập nhật request | Admin, Manager, Nurse |
| DELETE | `/api/medical/request/{id}` | Xóa request | Admin, Manager, Nurse |
| GET | `/api/medical/request/daily/{date}` | Lấy request theo ngày | Admin, Manager, Nurse |
| GET | `/api/medical/request/daily/today` | Lấy request hôm nay | Admin, Manager, Nurse |
| PUT | `/api/medical/request/{id}/complete` | Đánh dấu hoàn thành | Admin, Manager, Nurse |
| PUT | `/api/medical/request/{id}/status` | Cập nhật trạng thái | Admin, Manager, Nurse |
| GET | `/api/medical/request/status/{status}` | Lấy request theo trạng thái | Admin, Manager, Nurse |
| POST | `/api/medical/request/reset-daily-completion` | Đặt lại trạng thái hoàn thành | Admin, Manager, Nurse |
| GET | `/api/medical/request/completion-status/{date}` | Trạng thái hoàn thành theo ngày | Admin, Manager, Nurse |
| GET | `/api/medical/request/completion-status/today` | Trạng thái hoàn thành hôm nay | Admin, Manager, Nurse |
| GET | `/api/medical/request/search` | Tìm kiếm request | Admin, Manager, Nurse |
| GET | `/api/medical/request/student/{studentId}` | Lấy request của học sinh | Admin, Manager, Nurse |

---

## 6. Nurse APIs

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/nurse/health-profiles/{studentId}` | Lấy hồ sơ sức khỏe học sinh | Nurse |
| POST | `/api/nurse/health-profiles` | Tạo hồ sơ sức khỏe | Nurse |
| POST | `/api/nurse/health-profiles/import` | Nhập hồ sơ từ Excel | Nurse |
| PUT | `/api/nurse/health-profiles/{studentId}` | Cập nhật hồ sơ sức khỏe | Nurse |
| DELETE | `/api/nurse/health-profiles/{studentId}` | Xóa hồ sơ sức khỏe | Nurse |
| GET | `/api/nurse/get-all-checkup` | Lấy tất cả đợt kiểm tra | Nurse |
| GET | `/api/nurse/health-checkup-records` | Lấy hồ sơ kiểm tra | Admin, Manager, Nurse |
| GET | `/api/nurse/health-checkup-records/by-date` | Lấy hồ sơ kiểm tra theo ngày | Admin, Manager, Nurse |
| PUT | `/api/nurse/health-checkup-records/{id}` | Cập nhật kết quả kiểm tra | Nurse |
| GET | `/api/nurse/get-all-conseling-schedules` | Lấy lịch tư vấn | Nurse |
| PUT | `/api/nurse/conseling-schedules-status` | Chấp nhận hoặc từ chối tư vấn | Nurse |
| GET | `/api/nurse/vaccination-records` | Lấy tất cả hồ sơ tiêm chủng | Admin, Manager, Nurse |
| PUT | `/api/nurse/vaccination-records/{id}` | Cập nhật hồ sơ tiêm chủng | Nurse |
| GET | `/api/nurse/vaccination-records/by-date` | Lấy hồ sơ tiêm chủng theo ngày | Admin, Manager, Nurse |

---

## 7. Parent APIs

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/parents/students` | Lấy danh sách học sinh của phụ huynh | Parent |
| GET | `/api/parents/get-all-student-health-checkup` | Lấy đợt kiểm tra sức khỏe học sinh | Parent |
| GET | `/api/parents/get-all-conseling-schedules` | Lấy lịch tư vấn học sinh | Parent |
| POST | `/api/parents/conseling-schedules` | Yêu cầu tư vấn | Parent |
| PUT | `/api/parents/students/{studentId}/health-profile` | Cập nhật hồ sơ sức khỏe học sinh | Parent |
| GET | `/api/parents/activity-consents/my-children` | Lấy đồng thuận hoạt động cho con | Parent |
| PUT | `/api/parents/activity-consents/{id}/status` | Xác nhận đồng thuận | Parent |

---

## 8. Blog APIs

| Method | Endpoint | Description | Auth Required | Notes |
|--------|----------|-------------|--------------|-------|
| GET | `/api/blogs` | Lấy tất cả blogs | ❌ | Chỉ hiện blog chưa bị xóa |
| GET | `/api/blogs/{id}` | Lấy chi tiết blog | ❌ | |
| POST | `/api/blogs` | Tạo blog mới | ✅ | Sử dụng multipart/form-data |
| PUT | `/api/blogs/{id}` | Cập nhật blog | ✅ | Chỉ tác giả, multipart/form-data |
| DELETE | `/api/blogs/{id}` | Xóa blog | ✅ | Chỉ tác giả |
| POST | `/api/blogs/{id}/view` | Tăng lượt xem | ❌ | Không yêu cầu đăng nhập |
| GET | `/api/blogs/user/{userId}` | Lấy blog của user bất kỳ | ❌ | |
| GET | `/api/blogs/my-blogs` | Lấy blog của người dùng hiện tại | ✅ | Từ access token |
| POST | `/api/blogs/upload-image` | Upload ảnh cho editor | ✅ | Trả về imageUrl |

---

## 9. Weather Forecast (Demo/Test)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/WeatherForecast` | Lấy dự báo thời tiết mẫu | Public |

---

