import { CalendarEvent, eventCategories } from "@/types/CalendarEvent";
import { MedicalEventUpdateCreateViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsUpdateCreateViewModel } from "@/types/VaccinationCampaigns";
import { toast } from 'react-toastify';

interface DailyScheduleProps {
  selectedDate: string | null;
  events: CalendarEvent[];
  loading: boolean;
  onEventClick: (event: CalendarEvent) => void;
  onOpenModal: () => void;
  onSetFormData: (formData: FormDataType | ((prev: FormDataType) => FormDataType)) => void;
  classOptions: { value: string; label: string }[];
}
type FormDataType =
  | { type: "medical"; data: MedicalEventUpdateCreateViewModel }
  | { type: "vaccination"; data: VaccinationCampaignsUpdateCreateViewModel };

const DailySchedule = ({
  selectedDate,
  events,
  loading,
  onEventClick,
  onOpenModal,
  onSetFormData,
  classOptions
}: DailyScheduleProps) => {
  if (!selectedDate) return null;

  const eventsForDate = events
    .filter(event => {
      const eventDate = new Date(event.start).toDateString();
      const targetDate = new Date(selectedDate).toDateString();
      return eventDate === targetDate;
    })
    .slice()
    .sort((a, b) => {
      const statusPriority = { Approved: 3, Pending: 2, Rejected: 1 };
      const priorityA = statusPriority[a.extendedProps?.calendar] || 0;
      const priorityB = statusPriority[b.extendedProps?.calendar] || 0;

      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }

      // If same status, sort by time
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
  const handleAddEvent = () => {
    const selected = new Date(selectedDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selected < currentDate) {
      toast.error("Cannot create events in the past!");
      return;
    }

    onSetFormData((prev) => {
      const newDate = new Date(selectedDate);
      newDate.setHours(9, 0);

      if (prev.type === "medical") {
        return {
          ...prev,
          data: {
            ...prev.data,
            scheduledDate: newDate.toISOString(),
          } as MedicalEventUpdateCreateViewModel,
        };
      } else {
        return {
          ...prev,
          data: {
            ...prev.data,
            startDate: newDate.toISOString(),
          } as VaccinationCampaignsUpdateCreateViewModel,
        };
      }
    });

    onOpenModal();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Schedule for {new Date(selectedDate).toLocaleDateString()}
        </h3>
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          disabled={loading}
        >
          Add Event
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {eventsForDate.length > 0 ? (
          eventsForDate.map((event) => {
            const category = eventCategories[event.extendedProps.calendar];
            return (
              <div
                key={event.id}
                className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${category.lightColor} ${category.textColor} border-l-4 border-${category.color.split("-")[1]}-500`}
                onClick={() => onEventClick(event)}
              >
                <div className="flex justify-between">
                  <div className="font-medium text-base">{event.title}</div>
                  <div>
                    <span className="text-xs">Type: {event.extendedProps.eventType}</span>
                  </div>
                </div>

                <div className="text-sm mt-1 ml-2">
                  {event.extendedProps.eventType === "medical"
                    ? event.extendedProps.description || "No description"
                    : `Vaccine: ${event.extendedProps.vaccineName || "No vaccine name"}`}
                </div>

                {event.extendedProps.eventType === "vaccination" && (
                  <div className="text-sm">
                    <div className="mt-1 ml-2">Vaccine Type: {event.extendedProps.vaccineType}</div>
                    <div className="mt-1 ml-2">Mfg: {new Date(event.extendedProps.mfg!).toLocaleDateString()}</div>
                    <div className="mt-1 ml-2">Exp: {new Date(event.extendedProps.exp!).toLocaleDateString()}</div>
                  </div>
                )}

                <div className="text-sm mt-1 ml-2">
                  <span>Time:</span> {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm mt-1 ml-2">
                  <span>Class: </span>
                  {(() => {
                    const validClassIds = event.extendedProps.classIds?.filter(id => id && id.trim() !== "") || [];
                    return validClassIds.length > 0 ? (
                      validClassIds.map((classId, index) => {
                        const classOption = classOptions.find(option => option.value === classId);
                        const className = classOption ? classOption.label : `Class ${classId}`;
                        return (
                          <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-2">
                            {className}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-gray-500">
                        No classes assigned
                      </span>
                    );
                  })()}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-sm">No events scheduled for this date.</div>
        )}
      </div>
    </div>
  );
};

export default DailySchedule;
