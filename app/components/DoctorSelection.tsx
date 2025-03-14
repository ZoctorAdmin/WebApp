import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Doctor {
  name: string;
  specialization: string;
  fee: string;
}

interface DoctorSelectionProps {
  doctors: Doctor[];
  selectedDoctor: string;
  searchQuery: string;
  onDoctorSelect: (doctorName: string) => void;
  onSearchChange: (query: string) => void;
}

export default function DoctorSelection({
  doctors,
  selectedDoctor,
  searchQuery,
  onDoctorSelect,
  onSearchChange,
}: DoctorSelectionProps) {
  return (
    <>
      {/* Doctor Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by doctors name or specialisation"
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Doctor List */}
      <div className="p-4 space-y-4">
        {doctors.map((doctor) => (
          <button
            key={doctor.name}
            onClick={() => onDoctorSelect(doctor.name)}
            className={cn(
              "w-full p-4 rounded-lg border text-left transition-all",
              selectedDoctor === doctor.name
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            )}
          >
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <p className="text-gray-500 mt-1">{doctor.specialization}</p>
            <p className="text-blue-500 font-semibold mt-2">{doctor.fee}</p>
          </button>
        ))}
      </div>
    </>
  );
} 