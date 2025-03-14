import { Building2, MapPin, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Hospital {
  name: string;
  location: string;
  status: string;
}

interface HospitalSelectionProps {
  hospitals: Hospital[];
  selectedHospital: string;
  searchQuery: string;
  onHospitalSelect: (hospitalName: string) => void;
  onSearchChange: (query: string) => void;
}

export default function HospitalSelection({
  hospitals,
  selectedHospital,
  searchQuery,
  onHospitalSelect,
  onSearchChange,
}: HospitalSelectionProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by hospital name"
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Hospital List */}
      <div className="p-4 space-y-4">
        {hospitals.map((hospital) => (
          <button
            key={hospital.name}
            onClick={() => onHospitalSelect(hospital.name)}
            className={cn(
              "w-full p-4 rounded-lg border text-left transition-all",
              selectedHospital === hospital.name
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            )}
          >
            <h3 className="font-semibold text-lg">{hospital.name}</h3>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{hospital.location}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-500 mt-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{hospital.status}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
} 