import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FecthCreateStudents, FecthParents } from "@/services/UserService";
import { StudentCreate } from "@/types/Student";
import DatePicker from "@/components/ui/form/DateField";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddStudent() {
  const [error, setError] = useState<string | null>(null);
  const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    parentId: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    classId: string;
    image: File | null; 
  }>({
      parentId: "",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      classId: "",
      image: null
    });
  const navigate = useNavigate();

  useEffect(() => {
    handleGetParent();
  }, []);

  const handleGetParent = async () => {
    setLoading(true);
    try {
      const parents = await FecthParents();
      const options = parents.map(parent => ({
        value: parent.id,
        label: parent.fullName
      }));
      setParentOptions(options);
      setError(null);
    } catch (err) {
      setError(err instanceof Error && err.message.includes('authenticated')
        ? 'Please log in to fetch parent data.'
        : 'Failed to fetch parent data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleParentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, parentId: value }));
  };

  const options = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName
      || !formData.gender
      || !formData.classId
      || !formData.dateOfBirth) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const submitData: StudentCreate = {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        classId: formData.classId,
        image: formData.image,
      };
      const success = await FecthCreateStudents(formData.parentId, submitData);
      if (success) {
        toast.success('Student created successfully');
        navigate("/student");
      } else {
        throw new Error('Creation failed');
      }
    } catch (err) {
      setError(`Failed to create student: ${err instanceof Error ? err.message : 'Unknown error'}`);
      toast.error(`Failed to create student: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
              onClick={handleGetParent}
              aria-label="Retry fetching parent data"
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
              Add New Student
            </h3>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="p-4 border-t border-gray-100">
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label>Parent</Label>
                    <SearchableSelect
                      options={parentOptions}
                      placeholder="Select a parent"
                      onChange={handleParentChange}
                      className="w-full"
                    />
                  </div>
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
                        console.log(dates);
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
                  className="mt-4 bg-blue-600 w-[10%] hover:bg-blue-700 text-white py-2 rounded"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  type="button"
                  className="mt-4 w-[10%] ml-4 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
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