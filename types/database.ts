export interface Hospital {
  id: number;
  hospital_id: string;
  name: string;
  location: string;
  status: string;
  created_at: string;
  email_id: string;
  city: string;
  state: string;
  addrees: string;
  pincode: string;
  poc_number: string;
  contact_no: string;
  
}

export interface Doctor {
  id: number;
  name: string;
  qualification: string;
  consultation_fee: string;
  hospital_id: string;
  created_at: string;
  speciality: string;
}

export interface Appointment {
  id: number;
  hospital_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  created_at: string;
} 