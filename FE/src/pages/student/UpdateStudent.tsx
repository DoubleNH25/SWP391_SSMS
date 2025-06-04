import DatePicker from "@/components/ui/form/DateField";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import { FecthStudentById, FecthUpdateStudents } from "@/services/UserService";
import { StudentUpdate } from "@/types/Student";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateStudents() {
  const { studentId } = useParams<{ studentId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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

  const loadUser = async () => {
    setLoading(true);
    try {
      const user = await FecthStudentById(studentId);
      if (user) {
        setFormData({
          fullName: user.fullName,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          classId: user.classId,
          image: null
        });
        setError(null);
      } else {
        throw new Error('Student not found');
      }
    } catch (err) {
      setError(err.message.includes('authenticated')
        ? 'Please log in to view student data.'
        : 'Failed to load student data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (studentId) {
      loadUser();
    }
  }, [studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.fullName
        || !formData.gender
        || !formData.classId) {
        throw new Error('Please fill in all required fields');
      }
      const success = await FecthUpdateStudents(studentId, formData);
      if (success) {
        toast.success('Student updated successfully');
        navigate('/student');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred, please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/student");
  }

  return (
    <div className="p-6 bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div role="alert" className="text-center text-red-500 p-4 bg-red-100 rounded">
          <p>{error}</p>
          {error.includes('authenticated') ? (
            <button
              onClick={() => window.location.href = '/login'}
              aria-label="Log in to continue"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              aria-label="Retry loading student data"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        <>
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
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  disabled={loading}
                  className="mt-4 w-[10%] ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}