import DatePicker from "@/components/ui/form/DateField";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import { FecthUpdateStudents } from "@/services/UserService";
import { StudentUpdate } from "@/types/Student";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateStudents() {
  const { studentId } = useParams<{ studentId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StudentUpdate>(
    {
      fullName: "",
      gender: "",
      dateOfBirth: "",
      classId: "",
      image: null
    }
  );
  
  const options = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const user = await FecthUserById(userId);
  //       setFormData({
  //         email: user.email,
  //         phone: user.phone,
  //         fullName: user.fullName,
  //         password: user.password
  //       });
  //     } catch (err) {
  //       setError(err.message || 'Failed to load user data');
  //     }
  //   }
  //   loadUser();
  // }, [userId]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.fullName || !formData.gender || !formData.classId) {
        throw new Error('Please fill in all required fields');
      }
      await FecthUpdateStudents("", formData);
      navigate('/student');
    } catch (err) {
      setError(err.message || 'An error occurred, please try again.');
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/student");
  }

  return (
    <>
      <div
        className={`bg-white`}
      >
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800">
            Update Student
          </h3>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="p-4 border-t border-gray-100">
            <div className="space-y-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="input-name">Full Name</Label>
                  <Input
                    type="text"
                    name="fullName"
                    id="input-name"
                    onChange={handleInputChange}
                    value={formData.fullName}
                    placeholder="Please enter name" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select
                    options={options}
                    placeholder="Select an option"
                    onChange={handleSelectChange}
                    className="dark:bg-dark-900"
                  />
                </div>
                <div>
                  <DatePicker
                    id="date-picker"
                    label="Date Picker Input"
                    placeholder="Select a date"
                    onChange={(dates, currentDateString) => {
                      setFormData((prev) => ({ ...prev, dateOfBirth: currentDateString }));
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="input-class">Class</Label>
                  <Input
                    name="classId"
                    type="text"
                    id="input-class"
                    onChange={handleInputChange}
                    value={formData.classId}
                    placeholder="Please enter class" />
                </div>
                <div>
                  <Label>Upload image</Label>
                  <input
                    type="file"
                    onChange={handleFileChange} 
                    className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 custom-class" />
                </div>
              </div>
            </div>
            <div className="text-right mt-2">
              <button
                type="submit"
                className="mt-4 bg-blue-500 w-[10%] hover:bg-blue-600 text-white py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                type="button"
                className="mt-4 w-[10%] ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}