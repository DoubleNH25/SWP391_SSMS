import { EyeIcon, EyeCloseIcon } from "@/components/icons";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import { FecthUpdateUsers, FecthUserById } from "@/services/UserService";
import { UserUpdate } from "@/types/User";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateUser() {
  const { userId } = useParams<{ userId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserUpdate>(
    {
      email: "",
      phone: "",
      fullName: "",
      password: ""
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await FecthUserById(userId);
        setFormData({
          email: user.email,
          phone: user.phone,
          fullName: user.fullName,
          password: user.password
        });
      } catch (err) {
        setError(err.message || 'Failed to load user data');
      }
    }
    loadUser();
  }, [userId]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.phone || !formData.fullName || !formData.password) {
        throw new Error('Please fill in all required fields');
      }
      await FecthUpdateUsers(userId, formData);
      navigate('/user');
    } catch (err) {
      setError(err.message || 'An error occurred, please try again.');
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/user");
  }

  return (
    <>
      <div
        className={`bg-white`}
      >
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800">
            Update User
          </h3>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="p-4 border-t border-gray-100">
            <div className="space-y-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="input-email">Email</Label>
                  <Input 
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  type="text" 
                  id="input-email" 
                  placeholder="Please enter email" />
                </div>
                <div>
                  <Label htmlFor="input-phone">Phone</Label>
                  <Input 
                  name="phone"
                  onChange={handleInputChange}
                  value={formData.phone}
                  type="text" 
                  id="input-phone"
                  placeholder="Please enter phone" />
                </div>
                <div>
                  <Label htmlFor="input-name">Full Name</Label>
                  <Input 
                  name="fullName"
                  onChange={handleInputChange}
                  value={formData.fullName}
                  type="text" 
                  id="input-name" 
                  placeholder="Please enter name" />
                </div>
                <div>
                  <Label htmlFor="input-password">Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      onChange={handleInputChange}
                      value={formData.password}
                      id="input-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 " />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500" />
                      )}
                    </button>
                  </div>
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