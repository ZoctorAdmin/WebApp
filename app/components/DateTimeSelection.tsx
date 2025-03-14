import { cn } from "@/lib/utils";

type DateOption = "today" | "tomorrow" | "later";
type TimeSlot = "morning" | "afternoon" | "evening";

interface DateTimeSelectionProps {
  dateOptions: Array<{
    id: DateOption;
    label: string;
    subLabel: string;
  }>;
  timeSlots: Array<{
    id: TimeSlot;
    label: string;
    time: string;
  }>;
  availableTimes: string[];
  selectedDate: DateOption;
  selectedTimeSlot: TimeSlot;
  selectedTime: string;
  onDateSelect: (date: DateOption) => void;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onTimeSelect: (time: string) => void;
  onConfirm: () => void;
}

export default function DateTimeSelection({
  dateOptions,
  timeSlots,
  availableTimes,
  selectedDate,
  selectedTimeSlot,
  selectedTime,
  onDateSelect,
  onTimeSlotSelect,
  onTimeSelect,
  onConfirm,
}: DateTimeSelectionProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Date Selection */}
      <div>
        <h2 className="text-xl text-gray-500 mb-4">Select Date</h2>
        <div className="flex gap-4">
          {dateOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onDateSelect(option.id)}
              className={cn(
                "flex-1 rounded-xl p-4 text-center transition-all",
                selectedDate === option.id
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-500"
              )}
            >
              <div className="font-semibold">{option.label}</div>
              <div className="text-sm opacity-80">{option.subLabel}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <h2 className="text-xl text-gray-500 mb-2">Select Time Slot</h2>
        <div className="flex gap-4">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onTimeSlotSelect(slot.id)}
              className={cn(
                "flex-1 rounded-xl p-4 text-center transition-all",
                selectedTimeSlot === slot.id
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-500"
              )}
            >
              <div className="font-semibold">{slot.label}</div>
              <div className="text-sm opacity-80">{slot.time}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <h2 className="text-xl text-gray-500 mb-4">Select slot</h2>
        <div className="grid grid-cols-3 gap-4">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              className={cn(
                "py-3 px-4 rounded-lg text-center transition-all",
                selectedTime === time
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-500"
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="w-full bg-blue-500 text-white py-4 rounded-xl mt-8 font-semibold"
      >
        Confirm
      </button>
    </div>
  );
} 