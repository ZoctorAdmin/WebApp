import { supabase } from './supabase';
import { Hospital, Doctor, Appointment } from '@/types/database';

export const getHospitals = async () => {
  try {
    const { data, error } = await supabase
      .from('hospital')
      .select('*')

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Fetched hospitals:', data);
    return data as Hospital[];
  } catch (error) {
    console.error('Error in getHospitals:', error);
    throw error;
  }
};

export const getDoctors = async (hospitalId: string) => {
  try {
    console.log("Hospital ID ==>",hospitalId);
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('hospital_id', hospitalId)
      .order('name');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Fetched doctors:', data);
    return data as Doctor[];
  } catch (error) {
    console.error('Error in getDoctors:', error);
    throw error;
  }
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Created appointment:', data);
    return data as Appointment;
  } catch (error) {
    console.error('Error in createAppointment:', error);
    throw error;
  }
};

export const getAvailableTimeSlots = async (doctorId: number, date: string) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Fetched time slots:', data);
    return data.map(apt => apt.appointment_time);
  } catch (error) {
    console.error('Error in getAvailableTimeSlots:', error);
    throw error;
  }
}; 