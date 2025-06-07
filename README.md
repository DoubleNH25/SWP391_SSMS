
# 📘 School Medical Management System API Documentation

This project is a **School Medical Management System** designed for managing student health records, medical events, and communication between school nurses and parents.

---

## 🌐 Swagger UI
API documentation is available at:
https://localhost:7172/swagger/index.html


Most endpoints require JWT authentication via the `Authorization` header.


### 🧾 Xử lý Kiểm Tra Sức Khỏe
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/medical-events/health-activities` | Tạo một hoạt động sức khỏe. | Nurse |
| PUT | `/api/medical-events/health-activities/{id}/approve` | Phê duyệt hoạt động sức khỏe. | Admin, Manager |
| GET | `/api/medical-events/health-activities/pending` | Danh sách đang chờ xử lý. | Admin, Manager |
| GET | `/api/medical-events/health-activities/approved` | Danh sách đã được phê duyệt. | Admin, Manager, Nurse |
| PUT | `/api/medical-events/health-activities/{id}` | Cập nhật hoạt động. | Nurse, Admin, Manager |
| DELETE | `/api/medical-events/health-activities/{id}` | Xóa hoạt động. | Nurse, Admin, Manager |

## Note: Sau khi phê duyệt approve bởi manager/admin thì hệ thống sẽ tự tạo Activity Consent cho Parent đồng ý hoặc không

### ✅ Activity Consents
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/parents/activity-consents/my-children` | Đồng thuận hoạt động. | Parent |
| PUT | `/api/parents/activity-consents/{id}/confirm` | Xác nhận đồng thuận. | Parent |

---
## Note: Sau khi Parent chấp nhận thì những Health Check Record sẽ tự động tạo ra để khi kiểm tra sức khỏe nhân viên y tế điền vào

### 👀 Health Checkups (Health Check Record nhân viên y tế điền vào)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/nurse/get-all-checkup` | Lấy tất cả đợt kiểm tra. | Nurse |
| PUT | `/api/nurse/health-checkup-records/{id}` | Cập nhật kết quả kiểm tra. | Nurse |
| GET | `/api/nurse/health-checkup-records` | Lấy hồ sơ kiểm tra. | Admin, Manager, Nurse |
---
## Note: Sau khi nhân viên y tế kiểm tra sức khỏe và điền vào /api/nurse/health-checkup-records/{id} thì hệ thống sẽ tự cập nhật health profile cho student


### 🎓 Students
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/parents/students` | Danh sách học sinh. | Parent |
| GET | `/api/parents/students-with-healthprofile` | Học sinh có hồ sơ. | Parent |
| GET | `/api/parents/students/health` | Hồ sơ học sinh. | Parent |
| PUT | `/api/parents/students/{id}/health-profile` | Cập nhật hồ sơ. | Parent |
---
## Note: Sau khi có kết quả nếu phụ huynh cần tư vấn thì có thể tạo schedule để nurse tư vấn

### 👁️‍🗨️ Health Checkups & Counseling
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/parents/get-all-student-health-checkup` | Đợt kiểm tra của học sinh. | Parent |
| GET | `/api/parents/get-all-conseling-schedules` | Lịch tư vấn học sinh. | Parent |
| POST | `/api/parents/conseling-schedules` | Yêu cầu tư vấn. | Parent |
| PUT | `/api/nurse/accept-conseling-schedules` | Chấp nhận tư vấn. | Nurse |
| GET | `/api/nurse/get-all-conseling-schedules` | Lịch tư vấn. | Nurse |
---

### 💉 Vaccination Campaigns (Xử lý tiêm vaccine)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/medical-events/vaccination-campaigns` | Tạo chiến dịch tiêm chủng. | Nurse |
| PUT | `/api/medical-events/vaccination-campaigns/{id}/approve` | Phê duyệt chiến dịch. | Admin, Manager |
| GET | `/api/medical-events/vaccination-campaigns/pending` | Danh sách chờ xử lý. | Admin, Manager |
| GET | `/api/medical-events/vaccination-campaigns/approved` | Danh sách đã phê duyệt. | Admin, Manager, Nurse, Parent |
| PUT | `/api/medical-events/vaccination-campaigns/{id}` | Cập nhật chiến dịch. | Nurse, Admin, Manager |
| DELETE | `/api/medical-events/vaccination-campaigns/{id}` | Xóa chiến dịch. | Nurse, Admin, Manager |

## Note: Sau khi phê duyệt approve bởi manager/admin thì hệ thống sẽ tự tạo Activity Consent cho Parent đồng ý hoặc không

### ✅ Activity Consents
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/parents/activity-consents/my-children` | Đồng thuận hoạt động. | Parent |
| PUT | `/api/parents/activity-consents/{id}/confirm` | Xác nhận đồng thuận. | Parent |


## Note: Sau khi Parent chấp nhận thì những Vaccination Record sẽ tự động tạo ra để khi kiểm tra sức khỏe nhân viên y tế điền vào

### 💉 Vaccination Records
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| PUT | `/api/nurse/vaccination-records/{id}` | Cập nhật hồ sơ tiêm. | Nurse |
| GET | `/api/nurse/vaccination-records` | Lấy tất cả hồ sơ. | Admin, Manager, Nurse ||

## Note: Sau khi nhân viên y tế kiểm tra sức khỏe và điền vào /api/nurse/vaccination-records/{id}


## 🔐 Authentication APIs
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/auth/parent/send-otp` | Gửi OTP đến số điện thoại của phụ huynh. | No auth required |
| POST | `/api/auth/parent/verify-otp` | Xác minh OTP để đăng nhập. | No auth required |
| POST | `/api/auth/login` | Đăng nhập bằng email và mật khẩu. | No auth required |

---

## 🏥 Medical Events APIs

### 🧾 Health Activities
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/medical-events/health-activities` | Tạo một hoạt động sức khỏe. | Nurse |
| PUT | `/api/medical-events/health-activities/{id}/approve` | Phê duyệt hoạt động sức khỏe. | Admin, Manager |
| GET | `/api/medical-events/health-activities/pending` | Danh sách đang chờ xử lý. | Admin, Manager |
| GET | `/api/medical-events/health-activities/approved` | Danh sách đã được phê duyệt. | Admin, Manager, Nurse |
| PUT | `/api/medical-events/health-activities/{id}` | Cập nhật hoạt động. | Nurse, Admin, Manager |
| DELETE | `/api/medical-events/health-activities/{id}` | Xóa hoạt động. | Nurse, Admin, Manager |

### 💉 Vaccination Campaigns
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/medical-events/vaccination-campaigns` | Tạo chiến dịch tiêm chủng. | Nurse |
| PUT | `/api/medical-events/vaccination-campaigns/{id}/approve` | Phê duyệt chiến dịch. | Admin, Manager |
| GET | `/api/medical-events/vaccination-campaigns/pending` | Danh sách chờ xử lý. | Admin, Manager |
| GET | `/api/medical-events/vaccination-campaigns/approved` | Danh sách đã phê duyệt. | Admin, Manager, Nurse, Parent |
| PUT | `/api/medical-events/vaccination-campaigns/{id}` | Cập nhật chiến dịch. | Nurse, Admin, Manager |
| DELETE | `/api/medical-events/vaccination-campaigns/{id}` | Xóa chiến dịch. | Nurse, Admin, Manager |

### 📝 Activity Consents
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/medical-events/activity-consents/health-activities/{id}` | Danh sách đồng thuận sức khỏe. | Admin, Manager, Nurse |
| GET | `/api/medical-events/activity-consents/vaccination-campaigns/{id}` | Danh sách đồng thuận tiêm chủng. | Admin, Manager, Nurse |

---
## 👩‍⚕️ Medical Request APIs

### 🩺 Medical Request
| Method | Endpoint                                        | Description                               | Roles                 |
| ------ | ----------------------------------------------- | ----------------------------------------- | --------------------- |
| POST   | `/api/medical/request`                          | Tạo lịch uống thuốc.                         | Nurse                 |
| GET    | `/api/medical/request`                          | Lấy tất cả lịch.                       | Admin, Manager, Nurse |
| GET    | `/api/medical/request/{id}`                     | Lấy yêu cầu theo ID.                      | Admin, Manager, Nurse |
| PUT    | `/api/medical/request/{id}`                     | Cập nhật yêu cầu.                         | Nurse                 |
| DELETE | `/api/medical/request/{id}`                     | Xóa yêu cầu.                              | Nurse                 |
| GET    | `/api/medical/request/daily/{date}`             | Lấy yêu cầu theo ngày.                    | Admin, Manager, Nurse |
| GET    | `/api/medical/request/daily/today`              | Lấy yêu cầu hôm nay.                      | Admin, Manager, Nurse |
| PUT    | `/api/medical/request/{id}/complete`            | Đánh dấu hoàn thành.                      | Nurse                 |
| PUT    | `/api/medical/request/{id}/status`              | Cập nhật trạng thái.                      | Nurse                 |
| GET    | `/api/medical/request/student/{studentId}`      | Lấy yêu cầu theo học sinh.                | Admin, Manager, Nurse |
| GET    | `/api/medical/request/status/{status}`          | Lấy yêu cầu theo trạng thái.              | Admin, Manager, Nurse |
| GET    | `/api/medical/request/search`                   | Tìm kiếm yêu cầu.                         | Admin, Manager, Nurse |
| POST   | `/api/medical/request/reset-daily-completion`   | Đặt lại trạng thái hoàn thành trong ngày. | Nurse                 |
| GET    | `/api/medical/request/completion-status/{date}` | Trạng thái hoàn thành theo ngày.          | Admin, Manager, Nurse |
| GET    | `/api/medical/request/completion-status/today`  | Trạng thái hoàn thành hôm nay.            | Admin, Manager, Nurse |

---

## 👩‍⚕️ Nurse APIs

### 🩺 Health Profiles
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/nurse/health-profiles` | Tạo hồ sơ sức khỏe. | Nurse |
| GET | `/api/nurse/health-profiles/{studentId}` | Lấy hồ sơ học sinh. | Nurse |
| PUT | `/api/nurse/health-profiles/{studentId}` | Cập nhật hồ sơ. | Nurse |
| DELETE | `/api/nurse/health-profiles/{studentId}` | Xóa hồ sơ. | Nurse |
| POST | `/api/nurse/health-profiles/import` | Nhập hồ sơ từ Excel. | Nurse |

### 💉 Vaccination Records
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| PUT | `/api/nurse/vaccination-records/{id}` | Cập nhật hồ sơ tiêm. | Nurse |
| GET | `/api/nurse/vaccination-records` | Lấy tất cả hồ sơ. | Admin, Manager, Nurse |

### 👀 Health Checkups
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/nurse/get-all-checkup` | Lấy tất cả đợt kiểm tra. | Nurse |
| PUT | `/api/nurse/health-checkup-records/{id}` | Cập nhật kết quả kiểm tra. | Nurse |
| GET | `/api/nurse/health-checkup-records` | Lấy hồ sơ kiểm tra. | Admin, Manager, Nurse |

### 🧑‍⚕️ Counseling Schedules
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| PUT | `/api/nurse/accept-conseling-schedules` | Chấp nhận tư vấn. | Nurse |
| GET | `/api/nurse/get-all-conseling-schedules` | Lịch tư vấn. | Nurse |

---

## 👨‍👩‍👧 Parent APIs

### 🎓 Students
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/parents/students` | Danh sách học sinh. | Parent |
| GET | `/api/parents/students-with-healthprofile` | Học sinh có hồ sơ. | Parent |
| GET | `/api/parents/students/health` | Hồ sơ học sinh. | Parent |
| PUT | `/api/parents/students/{id}/health-profile` | Cập nhật hồ sơ. | Parent |

### 👁️‍🗨️ Health Checkups & Counseling
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/parents/get-all-student-health-checkup` | Đợt kiểm tra của học sinh. | Parent |
| GET | `/api/parents/get-all-conseling-schedules` | Lịch tư vấn học sinh. | Parent |
| POST | `/api/parents/conseling-schedules` | Yêu cầu tư vấn. | Parent |

### ✅ Activity Consents
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/parents/activity-consents/my-children` | Đồng thuận hoạt động. | Parent |
| PUT | `/api/parents/activity-consents/{id}/confirm` | Xác nhận đồng thuận. | Parent |

---

## 👥 User Management APIs

### 👤 Users
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/users` | Lấy tất cả người dùng. | Admin |
| GET | `/api/users/{id}` | Lấy người dùng theo ID. | Admin |
| POST | `/api/users` | Tạo người dùng mới. | Admin |
| PUT | `/api/users/{id}` | Cập nhật người dùng. | Admin |
| DELETE | `/api/users/{id}` | Xóa người dùng. | Admin |

### 🧾 Profile
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/users/profile` | Hồ sơ người dùng. | Authenticated |
| PUT | `/api/users/profile` | Cập nhật hồ sơ. | Authenticated |

### 👨‍🎓 Students
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/users/import-students` | Nhập học sinh từ Excel. | Admin |
| GET | `/api/users/students` | Lấy tất cả học sinh. | Admin |
| POST | `/api/users/parents/students` | Tạo học sinh bởi phụ huynh. | Parent |
| POST | `/api/users/students` | Tạo học sinh bởi admin. | Admin |
| PUT | `/api/users/students/{id}` | Cập nhật học sinh. | Parent, Admin |
| DELETE | `/api/users/students/{id}` | Xóa học sinh. | Parent, Admin |
