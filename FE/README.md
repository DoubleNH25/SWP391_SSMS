<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
>>>>>>> phucc
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
=======
<<<<<<< HEAD
=======
>>>>>>> 396da2f (update-crud-user-student-healthprofile)
>>>>>>> phucc
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
<<<<<<< HEAD
>>>>>>> 3c4be67 (update-crud-user-student-healthprofile)
=======
<<<<<<< HEAD
=======
>>>>>>> 3c4be67 (update-crud-user-student-healthprofile)
>>>>>>> 396da2f (update-crud-user-student-healthprofile)
>>>>>>> phucc
