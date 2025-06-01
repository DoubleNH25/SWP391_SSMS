import { useState } from "react";
import { Button } from "@/components/ui/button"; // Nếu dùng shadcn/ui
import { Student } from "@/types/Student";

const initialData: Student[] = [
  { id: 1, fullName: "Nguyễn Văn A", age: 20, className: "D21TH01" },
  { id: 2, fullName: "Trần Thị B", age: 21, className: "D21TH02" },
  { id: 3, fullName: "Lê Văn C", age: 19, className: "D21TH03" },
];

export default function StudentProfiles() {
  const [students] = useState<Student[]>(initialData); //, setStudents

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Danh sách sinh viên</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">STT</th>
            <th className="p-2">Họ tên</th>
            <th className="p-2">Tuổi</th>
            <th className="p-2">Lớp</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{student.fullName}</td>
              <td className="p-2">{student.age}</td>
              <td className="p-2">{student.className}</td>
              <td className="p-2 space-x-2">
                <Button variant="outline" size="sm">
                  Sửa
                </Button>
                <Button variant="destructive" size="sm">
                  Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
