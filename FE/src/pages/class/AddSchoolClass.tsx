import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from '@/components/ui/Toast';
import { SchoolClassCreateUpdateViewModel } from "@/types/SchoolClass";
import { FecthCreateSchoolClass } from "@/services/SchoolClassService";

export default function AddSchoolClass() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SchoolClassCreateUpdateViewModel>(
    {
      className: "",
      classRoom: "",
      quantity: 0
    }
  );
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.className
      || !formData.classRoom
      || !formData.quantity) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const submitData: SchoolClassCreateUpdateViewModel = {
        classRoom: formData.classRoom,
        className: formData.className,
        quantity: formData.quantity,
      };
      const success = await FecthCreateSchoolClass(submitData);
      if (success) {
        navigate("/class");
        setTimeout(() => {
          showToast.success("Cập nhật thành công");
        }, 100);
      } else {
        throw new Error('Creation failed');
      }
    } catch (err) {
      setError(`Failed to create class: ${err instanceof Error ? err.message : 'Unknown error'}`);
      showToast.error(`Failed to create class: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/class");
  }

  return (
    <div className="p-6 bg-white">
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
              Add New Class
            </h3>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="p-4 border-t border-gray-100">
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="input-name">Class Name</Label>
                    <Input
                      type="text"
                      name="className"
                      id="input-name"
                      onChange={handleInputChange}
                      value={formData.className}
                      placeholder="Please enter name" />
                  </div>
                  <div>
                    <Label htmlFor="input-class">Class Room</Label>
                    <Input
                      name="classRoom"
                      type="text"
                      id="input-class"
                      onChange={handleInputChange}
                      value={formData.classRoom}
                      placeholder="Please enter class" />
                  </div>
                  <div>
                    <Label htmlFor="input-class">Quantity</Label>
                    <Input
                      name="quantity"
                      type="number"
                      id="input-class"
                      min="0"
                      onChange={handleInputChange}
                      value={formData.quantity}
                      placeholder="Please enter class" />
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