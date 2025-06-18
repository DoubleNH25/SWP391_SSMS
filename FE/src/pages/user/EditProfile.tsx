import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User} from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FecthUpdateProfile, FecthUsersProfile } from "@/services/UserService";
import { UserProfileUpdateViewModel } from "@/types/User";

export default function EditProfile() {
    const [, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(
        {
            email: "",
            fullName: "",
            phone: "",
            image: null as File | null,
        }
    );
    const navigate = useNavigate();

    const loadUser = async () => {
        setLoading(true);
        try {
            const user = await FecthUsersProfile();
            if (user) {
                setFormData({
                    fullName: user.fullName,
                    phone: user.phone,
                    image: user.image as File | null,
                    email: user.email
                });
                setError(null);
            } else {
                throw new Error('Không tìm thấy dữ liệu');
            }
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error && err.message.includes('authenticated')
                ? 'Vui lòng đăng nhập để xem dữ liệu'
                : 'Lỗi khi tải dữ liệu. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage, {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!formData.fullName
                || !formData.phone) {
                throw new Error('Vui lòng điền đầy đủ các trường');
            }
            const success = await FecthUpdateProfile(formData as UserProfileUpdateViewModel);
            if (success) {
                toast.success('Profile updated successfully', {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
                navigate('/');
            } else {
                throw new Error('Lỗi khi cập nhật');
            }
            toast.error('Lỗi khi cập nhật', {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi xảy ra, vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage, {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/");
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, image: file as File | null }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-10 max-w-3/4 mt-5">
                <div className="flex flex-col items-center">
                    <div className="relative group mb-4">
                        <div className="relative overflow-hidden rounded-full w-[20rem] h-[20rem] bg-gradient-to-br p-1 shadow-xl">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                {formData.image ? (
                                    <img
                                        src={formData.image as unknown as string}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                        <User className="w-[15rem] h-[15rem] text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer">
                            <Camera className="w-[5rem] h-[5rem] text-white" />
                        </div>

                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        /> </div>
                    <span className="text-3xl font-semibold mt-5">{formData.fullName}</span>
                    <span className="text-sm text-gray-500 mt-2">{formData.email}</span>
                </div>
                <div className="flex flex-col gap-5 mt-[5rem] w-1/2">
                    <div>
                        <Label htmlFor="input-phone">Phone</Label>
                        <Input
                            name="phone"
                            type="text"
                            id="input-phone"
                            onChange={handleInputChange}
                            value={formData.phone}
                            className="w-full"
                            placeholder="Please enter phone" />
                    </div>
                    <div>
                        <Label htmlFor="input-name">Full Name</Label>
                        <Input
                            name="fullName"
                            type="text"
                            onChange={handleInputChange}
                            value={formData.fullName}
                            className="w-full"
                            id="input-name"
                            placeholder="Please enter name" />
                    </div>
                    <div className="text-right mt-2">
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 w-[10%] hover:bg-blue-700 text-white py-2 rounded"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            type="button"
                            className="mt-4 w-[10%] ml-4 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div >
        </form>
    );
}
