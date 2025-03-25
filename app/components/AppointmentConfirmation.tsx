import { CheckCircle2, Calendar, Clock, MapPin, User } from "lucide-react";
import { Hospital, Doctor } from "@/types/database";

interface AppointmentConfirmationProps {
  hospital: Hospital;
  doctor: Doctor;
  date: string;
  time: string;
  onBackToHome: () => void;
}

export default function AppointmentConfirmation({
  hospital,
  doctor,
  date,
  time,
  onBackToHome,
}: AppointmentConfirmationProps) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Appointment Confirmed!</h2>
        <p className="text-gray-600 text-center">
          Your appointment has been successfully booked. Please arrive 15 minutes before your scheduled time.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex items-start space-x-3">
          <User className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Doctor Details</h3>
            <p className="text-gray-600">{doctor.name}</p>
            <p className="text-gray-500 text-sm">{doctor.speciality}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Hospital</h3>
            <p className="text-gray-600">{hospital.name}</p>
            <p className="text-gray-500 text-sm">{hospital.location}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Date</h3>
            <p className="text-gray-600">{new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Time</h3>
            <p className="text-gray-600">{time}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onBackToHome}
        className="w-full mt-8 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
} 