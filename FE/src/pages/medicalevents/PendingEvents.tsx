import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import { FecthApproveMedicalEvent, FecthPendingMedicalEvent } from "@/services/MedicalEventService";
import { VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import { FecthApproveVaccinationCampaign, FecthPendingVaccinationCampaign } from "@/services/VaccinationCampaignService";
import { t } from "framer-motion/dist/types.d-CtuPurYT";

type EventType = "medicalEvent" | "vaccinationCampaign";

export default function PendingEventManager() {
  const [medicalEvents, setMedicalEvents] = useState<MedicalEventViewModel[]>([]);
  const [vaccinationCampaigns, setVaccinationCampaigns] = useState<VaccinationCampaignsViewModel[]>([]);
  const [loading, setLoading] = useState({ medicalEvents: true, vaccinationCampaigns: true });
  const [error, setError] = useState<{ medicalEvents: string | null; vaccinationCampaigns: string | null }>({
    medicalEvents: null,
    vaccinationCampaigns: null,
  });
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; type: EventType } | null>(null);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);

  const totalPendingCount =
    medicalEvents.filter((event) => !event.isAccepted).length +
    vaccinationCampaigns.filter((campaign) => !campaign.isAccepted).length;

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsVaccinationCampaignsPerPage, setItemsVaccinationCampaignsPerPage] = useState(5);
  const [currentVaccinationCampaignsPage, setCurrentVaccinationCampaignsPage] = useState(1);

  const totalMedicalEventPages = Math.ceil(medicalEvents.length / itemsPerPage) || 1;
  const medicalEventStartIndex = (currentPage - 1) * itemsPerPage;
  const medicalEventEndIndex = medicalEventStartIndex + itemsPerPage;
  const paginatedMedicalEvents = medicalEvents.slice(medicalEventStartIndex, medicalEventEndIndex);

  const totalVaccinationCampaignPages = Math.ceil(vaccinationCampaigns.length / itemsVaccinationCampaignsPerPage) || 1;
  const vaccinationCampaignStartIndex = (currentVaccinationCampaignsPage - 1) * itemsVaccinationCampaignsPerPage;
  const vaccinationCampaignEndIndex = vaccinationCampaignStartIndex + itemsVaccinationCampaignsPerPage;
  const paginatedVaccinationCampaigns = vaccinationCampaigns.slice(
    vaccinationCampaignStartIndex,
    vaccinationCampaignEndIndex
  );

  useEffect(() => {
    fetchMedicalEventsData();
    fetchVaccinationCampaignsData();
  }, []);

  const fetchMedicalEventsData = async () => {
    try {
      const data = await FecthPendingMedicalEvent();
      setMedicalEvents(data);
      setLoading((prev) => ({ ...prev, medicalEvents: false }));
    } catch (err) {
      setError((prev) => ({ ...prev, medicalEvents: `Failed to fetch medical events: ${err.message}` }));
      setLoading((prev) => ({ ...prev, medicalEvents: false }));
    }
  };

  const fetchVaccinationCampaignsData = async () => {
    try {
      const data = await FecthPendingVaccinationCampaign();
      setVaccinationCampaigns(data);
      setLoading((prev) => ({ ...prev, vaccinationCampaigns: false }));
    } catch (err) {
      setError((prev) => ({ ...prev, vaccinationCampaigns: `Failed to fetch vaccination campaigns: ${err.message}` }));
      setLoading((prev) => ({ ...prev, vaccinationCampaigns: false }));
    }
  };

  const handleConfirmApprovedEvent = async () => {
    if (!selectedEvent) return;
    try {
      if (selectedEvent.type === "medicalEvent") {
        await FecthApproveMedicalEvent(selectedEvent.id);
        setMedicalEvents(medicalEvents.filter((event) => event.id !== selectedEvent.id));
      } else {
        await FecthApproveVaccinationCampaign(selectedEvent.id);
        setVaccinationCampaigns(vaccinationCampaigns.filter((event) => event.id !== selectedEvent.id));
      }
      setIsApprovedModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      setError((prev) => ({
        ...prev,
        [selectedEvent.type]: `Failed to approve ${selectedEvent.type}: ${err.message}`,
      }));
    }
  };

  const handleOpenApprovedEventModal = (id: string, type: EventType) => {
    setSelectedEvent({ id, type });
    setIsApprovedModalOpen(true);
  };

  const handleCloseApprovedEventModal = () => {
    setIsApprovedModalOpen(false);
    setSelectedEvent(null);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalMedicalEventPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsVaccinationCampaignsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsVaccinationCampaignsPerPage(Number(e.target.value));
    setCurrentVaccinationCampaignsPage(1);
  };

  const handlePageVaccinationCampaignsChange = (page: number) => {
    if (page >= 1 && page <= totalVaccinationCampaignPages) {
      setCurrentVaccinationCampaignsPage(page);
    }
  };

  if (loading.medicalEvents || loading.vaccinationCampaigns) {
    return <div>Loading...</div>;
  }

  if (error.medicalEvents || error.vaccinationCampaigns) {
    return (
      <div>
        {error.medicalEvents && <div>Error: {error.medicalEvents}</div>}
        {error.vaccinationCampaigns && <div>Error: {error.vaccinationCampaigns}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <nav className="text-base text-gray-500 mb-4 mt-4" aria-label="Breadcrumb">
          <ol className="list-reset flex">
            <li><span className="mx-2">›</span></li>
            <li>Events</li>
            <li><span className="mx-2">›</span></li>
            <li className="text-gray-700">Manager Pending</li>
          </ol>
        </nav>
        <div className="mt-4">
          {totalPendingCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="bg-red-600 text-white-700"
            >
              Approve All Pending Events
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-600 text-white-700"
              disabled
            >
              No Pending Events
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <Modal
          isOpen={isApprovedModalOpen}
          onClose={handleCloseApprovedEventModal}
          showCloseButton={true}
          isFullscreen={false}
          className="max-w-md p-6"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Approval
            </h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to approve this {selectedEvent?.type === "medicalEvent" ? "medical event" : "vaccination campaign"}?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={handleConfirmApprovedEvent}
                className="rounded bg-lime-600 px-6 py-2 text-white hover:bg-lime-700"
              >
                Approve
              </Button>
              <Button
                onClick={handleCloseApprovedEventModal}
                className="rounded bg-gray-200 px-6 py-2 text-gray-900 hover:bg-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
        <div className="h-[28.5rem]">
          <div className="flex flex-col justify-between h-5/6 max-h-5/6 space-y-px">
            <div>
              <h3 className="font-bold text-lg text-center text-blue-600">Medical Events</h3>
              <table className="w-full mt-5 border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 pl-4 w-[25%]" scope="col">Name</th>
                    <th className="p-2 w-[30%]" scope="col">Description</th>
                    <th className="p-2 w-[15%]" scope="col">Date</th>
                    <th className="p-2 w-[16%]" scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMedicalEvents.map((event) => (
                    <tr key={event.id} className="border-t">
                      <td className="pl-4 flex flex-nowrap truncate">{event.name}</td>
                      <td className="truncate">{event.description}</td>
                      <td className="truncate">{new Date(event.scheduledDate).toLocaleDateString()}</td>
                      <td className="py-2 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenApprovedEventModal(event.id, "medicalEvent")}
                          className={event.isAccepted ? "text-green-700 bg-green-50 hover:bg-green-100" : "text-yellow-700 bg-yellow-50 hover:bg-yellow-100"}
                        >
                          {event.isAccepted ? "Approved" : "Pending"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{medicalEventStartIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(medicalEventEndIndex, medicalEvents.length)}</span> of{" "}
                    <span className="font-medium">{medicalEvents.length}</span> results for medical events
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Show:</span>
                    <select
                      className="text-sm border rounded px-2 py-1 hover:bg-gray-100"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      aria-label="Items per page for medical events"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                  <nav className="flex items-center gap-1" aria-label="Medical events pagination">
                    <button
                      className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {Array.from({ length: totalMedicalEventPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-4 py-1 text-sm font-semibold border ${page === currentPage ? "bg-indigo-600 text-white" : "text-gray-900 hover:bg-gray-50"
                          }`}
                        onClick={() => handlePageChange(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalMedicalEventPages}
                      aria-label="Next page"
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
          </div>

          <hr className="my-4" />

          <div className="flex flex-col justify-between h-5/6 max-h-5/6 space-y-px">
            <div>
              <h3 className="font-bold text-lg text-center text-blue-600">Vaccination Campaigns</h3>
              <table className="w-full mt-5 border text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 pl-4 w-[18%]" scope="col">Name</th>
                    <th className="p-2 w-[18%]" scope="col">Vaccine Name</th>
                    <th className="p-2 w-[10%]" scope="col">Vaccine Type</th>
                    <th className="p-2 w-[15%]" scope="col">EXP</th>
                    <th className="p-2 w-[15%]" scope="col">MFG</th>
                    <th className="p-2 w-[15%]" scope="col">Date</th>
                    <th className="p-2 w-[15%]" scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVaccinationCampaigns.map((event) => (
                    <tr key={event.id} className="border-t">
                      <td className="pl-4 flex flex-nowrap truncate">{event.name}</td>
                      <td className="truncate">{event.vaccineName}</td>
                      <td className="truncate">{event.vaccineType}</td>
                      <td className="truncate">{new Date(event.exp).toLocaleDateString()}</td>
                      <td className="truncate">{new Date(event.mfg).toLocaleDateString()}</td>
                      <td className="truncate">{new Date(event.startDate).toLocaleDateString()}</td>
                      <td className="py-2 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenApprovedEventModal(event.id, "vaccinationCampaign")}
                          className={event.isAccepted ? "text-green-700 bg-green-50 hover:bg-green-100" : "text-yellow-700 bg-yellow-50 hover:bg-yellow-100"}
                        >
                          {event.isAccepted ? "Approved" : "Pending"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{vaccinationCampaignStartIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(vaccinationCampaignEndIndex, vaccinationCampaigns.length)}</span> of{" "}
                    <span className="font-medium">{vaccinationCampaigns.length}</span> results for vaccination campaigns
                  </p>
                </div>
                <div className="flex gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Show:</span>
                    <select
                      className="text-sm border rounded px-2 py-1 hover:bg-gray-100"
                      value={itemsVaccinationCampaignsPerPage}
                      onChange={handleItemsVaccinationCampaignsPerPageChange}
                      aria-label="Items per page for vaccination campaigns"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                  <nav className="flex items-center gap-1" aria-label="Vaccination campaigns pagination">
                    <button
                      className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageVaccinationCampaignsChange(currentVaccinationCampaignsPage - 1)}
                      disabled={currentVaccinationCampaignsPage === 1}
                      aria-label="Previous page"
                    >
                      <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {Array.from({ length: totalVaccinationCampaignPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-4 py-1 text-sm font-semibold border ${page === currentVaccinationCampaignsPage ? "bg-indigo-600 text-white" : "text-gray-900 hover:bg-gray-50"
                          }`}
                        onClick={() => handlePageVaccinationCampaignsChange(page)}
                        aria-current={page === currentVaccinationCampaignsPage ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => handlePageVaccinationCampaignsChange(currentVaccinationCampaignsPage + 1)}
                      disabled={currentVaccinationCampaignsPage === totalVaccinationCampaignPages}
                      aria-label="Next page"
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
          </div>
        </div>
      </div>
    </div>
  );
}