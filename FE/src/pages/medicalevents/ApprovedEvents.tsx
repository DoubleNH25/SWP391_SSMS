import { useCallback, useEffect, useMemo, useState } from "react";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import { FecthApprovedRejectedMedicalEvents } from "@/services/MedicalEventService";
import { Button } from "@/components/ui/button";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FecthApprovedRejectedVaccinationCampaigns } from "@/services/VaccinationCampaignService";
import { FecthClass } from "@/services/SchoolClassService";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { CheckCircle2 } from "lucide-react";

export default function ApprovedEventManager() {
  const navigate = useNavigate();
  const [medicalEvents, setMedicalEvents] = useState<MedicalEventViewModel[]>([]);
  const [vaccinationCampaigns, setVaccinationCampaigns] = useState<VaccinationCampaignsViewModel[]>([]);
  const [selectedView, setSelectedView] = useState<"MedicalEvents" | "VaccinationCampaigns">("MedicalEvents");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchDate, setSearchDate] = useState<string>("");

  // Filter and sort data
  const getFilteredAndSortedData = (): (MedicalEventViewModel | VaccinationCampaignsViewModel)[] => {
    if (selectedView === "MedicalEvents") {
      let data = [...medicalEvents];

      // Apply search filter
      if (searchTerm.trim()) {
        data = data.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply date filter
      if (searchDate) {
        const searchDateObj = new Date(searchDate);
        data = data.filter(item => {
          const itemDate = new Date(item.scheduledDate);
          return itemDate.toDateString() === searchDateObj.toDateString();
        });
      }

      // Apply date sorting
      data.sort((a, b) => {
        const dateA = new Date(a.scheduledDate);
        const dateB = new Date(b.scheduledDate);
        return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });

      return data;
    } else {
      let data = [...vaccinationCampaigns];

      // Apply search filter
      if (searchTerm.trim()) {
        data = data.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.vaccineType.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply date filter
      if (searchDate) {
        const searchDateObj = new Date(searchDate);
        data = data.filter(item => {
          const itemDate = new Date(item.startDate);
          return itemDate.toDateString() === searchDateObj.toDateString();
        });
      }

      // Apply date sorting
      data.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });

      return data;
    }
  };

  const handleGetMedicalRecord = useCallback(async (medicalEventDate: string) => {
    if (selectedView === "MedicalEvents") {
      navigate(`/medical-health-checkup-record/${medicalEventDate}`);
    } else {
      navigate(`/medical-vaccination-record/${medicalEventDate}`);
    }
  }, [navigate, selectedView]);

  const currentData = getFilteredAndSortedData();
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (selectedView === "MedicalEvents") {
        const data = await FecthApprovedRejectedMedicalEvents();
        setMedicalEvents(data);
      } else {
        const data = await FecthApprovedRejectedVaccinationCampaigns();
        setVaccinationCampaigns(data);
      }
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.message.includes('authenticated')) {
        setError(`Please log in to view events.`);
      } else {
        setError('Failed to fetch data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedView]);

  const fetchClassData = useCallback(async () => {
    try {
      const classRooms = await FecthClass();
      const options = classRooms.map(classRoom => ({
        value: classRoom.id,
        label: classRoom.className
      }));
      setClassOptions(options);
    } catch (err) {
      console.error('Failed to fetch class data:', err);
    }
  }, []);

  const viewOptions = useMemo(() => [
    { value: "MedicalEvents", label: "Medical Events" },
    { value: "VaccinationCampaigns", label: "Vaccination Campaigns" },
  ], []);

  const handleSelectChange = (value: string) => {
    setSelectedView(value as "MedicalEvents" | "VaccinationCampaigns");
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchData();
    fetchClassData();
  }, [fetchData, fetchClassData]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-4 min-h-screen">
        <PageHeader
          title="Quản lý sự kiện đã duyệt"
          icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
          description="Quản lý các sự kiện y tế đã được phê duyệt"
        />
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-gray-500 font-medium">Loading...</div>
            </div>
          </div>
        ) : error ? (
          <div role="alert" className="max-w-md mx-auto mt-8 text-center bg-white border border-red-200 rounded-xl shadow-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            {error.includes('authenticated') ? (
              <button
                onClick={() => window.location.href = '/login'}
                aria-label="Log in to view approved events"
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
              >
                Log In
              </button>
            ) : (
              <button
                onClick={() => fetchData()}
                aria-label="Retry fetching approved events"
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-start">

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-gray-700">View Type</Label>
                    <Select
                      options={viewOptions}
                      defaultValue={selectedView}
                      placeholder="Select an option"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900 text-sm w-[200px] text-gray-500 border-gray-200 placeholder-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
                  {(searchTerm || searchDate) && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSearchDate("");
                        setCurrentPage(1);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear Filters
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-gray-700">
                      Search by {selectedView === "MedicalEvents" ? "Name or Description" : "Name, Vaccine Name, or Type"}
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder={selectedView === "MedicalEvents"
                          ? "Enter name or description..."
                          : "Enter name, vaccine name, or type..."
                        }
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setCurrentPage(1);
                          }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-gray-700">
                      Filter by Date
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => {
                          setSearchDate(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                      {searchDate && (
                        <button
                          onClick={() => {
                            setSearchDate("");
                            setCurrentPage(1);
                          }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {(searchTerm || searchDate) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Showing results for {searchTerm && <span className="font-medium">"{searchTerm}"</span>}
                      {searchTerm && searchDate && " and "}
                      {searchDate && <span className="font-medium">date: {new Date(searchDate).toLocaleDateString()}</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
              {selectedView === "MedicalEvents" ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 tracking-wider w-[25%]">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 tracking-wider w-[30%]">
                          Description
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 tracking-wider w-[15%]">
                          <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group"
                          >
                            Ngày tháng
                            <svg className={`w-4 h-4 transition-transform group-hover:text-blue-600 ${sortOrder === "asc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 tracking-wider w-[20%]">
                          Classes
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 tracking-wider w-[10%]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => {
                          const medicalEvent = item as MedicalEventViewModel;
                          return (
                            <tr key={index} className={`hover:bg-gray-50 transition-colors ${item.status === "Rejected"
                              ? "cursor-not-allowed"
                              : "cursor-pointer"}`}
                              onClick={() => item.status === "Rejected" ? null : handleGetMedicalRecord(new Date((item as MedicalEventViewModel).scheduledDate).toISOString())}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {medicalEvent.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {medicalEvent.description}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(medicalEvent.scheduledDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                {(() => {
                                  const validClassIds = item.classIds?.filter(id => id && id.trim() !== "") || [];
                                  return validClassIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                      {validClassIds.map((classId, classIndex) => {
                                        const classOption = classOptions.find(option => option.value === classId);
                                        const className = classOption ? classOption.label : `Class ${classId}`;
                                        return (
                                          <span key={classIndex} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {className}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-sm italic">No classes assigned</span>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className={`${item.status === "Approved" ? "text-green-800 bg-green-100 hover:bg-green-200" : "text-red-800 bg-red-100"} px-3 py-1.5 text-xs font-medium border-2`}
                                >
                                  {item.status as string}
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <p className="text-gray-500 font-medium">No approved medical events available</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[20%]">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[15%]">Vaccine Name</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[15%]">Vaccine Type</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[12%]">EXP</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[12%]">MFG</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[12%]">
                          <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group"
                          >
                            Date
                            <svg className={`w-4 h-4 transition-transform group-hover:text-blue-600 ${sortOrder === "asc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[14%]">Classes</th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                          <tr key={index} className={`hover:bg-gray-50 transition-colors ${item.status === "Rejected"
                            ? "cursor-not-allowed"
                            : "cursor-pointer"}`}
                            onClick={() => item.status === "Rejected" ? null : handleGetMedicalRecord(new Date((item as VaccinationCampaignsViewModel).startDate).toISOString())}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {(item as VaccinationCampaignsViewModel).name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {(item as VaccinationCampaignsViewModel).vaccineName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {(item as VaccinationCampaignsViewModel).vaccineType}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date((item as VaccinationCampaignsViewModel).exp).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date((item as VaccinationCampaignsViewModel).mfg).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date((item as VaccinationCampaignsViewModel).startDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              {(() => {
                                const campaign = item as VaccinationCampaignsViewModel;
                                const validClassIds = campaign.classIds?.filter(id => id && id.trim() !== "") || [];
                                return validClassIds.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {validClassIds.map((classId, classIndex) => {
                                      const classOption = classOptions.find(option => option.value === classId);
                                      const className = classOption ? classOption.label : `Class ${classId}`;
                                      return (
                                        <span key={classIndex} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                          {className}
                                        </span>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm italic">No classes assigned</span>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className={`${item.status === "Approved" ? "text-green-800 bg-green-100 hover:bg-green-200" : "text-red-800 bg-red-100"} px-3 py-1.5 text-xs font-medium border-2`}
                              >
                                {item.status as string}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <p className="text-gray-500 font-medium">No approved vaccination campaigns available</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {currentData.length > 0 && (
              <div className="bg-white p-5 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <p className="text-sm text-gray-600">
                      Showing <span className="text-gray-900">{startIndex + 1}</span> to{" "}
                      <span className="text-gray-900">{Math.min(endIndex, totalItems)}</span> of{" "}
                      <span className="text-gray-900">{totalItems}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Show:</span>
                      <select
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>
                  </div>

                  <nav className="flex items-center gap-1">
                    <button
                      className="p-2 text-gray-400 border border-gray-200 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-4 py-2 text-sm font-medium border-t border-b transition-colors ${page === currentPage
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="p-2 text-gray-400 border border-gray-200 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
