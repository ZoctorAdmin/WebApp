"use client";

import { useState } from "react";
import { ArrowLeft, X, Building2, Stethoscope, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import HospitalSelection from "./components/HospitalSelection";
import DoctorSelection from "./components/DoctorSelection";
import DateTimeSelection from "./components/DateTimeSelection";

type Step = "hospital" | "doctor" | "datetime";
type TimeSlot = "morning" | "afternoon" | "evening";
type DateOption = "today" | "tomorrow" | "later";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("hospital");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateOption>("today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>("morning");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const hospitals = [
    {
      name: "KIMST Hospital",
      location: "Talap, Kannur, Kerala",
      status: "24 hours open"
    },
    {
      name: "Sreechand Speciality Hospital",
      location: "Payyambalam, Kannur, Kerala",
      status: "24 hours open"
    },
    {
      name: "Fathima Hospital Kannur",
      location: "Talap, Kannur, Kerala",
      status: "24 hours open"
    },
    {
      name: "AKG Memorial Cooperative Hospital",
      location: "Talap, Kannur, Kerala",
      status: "24 hours open"
    }
  ];

  const doctors = [
    {
      name: "Dr. Erick Kuhlman",
      specialization: "Neurologist",
      fee: "₹ 300"
    },
    {
      name: "Dr. Archer Lavander",
      specialization: "Dermatologist",
      fee: "₹ 500"
    },
    {
      name: "Dr. Verna Herzberg",
      specialization: "Gynaecologist",
      fee: "₹ 350"
    },
    {
      name: "Dr. Jaime Ditto",
      specialization: "Pulmonologist",
      fee: "₹ 300"
    }
  ];

  const dateOptions: Array<{ id: DateOption; label: string; subLabel: string }> = [
    { id: "today", label: "Today", subLabel: "Available" },
    { id: "tomorrow", label: "Tomorrow", subLabel: "Available" },
    { id: "later", label: "24 Jan", subLabel: "Available" }
  ];

  const timeSlots: Array<{ id: TimeSlot; label: string; time: string }> = [
    { id: "morning", label: "Morning", time: "8 AM - 12 PM" },
    { id: "afternoon", label: "Afternoon", time: "12 PM - 3 PM" },
    { id: "evening", label: "Evening", time: "3 PM - 8 PM" }
  ];

  const availableTimes = [
    "09.00 AM",
    "09.30 AM",
    "10.00 AM",
    "10.30 AM",
    "11.00 AM",
    "11.30 AM"
  ];

  const handleHospitalSelect = (hospitalName: string) => {
    setSelectedHospital(hospitalName);
    setCurrentStep("doctor");
  };

  const handleDoctorSelect = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    setCurrentStep("datetime");
  };

  const handleBack = () => {
    if (currentStep === "doctor") {
      setCurrentStep("hospital");
    } else if (currentStep === "datetime") {
      setCurrentStep("doctor");
    }
  };

  const handleConfirm = () => {
    // Handle the confirmation logic here
    console.log("Appointment confirmed!");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <button onClick={handleBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">
          {currentStep === "hospital" && "Doctor's appointment"}
          {currentStep === "doctor" && selectedHospital}
          {currentStep === "datetime" && selectedDoctor}
        </h1>
        <X className="w-6 h-6" />
      </div>

      {/* Progress Steps */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-[60px] right-[60px] h-[2px] bg-blue-500" />
          <div className="flex flex-col items-center gap-2 z-10">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              currentStep === "hospital" ? "bg-blue-500" : "bg-gray-200"
            )}>
              <Building2 className={cn("w-6 h-6", currentStep === "hospital" ? "text-white" : "text-gray-500")} />
            </div>
            <span className={currentStep === "hospital" ? "text-blue-500" : "text-gray-500"}>Hospital</span>
          </div>
          <div className="flex flex-col items-center gap-2 z-10">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              currentStep === "doctor" ? "bg-blue-500" : "bg-gray-200"
            )}>
              <Stethoscope className={cn("w-6 h-6", currentStep === "doctor" ? "text-white" : "text-gray-500")} />
            </div>
            <span className={currentStep === "doctor" ? "text-blue-500" : "text-gray-500"}>Doctor</span>
          </div>
          <div className="flex flex-col items-center gap-2 z-10">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              currentStep === "datetime" ? "bg-blue-500" : "bg-gray-200"
            )}>
              <Calendar className={cn("w-6 h-6", currentStep === "datetime" ? "text-white" : "text-gray-500")} />
            </div>
            <span className={currentStep === "datetime" ? "text-blue-500" : "text-gray-500"}>Date and time</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === "hospital" && (
        <HospitalSelection
          hospitals={hospitals}
          selectedHospital={selectedHospital}
          searchQuery={searchQuery}
          onHospitalSelect={handleHospitalSelect}
          onSearchChange={setSearchQuery}
        />
      )}

      {currentStep === "doctor" && (
        <DoctorSelection
          doctors={doctors}
          selectedDoctor={selectedDoctor}
          searchQuery={searchQuery}
          onDoctorSelect={handleDoctorSelect}
          onSearchChange={setSearchQuery}
        />
      )}

      {currentStep === "datetime" && (
        <DateTimeSelection
          dateOptions={dateOptions}
          timeSlots={timeSlots}
          availableTimes={availableTimes}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          selectedTime={selectedTime}
          onDateSelect={setSelectedDate}
          onTimeSlotSelect={setSelectedTimeSlot}
          onTimeSelect={setSelectedTime}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
