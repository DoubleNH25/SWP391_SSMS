"School Medical Management System

Phần mềm quản lý y tế học đường"	"Phần mềm quản lý y tế học đường cho phòng y tế của 01 trường học.
- Trang chủ giới thiệu thông tin trường học, tài liệu về sức khỏe học đường, blog chia sẻ kinh nghiệm, ...
- Chức năng cho phép phụ huynh khai báo hồ sơ sức khỏe của học sinh: dị ứng, bệnh mãn tính, tiền sử điều trị, thị lực, thính lực, tiêm chủng, ...
- Chức năng cho phép phụ huynh gửi thuốc cho trường để nhân viên y tế cho học sinh uống.
- Chức năng cho phép nhân viên y tế ghi nhận và xử lý sự kiện y tế (tai nạn, sốt, té ngã, dịch bệnh, ...) trong trường. 
- Quản lý thuốc và các vật tư y tế trong quá trình xử lý các sự kiện y tế.
- Quản lý quá trình tiêm chủng tại trường
          << Gửi phiếu thông báo đồng ý tiêm chủng cho phụ huynh xác nhận --> Chuẩn bị danh sách học sinh tiêm --> Tiêm chủng và ghi nhận kết quả --> Theo dõi sau tiêm >>
- Quản lý quá trình kiểm tra y tế định kỳ tại trường học
          << Gửi phiếu thông báo kiểm tra y tế các nội dung kiểm tra cho phụ huynh xác nhận --> Chuẩn bị danh sách học sinh kiểm tra --> Thực hiện kiểm tra và ghi nhận kết quả --> Gửi kết quả cho phụ huynh và lập lịch hẹn tư vấn riêng nếu có dấu hiệu bất thường >>
- Quản lý hồ sơ người dùng, lịch sử kiểm tra y tế.
- Dashboard & Report."
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> phucc

📖 API Documentation

API documentation có sẵn thông qua Swagger tại https://localhost:7172/swagger/index.html khi ứng dụng đang chạy.

Dưới đây là danh sách các API chính, được nhóm theo chức năng:

Lưu ý: Hầu hết các API yêu cầu xác thực qua JWT token trong header Authorization. Các API được đánh dấu "(No auth required)" không cần xác thực. Vai trò (Roles) chỉ ra các vai trò người dùng có thể truy cập API.

🔐 Authentication APIs





POST /api/auth/parent/send-otp - Gửi OTP đến số điện thoại của phụ huynh. (No auth required)



POST /api/auth/parent/verify-otp - Xác minh OTP để đăng nhập cho phụ huynh. (No auth required)



POST /api/auth/login - Đăng nhập bằng email và mật khẩu. (No auth required)

🏥 Medical Events APIs

Health Activities





POST /api/medical-events/health-activities - Tạo một hoạt động sức khỏe mới. (Nurse)



PUT /api/medical-events/health-activities/{id}/approve - Phê duyệt một hoạt động sức khỏe. (Admin, Manager)



GET /api/medical-events/health-activities/pending - Lấy danh sách hoạt động sức khỏe đang chờ xử lý. (Admin, Manager)



GET /api/medical-events/health-activities/approved - Lấy danh sách hoạt động sức khỏe đã được phê duyệt. (Admin, Manager, Nurse)



PUT /api/medical-events/health-activities/{id} - Cập nhật một hoạt động sức khỏe. (Nurse, Admin, Manager)



DELETE /api/medical-events/health-activities/{id} - Xóa một hoạt động sức khỏe. (Nurse, Admin, Manager)

Vaccination Campaigns





POST /api/medical-events/vaccination-campaigns - Tạo một chiến dịch tiêm chủng mới. (Nurse)



PUT /api/medical-events/vaccination-campaigns/{id}/approve - Phê duyệt một chiến dịch tiêm chủng. (Admin, Manager)



GET /api/medical-events/vaccination-campaigns/pending - Lấy danh sách chiến dịch tiêm chủng đang chờ xử lý. (Admin, Manager)



GET /api/medical-events/vaccination-campaigns/approved - Lấy danh sách chiến dịch tiêm chủng đã được phê duyệt. (Admin, Manager, Nurse, Parent)



PUT /api/medical-events/vaccination-campaigns/{id} - Cập nhật một chiến dịch tiêm chủng. (Nurse, Admin, Manager)



DELETE /api/medical-events/vaccination-campaigns/{id} - Xóa một chiến dịch tiêm chủng. (Nurse, Admin, Manager)

Activity Consents





GET /api/medical-events/activity-consents/health-activities/{healthActivityId} - Lấy danh sách đồng thuận cho một hoạt động sức khỏe. (Admin, Manager, Nurse)



GET /api/medical-events/activity-consents/vaccination-campaigns/{vaccinationCampaignId} - Lấy danh sách đồng thuận cho một chiến dịch tiêm chủng. (Admin, Manager, Nurse)

👩‍⚕️ Nurse APIs

Health Profiles





POST /api/nurse/health-profiles - Tạo hồ sơ sức khỏe cho một học sinh. (Nurse)



GET /api/nurse/health-profiles/{studentId} - Lấy hồ sơ sức khỏe của một học sinh. (Nurse)



PUT /api/nurse/health-profiles/{studentId} - Cập nhật hồ sơ sức khỏe của một học sinh. (Nurse)



DELETE /api/nurse/health-profiles/{studentId} - Xóa hồ sơ sức khỏe của một học sinh. (Nurse)



POST /api/nurse/health-profiles/import - Nhập hồ sơ sức khỏe từ Excel. (Nurse)

Vaccination Records





PUT /api/nurse/vaccination-records/{id} - Cập nhật một hồ sơ tiêm chủng. (Nurse)



GET /api/nurse/vaccination-records - Lấy tất cả hồ sơ tiêm chủng. (Admin, Manager, Nurse)

Health Checkups





GET /api/nurse/get-all-checkup - Lấy tất cả các đợt kiểm tra sức khỏe cho y tá. (Nurse)



PUT /api/nurse/health-checkup-records/{id} - Cập nhật một hồ sơ kiểm tra sức khỏe. (Nurse)



GET /api/nurse/health-checkup-records - Lấy tất cả hồ sơ kiểm tra sức khỏe. (Admin, Manager, Nurse)

Counseling Schedules





PUT /api/nurse/accept-conseling-schedules - Chấp nhận một lịch tư vấn. (Nurse)



GET /api/nurse/get-all-conseling-schedules - Lấy tất cả lịch tư vấn cho y tá. (Nurse)

👨‍👩‍👧 Parent APIs

Students





GET /api/parents/parents/students - Lấy danh sách học sinh của phụ huynh. (Parent)



GET /api/parents/parents/students-with-healthprofile - Lấy danh sách học sinh của phụ huynh có hồ sơ sức khỏe. (Parent)



GET /api/parents/students/health - Lấy hồ sơ sức khỏe của học sinh của phụ huynh. (Parent)



PUT /api/parents/students/{studentId}/health-profile - Cập nhật hồ sơ sức khỏe của học sinh bởi phụ huynh. (Parent)

Health Checkups and Counseling





GET /api/parents/get-all-student-health-checkup - Lấy tất cả các đợt kiểm tra sức khỏe của học sinh của phụ huynh. (Parent)



GET /api/parents/get-all-conseling-schedules - Lấy tất cả lịch tư vấn của học sinh của phụ huynh. (Parent)



POST /api/parents/conseling-schedules - Yêu cầu một lịch tư vấn. (Parent)

Activity Consents





GET /api/parents/activity-consents/my-children - Lấy danh sách đồng thuận hoạt động cho con của phụ huynh. (Parent)



PUT /api/parents/activity-consents/{id}/confirm - Xác nhận một đồng thuận hoạt động. (Parent)

👥 User Management APIs

Users





GET /api/users - Lấy tất cả người dùng. (Admin)



GET /api/users/{id} - Lấy một người dùng theo ID. (Admin)



POST /api/users - Tạo một người dùng mới. (Admin)



PUT /api/users/{id} - Cập nhật một người dùng. (Admin)



DELETE /api/users/{id} - Xóa một người dùng. (Admin)

Profile





GET /api/users/profile - Lấy hồ sơ của người dùng hiện tại. (Authenticated)



PUT /api/users/profile - Cập nhật hồ sơ của người dùng hiện tại. (Authenticated)

Students





POST /api/users/import-students - Nhập học sinh từ Excel. (Admin)



GET /api/users/students - Lấy tất cả học sinh. (Admin)



POST /api/users/parents/students - Tạo một học sinh mới bởi phụ huynh. (Parent)



POST /api/users/students - Tạo một học sinh mới bởi admin. (Admin)



PUT /api/users/students/{studentId} - Cập nhật một học sinh. (Parent, Admin)



<<<<<<< HEAD
DELETE /api/users/students/{studentId} - Xóa một học sinh. (Parent, Admin)
=======
DELETE /api/users/students/{studentId} - Xóa một học sinh. (Parent, Admin)
>>>>>>> 396da2f (update-crud-user-student-healthprofile)
>>>>>>> phucc
