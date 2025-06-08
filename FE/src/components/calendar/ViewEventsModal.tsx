import { CalendarEvent, eventCategories } from "@/types/CalendarEvent";
import { MedicalEventUpdateCreateViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsUpdateCreateViewModel } from "@/types/VaccinationCampaigns";
import { toast } from 'react-toastify';

interface ViewEventsModalProps {
  viewEventsDate: string | null;
  events: CalendarEvent[];
  loading: boolean;
  onEventClick: (event: CalendarEvent) => void;
  onClose: () => void;
  onAddNewEvent: () => void;
  onSetFormData: (formData: any) => void;
  classOptions: { value: string; label: string }[];
}

const ViewEventsModal = ({ 
  viewEventsDate, 
  events, 
  loading, 
  onEventClick, 
  onClose, 
  onAddNewEvent,
  onSetFormData,
  classOptions 
}: ViewEventsModalProps) => {
  if (!viewEventsDate) return null;

  const eventsForDate = events
    .filter(event => {
      const eventDate = new Date(event.start).toDateString();
      const targetDate = new Date(viewEventsDate).toDateString();
      return eventDate === targetDate;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const handleAddNewEvent = () => {
    const viewDate = new Date(viewEventsDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    if (viewDate < currentDate) {
      toast.error("Cannot create events in the past!");
      return;
    }
    
    onSetFormData((prev: any) => {
      const newDate = new Date(viewEventsDate);
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
    
    onAddNewEvent();
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Schedule for {new Date(viewEventsDate).toLocaleDateString()}
      </h3>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {eventsForDate.length > 0 ? (
          eventsForDate.map((event) => {
            const category = eventCategories[event.extendedProps.calendar] || eventCategories.Pending;
            return (
              <div
                key={event.id}
                className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${category.lightColor} ${category.textColor} border-l-4 border-${category.color.split("-")[1]}-500`}
                onClick={() => onEventClick(event)}
              >
                <div className="flex justify-between">
                  <div className="font-medium text-base">{event.title}</div>
                  <div>
                    <span className="text-sm">Type: {event.extendedProps.eventType}</span>
                  </div>
                </div>
                
                <div className="text-sm ml-2">
                  {event.extendedProps.eventType === "medical"
                    ? event.extendedProps.description || "No description"
                    : `Vaccine: ${event.extendedProps.vaccineName || "No vaccine name"}`}
                </div>
                
                {event.extendedProps.eventType === "vaccination" && (
                  <div className="text-sm mt-1 ml-2">
                    <div className="mt-1">Type: {event.extendedProps.vaccineType}</div>
                    <div className="mt-1">Mfg: {new Date(event.extendedProps.mfg!).toLocaleDateString()}</div>
                    <div className="mt-1">Exp: {new Date(event.extendedProps.exp!).toLocaleDateString()}</div>
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
      
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleAddNewEvent}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          disabled={loading}
        >
          Add New Event
        </button>
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewEventsModal;
