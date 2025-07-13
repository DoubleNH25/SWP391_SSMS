import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MedicalEventViewModel } from "@/types/MedicalEvent";
import {
  FecthApproveRejectMedicalEvent,
  FecthPendingMedicalEvent,
} from "@/services/MedicalEventService";
import { VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import {
  FecthApproveRejectVaccinationCampaign,
  FecthPendingVaccinationCampaign,
} from "@/services/VaccinationCampaignService";
import { FecthClass } from "@/services/SchoolClassService";
import PageHeader from "@/components/ui/PageHeader";
import { ClockAlert, Calendar, AlertCircleIcon } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

type EventType = "medicalEvent" | "vaccinationCampaign";

export default function PendingEventManager() {
  const [medicalEvents, setMedicalEvents] = useState<MedicalEventViewModel[]>(
    []
  );
  const [vaccinationCampaigns, setVaccinationCampaigns] = useState<
    VaccinationCampaignsViewModel[]
  >([]);
  const [loading, setLoading] = useState({
    medicalEvents: true,
    vaccinationCampaigns: true,
  });
  const [error, setError] = useState<{
    medicalEvents: string | null;
    vaccinationCampaigns: string | null;
  }>({
    medicalEvents: null,
    vaccinationCampaigns: null,
  });
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    type: EventType;
  } | null>(null);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [classOptions, setClassOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const totalPendingCount =
    medicalEvents.filter((event) => event.status === "Pending").length +
    vaccinationCampaigns.filter((campaign) => campaign.status === "Pending")
      .length;

  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsVaccinationCampaignsPerPage] = useState(7);
  const [currentVaccinationCampaignsPage] = useState(1);

  const totalMedicalEventPages =
    Math.ceil(medicalEvents.length / itemsPerPage) || 1;
  const medicalEventStartIndex = (currentPage - 1) * itemsPerPage;
  const medicalEventEndIndex = medicalEventStartIndex + itemsPerPage;
  const paginatedMedicalEvents = medicalEvents.slice(
    medicalEventStartIndex,
    medicalEventEndIndex
  );

  const vaccinationCampaignStartIndex =
    (currentVaccinationCampaignsPage - 1) * itemsVaccinationCampaignsPerPage;
  const vaccinationCampaignEndIndex =
    vaccinationCampaignStartIndex + itemsVaccinationCampaignsPerPage;
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
        medicalEvents:
          err instanceof Error && err.message.includes("authenticated")
            ? "Vui lòng đăng nhập để xem sự kiện y tế chờ duyệt."
            : "Không thể tải sự kiện y tế. Vui lòng thử lại.",
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
        vaccinationCampaigns:
          err instanceof Error && err.message.includes("authenticated")
            ? "Vui lòng đăng nhập để xem chiến dịch tiêm chủng chờ duyệt."
            : "Không thể tải chiến dịch tiêm chủng. Vui lòng thử lại.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, vaccinationCampaigns: false }));
    }
  };

  const fetchClassesData = async () => {
    try {
      const classRooms = await FecthClass();
      const options = classRooms.map((classRoom) => ({
        value: classRoom.id,
        label: classRoom.className,
      }));
      setClassOptions(options);
    } catch (err) {
      console.error("Failed to fetch class data:", err);
    }
  };

  const handleConfirmApprovedEvent = async () => {
    if (!selectedEvent) return;
    setApproving(true);
    try {
      if (selectedEvent.type === "medicalEvent") {
        const success = await FecthApproveRejectMedicalEvent(
          selectedEvent.id,
          "approve"
        );
        if (success) {
          setMedicalEvents(
            medicalEvents.filter((event) => event.id !== selectedEvent.id)
          );
          showToast.success("Sự kiện y tế đã được phê duyệt thành công");
        } else {
          throw new Error("Phê duyệt thất bại");
        }
      } else {
        const success = await FecthApproveRejectVaccinationCampaign(
          selectedEvent.id,
          "approve"
        );
        if (success) {
          setVaccinationCampaigns(
            vaccinationCampaigns.filter(
              (event) => event.id !== selectedEvent.id
            )
          );
          showToast.success(
            "Chiến dịch tiêm chủng đã được phê duyệt thành công"
          );
        } else {
          throw new Error("Phê duyệt thất bại");
        }
      }
      setIsApprovedModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      showToast.error(
        `Không thể phê duyệt ${selectedEvent.type}: ${
          err instanceof Error ? err.message : "Lỗi không xác định"
        }`
      );
    } finally {
      setApproving(false);
    }
  };

  const handleConfirmRejectEvent = async () => {
    if (!selectedEvent) return;
    setRejecting(true);
    try {
      if (selectedEvent.type === "medicalEvent") {
        const success = await FecthApproveRejectMedicalEvent(
          selectedEvent.id,
          "reject"
        );
        if (success) {
          setMedicalEvents(
            medicalEvents.filter((event) => event.id !== selectedEvent.id)
          );
          showToast.success("Sự kiện y tế đã được từ chối thành công");
        } else {
          throw new Error("Từ chối thất bại");
        }
      } else {
        const success = await FecthApproveRejectVaccinationCampaign(
          selectedEvent.id,
          "reject"
        );
        if (success) {
          setVaccinationCampaigns(
            vaccinationCampaigns.filter(
              (event) => event.id !== selectedEvent.id
            )
          );
          showToast.success("Chiến dịch tiêm chủng đã được từ chối thành công");
        } else {
          throw new Error("Từ chối thất bại");
        }
      }
      setIsRejectModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      showToast.error(
        `Không thể từ chối ${selectedEvent.type}: ${
          err instanceof Error ? err.message : "Lỗi không xác định"
        }`
      );
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
  const normalizeDate = (date: Date | string) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sự kiện y tế quá hạn
  const overdueMedicalEvents = medicalEvents.filter(
    (event) =>
      event.status === "Pending" && normalizeDate(event.scheduledDate) < today
  );

  // Chiến dịch tiêm chủng quá hạn
  const overdueVaccinationCampaigns = vaccinationCampaigns.filter(
    (campaign) =>
      campaign.status === "Pending" && normalizeDate(campaign.startDate) < today
  );

  const totalOverdueCount =
    overdueMedicalEvents.length + overdueVaccinationCampaigns.length;

  return (
    <div className="p-4 ">
      <PageHeader
        title="Quản lý sự kiện chờ duyệt"
        icon={<ClockAlert className="w-6 h-6 text-orange-600" />}
        description="Quản lý và phê duyệt các sự kiện y tế đang chờ xử lý"
      />
      {loading.medicalEvents || loading.vaccinationCampaigns ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : error.medicalEvents || error.vaccinationCampaigns ? (
        <div
          role="alert"
          className="text-center text-red-500 p-4 bg-red-100 rounded"
        >
          {error.medicalEvents && <p>{error.medicalEvents}</p>}
          {error.vaccinationCampaigns && <p>{error.vaccinationCampaigns}</p>}
          {(error.medicalEvents || error.vaccinationCampaigns) && (
            <button
              onClick={() => {
                if (error.medicalEvents) fetchMedicalEventsData();
                if (error.vaccinationCampaigns) fetchVaccinationCampaignsData();
              }}
              aria-label="Thử lại tải sự kiện chờ duyệt"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          )}
          {(error.medicalEvents?.includes("authenticated") ||
            error.vaccinationCampaigns?.includes("authenticated")) && (
            <button
              onClick={() => (window.location.href = "/login")}
              aria-label="Đăng nhập để xem sự kiện chờ duyệt"
              className="mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đăng nhập
            </button>
          )}
        </div>
      ) : medicalEvents.length === 0 && vaccinationCampaigns.length === 0 ? (
        <div className="text-center text-gray-600">
          Không có sự kiện chờ duyệt
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-end mb-6 right-[56px] top-[115px]">
            <div className="relative">
              {totalPendingCount > 0 ? (
                <div className="absolute top-[-5rem] right-[0rem] w-[24rem] bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl shadow-lg flex items-center gap-3">
                  <AlertCircleIcon className="w-5 h-5 text-red-600" />
                  <p className="text-sm font-medium">
                    Có <span className="font-bold">{totalPendingCount}</span> sự
                    kiện chờ phê duyệt
                    {totalOverdueCount > 0 && (
                      <>
                        {" "}
                        / <span className="font-bold">
                          {totalOverdueCount}
                        </span>{" "}
                        đã quá hạn
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <div className="absolute top-[-5rem] right-[0rem] w-[24rem] z-50 bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-2xl shadow-lg flex items-center gap-3 max-w-xs">
                  <AlertCircleIcon className="w-5 h-5 text-gray-600" />
                  <p className="text-sm font-medium">
                    Không có sự kiện chờ phê duyệt
                  </p>
                </div>
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
                  Xác nhận phê duyệt
                </h2>

                {selectedEvent && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    {selectedEvent.type === "medicalEvent"
                      ? (() => {
                          const event = medicalEvents.find(
                            (e) => e.id === selectedEvent.id
                          );
                          return event ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Tên sự kiện:
                                </span>
                                <span className="text-gray-900 text-right flex-1 ml-4">
                                  {event.name}
                                </span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Mô tả:
                                </span>
                                <span className="text-gray-900 text-right flex-1 ml-4">
                                  {event.description}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Ngày tổ chức:
                                </span>
                                <span className="text-gray-900">
                                  {new Date(
                                    event.scheduledDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Trạng thái:
                                </span>
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {event.status === "Pending"
                                    ? "Chờ duyệt"
                                    : event.status}
                                </span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Lớp:
                                </span>
                                <div className="text-right flex-1 ml-4">
                                  {(() => {
                                    const validClassIds =
                                      event.classIds?.filter(
                                        (id) => id && id.trim() !== ""
                                      ) || [];
                                    return validClassIds.length > 0 ? (
                                      <div className="flex flex-wrap gap-1 justify-end">
                                        {validClassIds.map((classId, index) => {
                                          const classOption = classOptions.find(
                                            (option) => option.value === classId
                                          );
                                          const className = classOption
                                            ? classOption.label
                                            : `Lớp ${classId}`;
                                          return (
                                            <span
                                              key={index}
                                              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                            >
                                              {className}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <span className="text-gray-500 text-sm">
                                        Không có lớp nào
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()
                      : (() => {
                          const campaign = vaccinationCampaigns.find(
                            (c) => c.id === selectedEvent.id
                          );
                          return campaign ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Tên chiến dịch:
                                </span>
                                <span className="text-gray-900 text-right flex-1 ml-4">
                                  {campaign.name}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Tên vắc xin:
                                </span>
                                <span className="text-gray-900">
                                  {campaign.vaccineName}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Loại vắc xin:
                                </span>
                                <span className="text-gray-900">
                                  {campaign.vaccineType}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Ngày bắt đầu:
                                </span>
                                <span className="text-gray-900">
                                  {new Date(
                                    campaign.startDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Ngày hết hạn:
                                </span>
                                <span className="text-gray-900">
                                  {new Date(campaign.exp).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Ngày sản xuất:
                                </span>
                                <span className="text-gray-900">
                                  {new Date(campaign.mfg).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Trạng thái:
                                </span>
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {campaign.status === "Pending"
                                    ? "Chờ duyệt"
                                    : campaign.status}
                                </span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Lớp:
                                </span>
                                <div className="text-right flex-1 ml-4">
                                  {(() => {
                                    const validClassIds =
                                      campaign.classIds?.filter(
                                        (id) => id && id.trim() !== ""
                                      ) || [];
                                    return validClassIds.length > 0 ? (
                                      <div className="flex flex-wrap gap-1 justify-end">
                                        {validClassIds.map((classId, index) => {
                                          const classOption = classOptions.find(
                                            (option) => option.value === classId
                                          );
                                          const className = classOption
                                            ? classOption.label
                                            : `Lớp ${classId}`;
                                          return (
                                            <span
                                              key={index}
                                              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                            >
                                              {className}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <span className="text-gray-500 text-sm">
                                        Không có lớp nào
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                  </div>
                )}

                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn phê duyệt{" "}
                  {selectedEvent?.type === "medicalEvent"
                    ? "sự kiện y tế này"
                    : "chiến dịch tiêm chủng này"}{" "}
                  không?
                </p>

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleCloseApprovedEventModal}
                    className="rounded bg-gray-200 px-6 py-2 text-gray-900 hover:bg-gray-300"
                    disabled={approving}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleConfirmApprovedEvent}
                    className={`rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 ${
                      approving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={approving}
                  >
                    {approving ? "Đang phê duyệt..." : "Phê duyệt"}
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
                  Xác nhận từ chối
                </h2>

                {selectedEvent && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    {selectedEvent.type === "medicalEvent"
                      ? (() => {
                          const event = medicalEvents.find(
                            (e) => e.id === selectedEvent.id
                          );
                          return event ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Tên sự kiện:
                                </span>
                                <span className="text-gray-900 text-right flex-1 ml-4">
                                  {event.name}
                                </span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Mô tả:
                                </span>
                                <span className="text-gray-900 text-right flex-1 ml-4">
                                  {event.description}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Ngày tổ chức:
                                </span>
                                <span className="text-gray-900">
                                  {new Date(
                                    event.scheduledDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Trạng thái:
                                </span>
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {event.status === "Pending"
                                    ? "Chờ duyệt"
                                    : event.status}
                                </span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Lớp:
                                </span>
                                <div className="text-right flex-1 ml-4">
                                  {(() => {
                                    const validClassIds =
                                      event.classIds?.filter(
                                        (id) => id && id.trim() !== ""
                                      ) || [];
                                    return validClassIds.length > 0 ? (
                                      <div className="flex flex-wrap gap-1 justify-end">
                                        {validClassIds.map((classId, index) => {
                                          const classOption = classOptions.find(
                                            (option) => option.value === classId
                                          );
                                          const className = classOption
                                            ? classOption.label
                                            : `Lớp ${classId}`;
                                          return (
                                            <span
                                              key={index}
                                              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                            >
                                              {className}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <span className="text-gray-500 text-sm">
                                        Không có lớp nào
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()
                      : (() => {
                          const campaign = vaccinationCampaigns.find(
                            (c) => c.id === selectedEvent.id
                          );
                          return campaign ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Tên chiến dịch:
                                </span>
                                <span className="text-gray-900 text-right flex-1 ml-4">
                                  {campaign.name}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Tên vắc xin:
                                </span>
                                <span className="text-gray-900">
                                  {campaign.vaccineName}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Loại vắc xin:
                                </span>
                                <span className="text-gray-900">
                                  {campaign.vaccineType}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Ngày bắt đầu:
                                </span>
                                <span className="text-gray-900">
                                  {new Date(
                                    campaign.startDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Ngày hết hạn:
                                </span>
                                <span className="text-gray-900">
                                  {new Date(campaign.exp).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Ngày sản xuất:
                                </span>
                                <span className="text-gray-900">
                                  {new Date(campaign.mfg).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Trạng thái:
                                </span>
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {campaign.status === "Pending"
                                    ? "Chờ duyệt"
                                    : campaign.status}
                                </span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-700">
                                  Lớp:
                                </span>
                                <div className="text-right flex-1 ml-4">
                                  {(() => {
                                    const validClassIds =
                                      campaign.classIds?.filter(
                                        (id) => id && id.trim() !== ""
                                      ) || [];
                                    return validClassIds.length > 0 ? (
                                      <div className="flex flex-wrap gap-1 justify-end">
                                        {validClassIds.map((classId, index) => {
                                          const classOption = classOptions.find(
                                            (option) => option.value === classId
                                          );
                                          const className = classOption
                                            ? classOption.label
                                            : `Lớp ${classId}`;
                                          return (
                                            <span
                                              key={index}
                                              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                            >
                                              {className}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <span className="text-gray-500 text-sm">
                                        Không có lớp nào
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                  </div>
                )}

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        Cảnh báo
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        Bạn có chắc chắn muốn từ chối{" "}
                        {selectedEvent?.type === "medicalEvent"
                          ? "sự kiện y tế này"
                          : "chiến dịch tiêm chủng này"}
                        ? Hành động này không thể hoàn tác.
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
                    Hủy
                  </Button>
                  <Button
                    onClick={handleConfirmRejectEvent}
                    className={`rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700 ${
                      rejecting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={rejecting}
                  >
                    {rejecting ? "Đang từ chối..." : "Từ chối"}
                  </Button>
                </div>
              </div>
            </Modal>
            <div className="h-[28.5rem]">
              <div className="flex flex-col justify-between h-5/6 max-h-5/6 space-y-px">
                <div>
                  {medicalEvents.length === 0 &&
                  vaccinationCampaigns.length === 0 ? (
                    <div className="text-center text-gray-600 mt-5">
                      No pending events available
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 border border-gray-200 rounded-lg">
                      {/* Medical Events */}
                      {paginatedMedicalEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white rounded-xl shadow-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                        >
                          <div className="mb-4 flex justify-between items-start">
                            <div className="w-[66%]">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  Sự kiện y tế
                                </span>
                              </div>
                              <h2 className="text-xl font-semibold text-gray-800">
                                {event.name}
                              </h2>
                              <p className="text-sm mt-2 text-gray-600">
                                {event.description}
                              </p>
                            </div>
                            <span className="px-3 py-1 text-center rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                              Chờ duyệt
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mb-[9rem]">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>
                                Ngày:{" "}
                                {new Date(
                                  event.scheduledDate
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex flex-wrap gap-1.5">
                                {event.classIds
                                  ?.filter((id) => id && id.trim() !== "")
                                  .map((classId, classIndex) => {
                                    const classOption = classOptions.find(
                                      (option) => option.value === classId
                                    );
                                    const className = classOption
                                      ? classOption.label
                                      : `Lớp ${classId}`;
                                    return (
                                      <span
                                        key={classIndex}
                                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                      >
                                        {className}
                                      </span>
                                    );
                                  })}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleOpenApprovedEventModal(
                                    event.id,
                                    "medicalEvent"
                                  )
                                }
                                className="flex-1 text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 shadow-sm hover:shadow-md"
                                disabled={approving || rejecting}
                              >
                                Phê duyệt
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleOpenRejectEventModal(
                                    event.id,
                                    "medicalEvent"
                                  )
                                }
                                className="flex-1 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 shadow-sm hover:shadow-md"
                                disabled={approving || rejecting}
                              >
                                Từ chối
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Vaccination Campaigns */}
                      {paginatedVaccinationCampaigns.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white rounded-xl shadow-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                        >
                          <div className="mb-4 flex justify-between items-start">
                            <div className="w-[66%]">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  Chiến dịch tiêm chủng
                                </span>
                              </div>
                              <h2 className="text-xl font-semibold text-gray-800">
                                {event.name}
                              </h2>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-gray-600">
                                  Vaccine: {event.vaccineName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Loại: {event.vaccineType}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 text-center rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                              Chờ duyệt
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>
                                Ngày:{" "}
                                {new Date(event.startDate).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>
                                Hết hạn:{" "}
                                {new Date(event.exp).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>
                                Sản xuất:{" "}
                                {new Date(event.mfg).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex flex-wrap gap-1.5">
                                {event.classIds
                                  ?.filter((id) => id && id.trim() !== "")
                                  .map((classId, classIndex) => {
                                    const classOption = classOptions.find(
                                      (option) => option.value === classId
                                    );
                                    const className = classOption
                                      ? classOption.label
                                      : `Lớp ${classId}`;
                                    return (
                                      <span
                                        key={classIndex}
                                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                      >
                                        {className}
                                      </span>
                                    );
                                  })}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleOpenApprovedEventModal(
                                    event.id,
                                    "vaccinationCampaign"
                                  )
                                }
                                className="flex-1 text-green-700 bg-green-50 hover:bg-green-100 border hover:text-green-700 border-green-200 shadow-sm hover:shadow-md"
                                disabled={approving || rejecting}
                              >
                                Phê duyệt
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleOpenRejectEventModal(
                                    event.id,
                                    "vaccinationCampaign"
                                  )
                                }
                                className="flex-1 text-red-700 bg-red-50 hover:bg-red-100 border hover:text-red-700 border-red-200 shadow-sm hover:shadow-md"
                                disabled={approving || rejecting}
                              >
                                Từ chối
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {(medicalEvents.length > 0 ||
                  vaccinationCampaigns.length > 0) && (
                  <div className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị từ {medicalEventStartIndex + 1} đến{" "}
                        {Math.min(
                          medicalEventEndIndex,
                          medicalEvents.length + vaccinationCampaigns.length
                        )}{" "}
                        trong tổng số{" "}
                        {medicalEvents.length + vaccinationCampaigns.length} kết
                        quả
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <nav
                        className="flex items-center gap-1"
                        aria-label="Pagination"
                      >
                        <button
                          className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          aria-label="Trang trước"
                        >
                          <svg
                            className="size-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {Array.from(
                          { length: totalMedicalEventPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            className={`px-4 py-1 text-sm font-semibold border ${
                              page === currentPage
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900 hover:bg-gray-50"
                            }`}
                            onClick={() => handlePageChange(page)}
                            aria-current={
                              page === currentPage ? "page" : undefined
                            }
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalMedicalEventPages}
                          aria-label="Trang sau"
                        >
                          <svg
                            className="size-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
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
