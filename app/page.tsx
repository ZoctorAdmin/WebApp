"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, X, Building2, Stethoscope, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import HospitalSelection from "./components/HospitalSelection";
import DoctorSelection from "./components/DoctorSelection";
import DateTimeSelection from "./components/DateTimeSelection";
import AppointmentConfirmation from "./components/AppointmentConfirmation";
import { getHospitals, getDoctors, createAppointment, getAvailableTimeSlots } from "@/lib/services";
import { testConnection } from "@/lib/supabase";
import { Hospital, Doctor } from "@/types/database";
import toast, { Toaster } from 'react-hot-toast';

type Step = "hospital" | "doctor" | "datetime" | "confirmation";
type TimeSlot = "morning" | "afternoon" | "evening";
type DateOption = "today" | "tomorrow" | "later";

interface DateOptionType {
  id: DateOption;
  label: string;
  subLabel: string;
}

interface TimeSlotType {
  id: TimeSlot;
  label: string;
  time: string;
}

const getDynamicDateOptions = (): DateOptionType[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const later = new Date(today);
  later.setDate(later.getDate() + 2);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return [
    {
      id: "today",
      label: "Today",
      subLabel: formatDate(today)
    },
    {
      id: "tomorrow",
      label: "Tomorrow",
      subLabel: formatDate(tomorrow)
    },
    {
      id: "later",
      label: formatDate(later),
      subLabel: "Available"
    }
  ];
};

const getTimeSlots = (): TimeSlotType[] => {
  const currentHour = new Date().getHours();

  // If it's past 8 PM, show only next day slots
  if (currentHour >= 20) {
    return [
      { id: "morning", label: "Morning", time: "8 AM - 12 PM" },
      { id: "afternoon", label: "Afternoon", time: "12 PM - 3 PM" },
      { id: "evening", label: "Evening", time: "3 PM - 8 PM" }
    ];
  }

  // If it's past 3 PM, show only evening slots
  if (currentHour >= 15) {
    return [
      { id: "evening", label: "Evening", time: "3 PM - 8 PM" }
    ];
  }

  // If it's past 12 PM, show afternoon and evening slots
  if (currentHour >= 12) {
    return [
      { id: "afternoon", label: "Afternoon", time: "12 PM - 3 PM" },
      { id: "evening", label: "Evening", time: "3 PM - 8 PM" }
    ];
  }

  // If it's past 8 AM, show remaining morning slots and later slots
  if (currentHour >= 8) {
    return [
      { id: "morning", label: "Morning", time: `${currentHour + 1} AM - 12 PM` },
      { id: "afternoon", label: "Afternoon", time: "12 PM - 3 PM" },
      { id: "evening", label: "Evening", time: "3 PM - 8 PM" }
    ];
  }

  // Before 8 AM, show all slots
  return [
    { id: "morning", label: "Morning", time: "8 AM - 12 PM" },
    { id: "afternoon", label: "Afternoon", time: "12 PM - 3 PM" },
    { id: "evening", label: "Evening", time: "3 PM - 8 PM" }
  ];
};

const generateTimeSlots = (timeSlot: TimeSlot): string[] => {
  switch (timeSlot) {
    case "morning":
      return [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM"
      ];
    case "afternoon":
      return [
        "12:00 PM",
        "12:30 PM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM"
      ];
    case "evening":
      return [
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
        "04:30 PM",
        "05:00 PM",
        "05:30 PM"
      ];
    default:
      return [];
  }
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("hospital");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateOption>("today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>("morning");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateOptions, setDateOptions] = useState<DateOptionType[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const isConnected = await testConnection();
        if (!isConnected) {
          setError("Failed to connect to database");
          return;
        }
        await fetchHospitals();
      } catch (err) {
        setError("Failed to initialize application");
        console.error("Initialization error:", err);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      fetchDoctors(selectedHospital.hospital_id);
    }
  }, [selectedHospital]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    setDateOptions(getDynamicDateOptions());
    setTimeSlots(getTimeSlots());
  }, []);

  useEffect(() => {
    if (selectedTimeSlot) {
      const times = generateTimeSlots(selectedTimeSlot);
      setAvailableTimes(times);
    }
  }, [selectedTimeSlot]);

  const fetchHospitals = async () => {
    try {
      const data = await getHospitals();
      setHospitals(data);
      setLoading(false);
    } catch (err) {
      console.log("Error ==>",JSON.stringify(err));
      setError("Failed to fetch hospitals");
      setLoading(false);
    }
  };

  const fetchDoctors = async (hospitalId: string) => {
    try {
      const data = await getDoctors(hospitalId);
      setDoctors(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch doctors");
      setLoading(false);
    }
  };

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDoctor) return;
    try {
      const date = getDateFromOption(selectedDate);
      // const data = await getAvailableTimeSlots(selectedDoctor.id, date);
      // setAvailableTimes(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch available time slots");
      setLoading(false);
    }
  };

  const getDateFromOption = (option: DateOption): string => {
    const today = new Date();
    switch (option) {
      case "today":
        return today.toISOString().split('T')[0];
      case "tomorrow":
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
      case "later":
        today.setDate(today.getDate() + 2);
        return today.toISOString().split('T')[0];
      default:
        return today.toISOString().split('T')[0];
    }
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setCurrentStep("doctor");
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep("datetime");
  };

  const handleBack = () => {
    if (currentStep === "doctor") {
      setCurrentStep("hospital");
      setSelectedDoctor(null);
    } else if (currentStep === "datetime") {
      setCurrentStep("doctor");
    }
  };

  const handleConfirm = async () => {
    if (!selectedHospital || !selectedDoctor || !selectedTime) return;

    try {
      const appointment = {
        patient_id: 13,
        appointment_id: Math.floor((Math.random() * 1000) + 1),
        hospital_id: selectedHospital.id,
        doctor_id: selectedDoctor.id,
        appointment_date: getDateFromOption(selectedDate).toString(),
        appointment_time: selectedTime.toString(),
      };

      await createAppointment(appointment);
      toast.success('Appointment booked successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
      });
      setCurrentStep("confirmation");
    } catch (err) {
      toast.error('Failed to book appointment. Please try again.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
      setError("Failed to create appointment");
    }
  };

  const handleBackToHome = () => {
    setCurrentStep("hospital");
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setSelectedTime("");
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setSelectedTime(""); // Reset selected time when changing time slot
    const times = generateTimeSlots(slot);
    setAvailableTimes(times);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <Toaster />
      {currentStep !== "confirmation" && (
        <>
          {/* Header */}
          <div className="border-b p-4 flex items-center justify-between">
            <button onClick={handleBack}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">
              {currentStep === "hospital" && "Doctor's appointment"}
              {currentStep === "doctor" && selectedHospital?.name}
              {currentStep === "datetime" && selectedDoctor?.name}
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
        </>
      )}

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
          onTimeSlotSelect={handleTimeSlotSelect}
          onTimeSelect={setSelectedTime}
          onConfirm={handleConfirm}
        />
      )}

      {currentStep === "confirmation" && selectedHospital && selectedDoctor && (
        <AppointmentConfirmation
          hospital={selectedHospital}
          doctor={selectedDoctor}
          date={getDateFromOption(selectedDate)}
          time={selectedTime}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}
