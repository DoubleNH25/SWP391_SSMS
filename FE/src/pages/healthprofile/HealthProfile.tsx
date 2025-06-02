import { useState, useEffect } from "react";
import { HealthProfileUpdate, Student } from "@/types/HealthProfile";
import { FecthHealthProfile, FecthUpdateHealthProfile } from "@/services/HealthProfileService";
import { Eye, Ear, Shield, Heart, AlertCircle, CheckCircle, PenBox } from 'lucide-react';
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/InputField";


export default function HealthProfiles() {
    const [healthProfiles, setHealthProfiles] = useState<Student[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string>(null);
    const [isUpdateModalOpen, setisUpdateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorModal, setErrorModal] = useState<string | null>(null);
    const [formData, setFormData] = useState<HealthProfileUpdate>(
        {
            vision: "",
            hearing: "",
            dental: "",
            bmi: 0,
            abnormalNote: "",
            vaccinationHistory: ""
        }
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenUpdateModal = (studentId: string) => {
        setSelectedProfileId(studentId);
        setisUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setisUpdateModalOpen(false);
        setSelectedProfileId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProfileId) return;
        if (!formData.vision || !formData.hearing || !formData.dental || !formData.bmi || !formData.vaccinationHistory || !formData.abnormalNote) {
            setErrorModal("All fields are required.");
            return;
        }
        try {
            await FecthUpdateHealthProfile(selectedProfileId, formData);
            fetchData();
            setisUpdateModalOpen(false);
            setSelectedProfileId(null);
            setErrorModal(null);
        } catch (error) {
            setErrorModal(`Failed to update user: ${error.message}`);
        }
    }


    const getHealthStatus = (profile) => {
        const issues = [];
        if (profile.vision !== '20/20') issues.push('Vision');
        if (profile.hearing !== 'Normal') issues.push('Hearing');
        if (profile.dental.includes('cavities')) issues.push('Dental');
        if (profile.abnormalNote !== 'None') issues.push('Health Note');
        return issues;
    };

    const getBMIStatus = (bmi) => {
        if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-600' };
        if (bmi >= 18.5 && bmi < 25) return { status: 'Normal', color: 'text-green-600' };
        if (bmi >= 25 && bmi < 30) return { status: 'Overweight', color: 'text-yellow-600' };
        return { status: 'Obese', color: 'text-red-600' };
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const fetchedProfile = await FecthHealthProfile();
            setHealthProfiles(fetchedProfile);
            setError(null);
        } catch (err) {
            setError('Failed to fetch health profiles');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }
    if (error) {
        return <div className="text-center text-red-500">Lỗi {error}</div>;
    }

    return (
        <div className="p-6">
            {healthProfiles.length === 0 ? (
                <div className="flex flex-col items-center space-y-5">
                    <div className="text-gray-600">No health records available</div>
                    <div
                        role="button"
                        className="w-max text-gray-100 bg-blue-400 hover:bg-blue-500 font-bold py-2 px-4 rounded cursor-pointer"
                    >
                        Add student health records
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-center mb-4">
                        <h1 className="text-4xl font-bold text-gray-800">Health Profile</h1>
                    </div>
                    {healthProfiles.map((student, index) => {
                        const healthIssues = getHealthStatus(student.healthProfile);
                        const bmiStatus = getBMIStatus(student.healthProfile.bmi);
                        return (
                            <div key={index} className="mt-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div>
                                            <img src={student.image} className="w-5 h-5" alt="..." />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-lg font-semibold text-gray-800">{student.fullName}</div>
                                            <div className="flex flex-between items-center">
                                                <div className="flex items-center mt-3 r gap-5">
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}
                                                    </div>
                                                    <span>{student.gender}</span>
                                                    <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                                                        Class {student.classId}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div >
                                        {healthIssues.length === 0 ? (
                                            <div className="flex items-center flex-nowrap space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">Khỏe mạnh</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2 flex-nowrap text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">Cần theo dõi</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 rounded-lg shadow-xl border-2 p-2 mt-5 relative">
                                    <div
                                        onClick={() => handleOpenUpdateModal(student.id)}
                                        role="button"
                                        className="absolute flex top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        <PenBox className="mr-2" />
                                        Edit
                                    </div>
                                    <div className="col-span-2  bg-white p-4">
                                        Full Name: {student.fullName}
                                    </div>
                                    <div className="bg-white py-4">
                                        Date Of Birth: {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="bg-white p-4">
                                        Gender: {student.gender}
                                    </div>
                                    <div className="bg-white py-4">
                                        Class Name: {student.classId}
                                    </div>
                                    <div className="bg-white py-4">
                                        Class Room: {student.classId}
                                    </div>
                                    <div className={`bg-white p-4`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Eye className="w-5 h-5 text-blue-500 mr-2" />
                                            Vision: {student.healthProfile.vision}
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">{student.healthProfile.vision}</p>
                                    </div>
                                    <div className="bg-white py-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Ear className="w-5 h-5 text-purple-500 mr-2" />
                                            Hearing: {student.healthProfile.hearing}
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">
                                            {student.healthProfile.hearing === 'Normal' ? 'Normal' : student.healthProfile.hearing}
                                        </p>
                                    </div>
                                    <div className="bg-white py-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                            </svg>
                                            Dental: {student.healthProfile.dental}
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">
                                            {student.healthProfile.dental === 'No cavities' ? 'Không sâu răng' :
                                                student.healthProfile.dental === 'Minor cavities' ? 'Sâu răng nhẹ' :
                                                    student.healthProfile.dental}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Heart className="w-5 h-5 text-red-500 mr-2" />
                                            BMI: {student.healthProfile.bmi}
                                        </div>
                                        <p className={`text-sm font-medium ${bmiStatus.color}`}>{bmiStatus.status}</p>
                                    </div>
                                    <div className="bg-white py-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Shield className="w-5 h-5 text-indigo-500 mr-2" />
                                            Vaccination: {student.healthProfile.vaccinationHistory}
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">
                                            {student.healthProfile.vaccinationHistory === 'Fully vaccinated' ? 'Đầy đủ' : student.healthProfile.vaccinationHistory}
                                        </p>
                                    </div>
                                    <div className="bg-white py-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                                            Abnormal: {student.healthProfile.abnormalNote}
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">
                                            {student.healthProfile.abnormalNote === 'None' ? 'Không có' : student.healthProfile.abnormalNote}
                                        </p>
                                    </div>
                                </div>
                                <hr className="mt-10 border-t border-gray-300" />
                                <Modal
                                    isOpen={isUpdateModalOpen}
                                    onClose={handleCloseUpdateModal}
                                    showCloseButton={true}
                                    className="w-2/5 mx-auto"
                                >
                                    {errorModal && (
                                        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                                            {errorModal}
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-bold mb-4 ml-5">Update Health Profile</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4 m-5">
                                        <div>
                                            <Label htmlFor="vision" className="block text-sm font-medium text-gray-700">
                                                Vision
                                            </Label>
                                            <Input
                                                type="text"
                                                name="vision"
                                                value={formData.vision}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="hearing" className="block text-sm font-medium text-gray-700">
                                                Hearing
                                            </Label>
                                            <Input
                                                type="text"
                                                name="hearing"
                                                value={formData.hearing}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dental" className="block text-sm font-medium text-gray-700">
                                                Dental
                                            </Label>
                                            <Input
                                                type="text"
                                                name="dental"
                                                value={formData.dental}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="bmi" className="block text-sm font-medium text-gray-700">
                                                BMI
                                            </Label>
                                            <Input
                                                min="0"
                                                max="100"
                                                type="number"
                                                name="bmi"
                                                value={formData.bmi}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="vaccinationHistory" className="block text-sm font-medium text-gray-700">
                                                Vaccination History
                                            </Label>
                                            <Input
                                                type="text"
                                                name="vaccinationHistory"
                                                value={formData.vaccinationHistory}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="abnormalNote" className="block text-sm font-medium text-gray-700">
                                                Abnormal Note
                                            </Label>
                                            <Input
                                                type="text"
                                                name="abnormalNote"
                                                value={formData.abnormalNote}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={handleCloseUpdateModal}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </Modal>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

}

