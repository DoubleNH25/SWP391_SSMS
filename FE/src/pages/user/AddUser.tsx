import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import { EyeIcon, EyeCloseIcon } from "../../components/icons/index"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCreate } from "@/types/User";
import { FecthCreateUsers } from "@/services/UserService";

export default function AddUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserCreate>(
    {
      email: "",
      phone: "",
      fullName: "",
      roleName: "",
      password: ""
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, roleId: value }));
  };

  const navigate = useNavigate();
  const options = [
    { value: "349fb78c-744c-47b5-8463-aed1426b4f9d", label: "Admin" },
    { value: "6779ebc6-0ce2-45bb-a561-fd913aad7c79", label: "Manager" },
    { value: "c5298ccd-12eb-454d-8325-28250a9d1385", label: "Nurse" },
    { value: "d84b1e4b-bf61-4672-a1d2-552245ee6af8", label: "Parent" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.fullName || !formData.roleName || !formData.password) {
      setError("All fields are required.");
      return;
    }
    await FecthCreateUsers(formData);
    navigate("/user");
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
            Add New User
          </h3>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="p-4 border-t border-gray-100">
            <div className="space-y-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="input-email">Email</Label>
                  <Input
                    type="text"
                    name="email"
                    id="input-email"
                    onChange={handleInputChange}
                    value={formData.email}
                    placeholder="Please enter email" />
                </div>
                <div>
                  <Label htmlFor="input-phone">Phone</Label>
                  <Input
                    name="phone"
                    type="text"
                    id="input-phone"
                    onChange={handleInputChange}
                    value={formData.phone}
                    placeholder="Please enter phone" />
                </div>
                <div>
                  <Label htmlFor="input-name">Full Name</Label>
                  <Input
                    name="fullName"
                    type="text"
                    id="input-name"
                    onChange={handleInputChange}
                    value={formData.fullName}
                    placeholder="Please enter name" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    options={options}
                    placeholder="Select an option"
                    onChange={handleSelectChange}
                    defaultValue={formData.roleName}
                    className="dark:bg-dark-900"
                  />
                </div>
                <div>
                  <Label htmlFor="input-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="input-password"
                      name="password"
                      onChange={handleInputChange}
                      value={formData.password}
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