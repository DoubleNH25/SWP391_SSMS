import { useEffect, useState } from "react";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import { FecthApproveMedicalEvents } from "@/services/MedicalEventService";
import { Button } from "@/components/ui/button";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FecthApproveVaccinationCampaigns } from "@/services/VaccinationCampaignService";

export default function ApprovedEventManager() {
  const [medicalEvents, setMedicalEvents] = useState<MedicalEventViewModel[]>([]);
  const [vaccinationCampaigns, setVaccinationCampaigns] = useState<VaccinationCampaignsViewModel[]>([]);
  const [selectedView, setSelectedView] = useState<"MedicalEvents" | "VaccinationCampaigns">("MedicalEvents");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = selectedView === "MedicalEvents" ? medicalEvents : vaccinationCampaigns;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  useEffect(() => {
    fetchData();
  }, [selectedView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (selectedView === "MedicalEvents") {
        const data = await FecthApproveMedicalEvents();
        setMedicalEvents(data);
      } else {
        const data = await FecthApproveVaccinationCampaigns();
        setVaccinationCampaigns(data);
      }
      setError(null);
    } catch (err) {
      if (err.message.includes('authenticated')) {
        setError('Please log in to view approved events.');
      } else {
        setError('Failed to fetch data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { value: "MedicalEvents", label: "Medical Events" },
    { value: "VaccinationCampaigns", label: "Vaccination Campaigns" },
  ];

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

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div role="alert" className="text-center text-red-500 p-4 bg-red-100 rounded">
            <p>{error}</p>
            {error.includes('authenticated') ? (
              <button
                onClick={() => window.location.href = '/login'}
                aria-label="Log in to view approved events"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Log In
              </button>
            ) : (
              <button
                onClick={() => fetchData()}
                aria-label="Retry fetching approved events"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            )}
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center text-gray-600">No approved {selectedView.toLowerCase()} available</div>
        ) : (
          <>
            <div className="flex justify-between mt-4">
              <nav className="text-base text-gray-500 mb-4">
                <ol className="list-reset flex">
                  <li><span className="mx-2">›</span></li>
                  <li>Event</li>
                  <li><span className="mx-2">›</span></li>
                  <li>Manager Approved</li>
                  <li><span className="mx-2">›</span></li>
                  <li className="text-gray-700">{selectedView}</li>
                </ol>
              </nav>
              <div className="flex items-center gap-4">
                <Label>View Type</Label>
                <Select
                  options={options}
                  defaultValue={selectedView}
                  placeholder="Select an option"
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900 text-sm w-[200px] text-gray-500 border-gray-200 placeholder-gray-300"
                />
              </div>
            </div>
            <div className="space-y-6">
              {selectedView === "MedicalEvents" ? (
                <div>
                  <table className="w-full mt-10 border text-sm">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="p-2 pl-4 w-[25%]">Name</th>
                        <th className="p-2 w-[30%]">Description</th>
                        <th className="p-2 w-[15%]">Date</th>
                        <th className="p-2 w-[16%]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2 pl-4 flex flex-nowrap truncate">{item.name}</td>
                          <td className="p-2 truncate">{item.description}</td>
                          <td className="p-2 truncate">{new Date(item.scheduledDate).toLocaleDateString()}</td>
                          <td className="py-1">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="text-green-900 bg-green-200 py-2"
                            >
                              Approved
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  <table className="w-full mt-10 border text-sm">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="p-2 pl-4 w-[18%]">Name</th>
                        <th className="p-2 w-[18%]">Vaccine Name</th>
                        <th className="p-2 w-[10%]">Vaccine Type</th>
                        <th className="p-2 w-[15%]">EXP</th>
                        <th className="p-2 w-[15%]">MFG</th>
                        <th className="p-2 w-[15%]">Date</th>
                        <th className="p-2 w-[15%]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2 pl-4 flex flex-nowrap truncate">{(item as VaccinationCampaignsViewModel).name}</td>
                          <td className="p-2 truncate">{(item as VaccinationCampaignsViewModel).vaccineName}</td>
                          <td className="p-2 truncate">{(item as VaccinationCampaignsViewModel).vaccineType}</td>
                          <td className="p-2 truncate">{new Date((item as VaccinationCampaignsViewModel).exp).toLocaleDateString()}</td>
                          <td className="p-2 truncate">{new Date((item as VaccinationCampaignsViewModel).mfg).toLocaleDateString()}</td>
                          <td className="p-2 truncate">{new Date((item as VaccinationCampaignsViewModel).startDate).toLocaleDateString()}</td>
                          <td className="py-1">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="text-green-900 bg-green-200 py-2"
                            >
                              Approved
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> results
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Show:</span>
                    <select
                      className="text-sm border rounded px-2 py-1 hover:bg-gray-100"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                  <nav className="flex items-center gap-1">
                    <button
                      className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
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
                        className={`px-4 py-1 text-sm font-semibold border ${page === currentPage ? "bg-indigo-600 text-white" : "text-gray-900 hover:bg-gray-50"
                          }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
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
            </div>
          </>
        )}
      </div>
    </>
  );
}