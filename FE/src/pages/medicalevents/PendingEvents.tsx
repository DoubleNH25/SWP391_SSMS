import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import { FecthApproveMedicalEvent, FecthPendingMedicalEvent, FecthRejectMedicalEvent } from "@/services/MedicalEventService";
import { VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import { FecthApproveVaccinationCampaign, FecthPendingVaccinationCampaign, FecthRejectVaccinationCampaign } from "@/services/VaccinationCampaignService";
import { FecthClass } from "@/services/SchoolClassService";
import { SchoolClass } from "@/types/SchoolClass";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([]);

  const totalPendingCount =
    medicalEvents.filter((event) => event.status === "Pending").length +
    vaccinationCampaigns.filter((campaign) => campaign.status === "Pending").length;

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
    fetchClassesData();
  }, []);

  const fetchMedicalEventsData = async () => {
    setLoading((prev) => ({ ...prev, medicalEvents: true }));
    try {
      const data = await FecthPendingMedicalEvent();
      setMedicalEvents(data);
      setError((prev) => ({ ...prev, medicalEvents: null }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        medicalEvents: err.message.includes('authenticated')
          ? 'Please log in to view pending medical events.'
          : 'Failed to fetch medical events. Please try again.'
      }));
    } finally {
      setLoading((prev) => ({ ...prev, medicalEvents: false }));
    }
  };

  const fetchVaccinationCampaignsData = async () => {
    setLoading((prev) => ({ ...prev, vaccinationCampaigns: true }));
    try {
      const data = await FecthPendingVaccinationCampaign();
      setVaccinationCampaigns(data);
      setError((prev) => ({ ...prev, vaccinationCampaigns: null }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        vaccinationCampaigns: err.message.includes('authenticated')
          ? 'Please log in to view pending vaccination campaigns.'
          : 'Failed to fetch vaccination campaigns. Please try again.'
      }));
    } finally {
      setLoading((prev) => ({ ...prev, vaccinationCampaigns: false }));
    }
  };

  const fetchClassesData = async () => {
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
  };

  const getClassNames = (classIds: string[]): string => {
    if (!classIds || classIds.length === 0 || (classIds.length === 1 && classIds[0] === "")) {
      return "No classes selected";
    }

    const classNames = classIds
      .filter(id => id && id !== "")
      .map(id => {
        const foundClass = classOptions.find(cls => cls.value === id);
        return foundClass ? foundClass.label : `Unknown (${id})`;
      });

    return classNames.length > 0 ? classNames.join(", ") : "No classes selected";
  };

  const handleConfirmApprovedEvent = async () => {
    if (!selectedEvent) return;
    setApproving(true);
    try {
      if (selectedEvent.type === "medicalEvent") {
        const success = await FecthApproveMedicalEvent(selectedEvent.id);
        if (success) {
          setMedicalEvents(medicalEvents.filter((event) => event.id !== selectedEvent.id));
          toast.success('Medical event approved successfully');
        } else {
          throw new Error('Approval failed');
        }
      } else {
        const success = await FecthApproveVaccinationCampaign(selectedEvent.id);
        if (success) {
          setVaccinationCampaigns(vaccinationCampaigns.filter((event) => event.id !== selectedEvent.id));
          toast.success('Vaccination campaign approved successfully');
        } else {
          throw new Error('Approval failed');
        }
      }
      setIsApprovedModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      toast.error(`Failed to approve ${selectedEvent.type}: ${err.message}`);
    } finally {
      setApproving(false);
    }
  };

  const handleConfirmRejectEvent = async () => {
    if (!selectedEvent) return;
    setRejecting(true);
    try {
      if (selectedEvent.type === "medicalEvent") {
        const success = await FecthRejectMedicalEvent(selectedEvent.id);
        if (success) {
          setMedicalEvents(medicalEvents.filter((event) => event.id !== selectedEvent.id));
          toast.success('Medical event rejected successfully');
        } else {
          throw new Error('Rejection failed');
        }
      } else {
        const success = await FecthRejectVaccinationCampaign(selectedEvent.id);
        if (success) {
          setVaccinationCampaigns(vaccinationCampaigns.filter((event) => event.id !== selectedEvent.id));
          toast.success('Vaccination campaign rejected successfully');
        } else {
          throw new Error('Rejection failed');
        }
      }
      setIsRejectModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      toast.error(`Failed to reject ${selectedEvent.type}: ${err.message}`);
    } finally {
      setRejecting(false);
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

  const handleOpenRejectEventModal = (id: string, type: EventType) => {
    setSelectedEvent({ id, type });
    setIsRejectModalOpen(true);
  };

  const handleCloseRejectEventModal = () => {
    setIsRejectModalOpen(false);
    setSelectedEvent(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalMedicalEventPages) {
      setCurrentPage(page);
    }
  };

  const handlePageVaccinationCampaignsChange = (page: number) => {
    if (page >= 1 && page <= totalVaccinationCampaignPages) {
      setCurrentVaccinationCampaignsPage(page);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading.medicalEvents || loading.vaccinationCampaigns ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error.medicalEvents || error.vaccinationCampaigns ? (
        <div role="alert" className="text-center text-red-500 p-4 bg-red-100 rounded">
          {error.medicalEvents && <p>{error.medicalEvents}</p>}
          {error.vaccinationCampaigns && <p>{error.vaccinationCampaigns}</p>}
          {(error.medicalEvents || error.vaccinationCampaigns) && (
            <button
              onClick={() => {
                if (error.medicalEvents) fetchMedicalEventsData();
                if (error.vaccinationCampaigns) fetchVaccinationCampaignsData();
              }}
              aria-label="Retry fetching pending events"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
          {(error.medicalEvents?.includes('authenticated') || error.vaccinationCampaigns?.includes('authenticated')) && (
            <button
              onClick={() => window.location.href = '/login'}
              aria-label="Log in to view pending events"
              className="mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log In
            </button>
          )}
        </div>
      ) : medicalEvents.length === 0 && vaccinationCampaigns.length === 0 ? (
        <div className="text-center text-gray-600">No pending events available</div>
      ) : (
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
            <div className="mt-4 relative">
              {totalPendingCount > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-800 bg-red-400 py-5"
                >
                  <span className="absolute right-[-9px] top-[-0.775rem] z-10 h-5 w-5 rounded-full bg-orange-400">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  </span>
                  Has {totalPendingCount} Pending Events
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
            {/* Approve Confirmation Modal */}
            <Modal
              isOpen={isApprovedModalOpen}
              onClose={handleCloseApprovedEventModal}
              showCloseButton={true}
              isFullscreen={false}
              className="max-w-2xl p-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Confirm Approval
                </h2>

                {selectedEvent && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    {selectedEvent.type === "medicalEvent" ? (
                      (() => {
                        const event = medicalEvents.find(e => e.id === selectedEvent.id);
                        return event ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Event Name:</span>
                              <span className="text-gray-900 text-right flex-1 ml-4">{event.name}</span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Description:</span>
                              <span className="text-gray-900 text-right flex-1 ml-4">{event.description}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Scheduled Date:</span>
                              <span className="text-gray-900">{new Date(event.scheduledDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Status:</span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                {event.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Classes:</span>
                              <div className="text-right flex-1 ml-4">
                                {(() => {
                                  const validClassIds = event.classIds?.filter(id => id && id.trim() !== "") || [];
                                  return validClassIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 justify-end">
                                      {validClassIds.map((classId, index) => {
                                        const classOption = classOptions.find(option => option.value === classId);
                                        const className = classOption ? classOption.label : `Class ${classId}`;
                                        return (
                                          <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {className}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-sm">No classes assigned</span>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()
                    ) : (
                      (() => {
                        const campaign = vaccinationCampaigns.find(c => c.id === selectedEvent.id);
                        return campaign ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Campaign Name:</span>
                              <span className="text-gray-900 text-right flex-1 ml-4">{campaign.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Vaccine Name:</span>
                              <span className="text-gray-900">{campaign.vaccineName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Vaccine Type:</span>
                              <span className="text-gray-900">{campaign.vaccineType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Start Date:</span>
                              <span className="text-gray-900">{new Date(campaign.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Expiry Date:</span>
                              <span className="text-gray-900">{new Date(campaign.exp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Manufacturing Date:</span>
                              <span className="text-gray-900">{new Date(campaign.mfg).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Status:</span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                {campaign.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Classes:</span>
                              <div className="text-right flex-1 ml-4">
                                {(() => {
                                  const validClassIds = campaign.classIds?.filter(id => id && id.trim() !== "") || [];
                                  return validClassIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 justify-end">
                                      {validClassIds.map((classId, index) => {
                                        const classOption = classOptions.find(option => option.value === classId);
                                        const className = classOption ? classOption.label : `Class ${classId}`;
                                        return (
                                          <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {className}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-sm">No classes assigned</span>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()
                    )}
                  </div>
                )}

                <p className="text-gray-600 mb-6">
                  Are you sure you want to approve this {selectedEvent?.type === "medicalEvent" ? "medical event" : "vaccination campaign"}?
                </p>

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleCloseApprovedEventModal}
                    className="rounded bg-gray-200 px-6 py-2 text-gray-900 hover:bg-gray-300"
                    disabled={approving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmApprovedEvent}
                    className={`rounded bg-lime-600 px-6 py-2 text-white hover:bg-lime-700 ${approving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={approving}
                  >
                    {approving ? 'Approving...' : 'Approve'}
                  </Button>
                </div>
              </div>
            </Modal>

            {/* Reject Confirmation Modal */}
            <Modal
              isOpen={isRejectModalOpen}
              onClose={handleCloseRejectEventModal}
              showCloseButton={true}
              isFullscreen={false}
              className="max-w-2xl p-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Confirm Rejection
                </h2>

                {selectedEvent && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    {selectedEvent.type === "medicalEvent" ? (
                      (() => {
                        const event = medicalEvents.find(e => e.id === selectedEvent.id);
                        return event ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Event Name:</span>
                              <span className="text-gray-900 text-right flex-1 ml-4">{event.name}</span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Description:</span>
                              <span className="text-gray-900 text-right flex-1 ml-4">{event.description}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Scheduled Date:</span>
                              <span className="text-gray-900">{new Date(event.scheduledDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Status:</span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                {event.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Classes:</span>
                              <div className="text-right flex-1 ml-4">
                                {(() => {
                                  const validClassIds = event.classIds?.filter(id => id && id.trim() !== "") || [];
                                  return validClassIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 justify-end">
                                      {validClassIds.map((classId, index) => {
                                        const classOption = classOptions.find(option => option.value === classId);
                                        const className = classOption ? classOption.label : `Class ${classId}`;
                                        return (
                                          <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {className}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-sm">No classes assigned</span>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()
                    ) : (
                      (() => {
                        const campaign = vaccinationCampaigns.find(c => c.id === selectedEvent.id);
                        return campaign ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Campaign Name:</span>
                              <span className="text-gray-900 text-right flex-1 ml-4">{campaign.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Vaccine Name:</span>
                              <span className="text-gray-900">{campaign.vaccineName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Vaccine Type:</span>
                              <span className="text-gray-900">{campaign.vaccineType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Start Date:</span>
                              <span className="text-gray-900">{new Date(campaign.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Expiry Date:</span>
                              <span className="text-gray-900">{new Date(campaign.exp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Manufacturing Date:</span>
                              <span className="text-gray-900">{new Date(campaign.mfg).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Status:</span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                {campaign.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-700">Classes:</span>
                              <div className="text-right flex-1 ml-4">
                                {(() => {
                                  const validClassIds = campaign.classIds?.filter(id => id && id.trim() !== "") || [];
                                  return validClassIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 justify-end">
                                      {validClassIds.map((classId, index) => {
                                        const classOption = classOptions.find(option => option.value === classId);
                                        const className = classOption ? classOption.label : `Class ${classId}`;
                                        return (
                                          <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {className}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-sm">No classes assigned</span>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()
                    )}
                  </div>
                )}

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Warning</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Are you sure you want to reject this {selectedEvent?.type === "medicalEvent" ? "medical event" : "vaccination campaign"}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleCloseRejectEventModal}
                    className="rounded bg-gray-200 px-6 py-2 text-gray-900 hover:bg-gray-300"
                    disabled={rejecting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmRejectEvent}
                    className={`rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700 ${rejecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={rejecting}
                  >
                    {rejecting ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              </div>
            </Modal>
            <div className="h-[28.5rem]">
              <div className="flex flex-col justify-between h-5/6 max-h-5/6 space-y-px">
                <div>
                  <h3 className="font-bold text-lg text-center text-blue-600">Medical Events</h3>
                  {medicalEvents.length === 0 ? (
                    <div className="text-center text-gray-600 mt-5">No pending medical events available</div>
                  ) : (
                    <table className="w-full mt-5 border text-sm">
                      <thead className="bg-gray-100 text-left">
                        <tr>
                          <th className="p-2 pl-4 w-[25%]" scope="col">Name</th>
                          <th className="w-[30%]" scope="col">Description</th>
                          <th className="w-[15%]" scope="col">Date</th>
                          <th className="p-2 w-[10%]" scope="col">Status</th>
                          <th className="p-2 w-[20%]" scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedMedicalEvents.map((event) => (
                          <tr key={event.id} className="border-t">
                            <td className="pl-4 truncate">{event.name}</td>
                            <td className="truncate">{event.description}</td>
                            <td className="truncate">{new Date(event.scheduledDate).toLocaleDateString()}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                event.status === "Approved" ? "text-green-700 bg-green-50" :
                                event.status === "Rejected" ? "text-red-700 bg-red-50" :
                                "text-yellow-700 bg-yellow-50"
                              }`}>
                                {event.status === "Approved" ? "Approved" : event.status === "Rejected" ? "Rejected" : "Pending"}
                              </span>
                            </td>
                            <td className="py-2 space-x-2">
                              {event.status === "Pending" ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenApprovedEventModal(event.id, "medicalEvent")}
                                    className="text-green-700 bg-green-50 hover:bg-green-100"
                                    disabled={approving || rejecting}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenRejectEventModal(event.id, "medicalEvent")}
                                    className="text-red-700 bg-red-50 hover:bg-red-100"
                                    disabled={approving || rejecting}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <span className="text-gray-500 text-sm">No actions available</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {medicalEvents.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{medicalEventStartIndex + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(medicalEventEndIndex, medicalEvents.length)}</span> of{" "}
                        <span className="font-medium">{medicalEvents.length}</span> results for medical events
                      </p>
                    </div>
                    <div className="flex gap-4">
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
                            className={`px-4 py-1 text-sm font-semibold border ${page === currentPage ? "bg-indigo-600 text-white" : "text-gray-900 hover:bg-gray-50"}`}
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
                )}
              </div>

              <hr className="my-4" />

              <div className="flex flex-col justify-between h-5/6 max-h-5/6 space-y-px">
                <div>
                  <h3 className="font-bold text-lg text-center text-blue-600">Vaccination Campaigns</h3>
                  {vaccinationCampaigns.length === 0 ? (
                    <div className="text-center text-gray-600 mt-5">No pending vaccination campaigns available</div>
                  ) : (
                    <table className="w-full mt-5 border text-sm">
                      <thead className="bg-gray-100 text-left">
                        <tr>
                          <th className="p-2 pl-4 w-[15%]" scope="col">Name</th>
                          <th className="w-[15%]" scope="col">Vaccine Name</th>
                          <th className="w-[10%]" scope="col">Vaccine Type</th>
                          <th className="p-2 w-[12%]" scope="col">EXP</th>
                          <th className="p-2 w-[12%]" scope="col">MFG</th>
                          <th className="p-2 w-[12%]" scope="col">Date</th>
                          <th className="p-2 w-[10%]" scope="col">Status</th>
                          <th className="p-2 w-[14%]" scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedVaccinationCampaigns.map((event) => (
                          <tr key={event.id} className="border-t">
                            <td className="pl-4 truncate">{event.name}</td>
                            <td className="truncate">{event.vaccineName}</td>
                            <td className="truncate">{event.vaccineType}</td>
                            <td className="truncate">{new Date(event.exp).toLocaleDateString()}</td>
                            <td className="truncate">{new Date(event.mfg).toLocaleDateString()}</td>
                            <td className="truncate">{new Date(event.startDate).toLocaleDateString()}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                event.status === "Approved" ? "text-green-700 bg-green-50" :
                                event.status === "Rejected" ? "text-red-700 bg-red-50" :
                                "text-yellow-700 bg-yellow-50"
                              }`}>
                                {event.status === "Approved" ? "Approved" : event.status === "Rejected" ? "Rejected" : "Pending"}
                              </span>
                            </td>
                            <td className="py-2 space-x-1">
                              {event.status === "Pending" ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenApprovedEventModal(event.id, "vaccinationCampaign")}
                                    className="text-green-700 bg-green-50 hover:bg-green-100 text-xs px-2 py-1"
                                    disabled={approving || rejecting}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenRejectEventModal(event.id, "vaccinationCampaign")}
                                    className="text-red-700 bg-red-50 hover:bg-red-100 text-xs px-2 py-1"
                                    disabled={approving || rejecting}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <span className="text-gray-500 text-xs">No actions</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {vaccinationCampaigns.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{vaccinationCampaignStartIndex + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(vaccinationCampaignEndIndex, vaccinationCampaigns.length)}</span> of{" "}
                        <span className="font-medium">{vaccinationCampaigns.length}</span> results for vaccination campaigns
                      </p>
                    </div>
                    <div className="flex gap-4 mb-2">
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
                            className={`px-4 py-1 text-sm font-semibold border ${page === currentVaccinationCampaignsPage ? "bg-indigo-600 text-white" : "text-gray-900 hover:bg-gray-50"}`}
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}