import { client } from '@/sanity/lib/serverClient';
import {
    getPatientAppointmentsQuery,
    getDoctorAppointmentsQuery,
    getHospitalAppointmentsQuery,
    getAppointmentByIdQuery,
    getUpcomingPatientAppointmentsQuery,
    getUpcomingDoctorAppointmentsQuery,
    getAppointmentsByDateRangeQuery,
    getAppointmentsByStatusQuery,
    getDoctorAppointmentStatsQuery,
    getHospitalAppointmentStatsQuery,
    checkDoctorAvailabilityQuery,
} from '@/sanity/queries/appointments';

export async function getPatientAppointments(clerkUserId, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getPatientAppointmentsQuery, { clerkUserId, start, end });
    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        return [];
    }
}

export async function getDoctorAppointments(doctorId, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getDoctorAppointmentsQuery, { doctorId, start, end });
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        return [];
    }
}

export async function getHospitalAppointments(hospitalId, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getHospitalAppointmentsQuery, { hospitalId, start, end });
    } catch (error) {
        console.error('Error fetching hospital appointments:', error);
        return [];
    }
}

export async function getAppointmentById(appointmentId) {
    try {
        return await client.fetch(getAppointmentByIdQuery, { appointmentId });
    } catch (error) {
        console.error('Error fetching appointment by ID:', error);
        return null;
    }
}

export async function getUpcomingPatientAppointments(clerkUserId, limit = 5) {
    try {
        return await client.fetch(getUpcomingPatientAppointmentsQuery, { clerkUserId, limit });
    } catch (error) {
        console.error('Error fetching upcoming patient appointments:', error);
        return [];
    }
}

export async function getUpcomingDoctorAppointments(doctorId, limit = 10) {
    try {
        return await client.fetch(getUpcomingDoctorAppointmentsQuery, { doctorId, limit });
    } catch (error) {
        console.error('Error fetching upcoming doctor appointments:', error);
        return [];
    }
}

export async function getAppointmentsByDateRange(startDate, endDate, doctorId = null, hospitalId = null) {
    try {
        return await client.fetch(getAppointmentsByDateRangeQuery, {
            startDate,
            endDate,
            doctorId,
            hospitalId,
        });
    } catch (error) {
        console.error('Error fetching appointments by date range:', error);
        return [];
    }
}

export async function getAppointmentsByStatus(status, doctorId = null, patientId = null, page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;

    try {
        return await client.fetch(getAppointmentsByStatusQuery, {
            status,
            doctorId,
            patientId,
            start,
            end,
        });
    } catch (error) {
        console.error('Error fetching appointments by status:', error);
        return [];
    }
}

export async function getDoctorAppointmentStats(doctorId) {
    try {
        return await client.fetch(getDoctorAppointmentStatsQuery, { doctorId });
    } catch (error) {
        console.error('Error fetching doctor appointment stats:', error);
        return null;
    }
}

export async function getHospitalAppointmentStats(hospitalId) {
    try {
        return await client.fetch(getHospitalAppointmentStatsQuery, { hospitalId });
    } catch (error) {
        console.error('Error fetching hospital appointment stats:', error);
        return null;
    }
}

export async function checkDoctorAvailability(doctorId, appointmentDate) {
    try {
        return await client.fetch(checkDoctorAvailabilityQuery, { doctorId, appointmentDate });
    } catch (error) {
        console.error('Error checking doctor availability:', error);
        return false;
    }
}

export async function createAppointment(appointmentData) {
    try {
        // Generate appointment number
        const appointmentNumber = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        return await client.create({
            _type: 'appointment',
            appointmentNumber,
            ...appointmentData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

export async function updateAppointment(appointmentId, updates) {
    try {
        return await client
            .patch(appointmentId)
            .set({
                ...updates,
                updatedAt: new Date().toISOString(),
            })
            .commit();
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
}

export async function cancelAppointment(appointmentId, cancellationReason) {
    try {
        return await client
            .patch(appointmentId)
            .set({
                status: 'cancelled',
                cancellationReason,
                updatedAt: new Date().toISOString(),
            })
            .commit();
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw error;
    }
}

export async function confirmAppointment(appointmentId) {
    try {
        return await client
            .patch(appointmentId)
            .set({
                status: 'confirmed',
                updatedAt: new Date().toISOString(),
            })
            .commit();
    } catch (error) {
        console.error('Error confirming appointment:', error);
        throw error;
    }
}

export async function completeAppointment(appointmentId, doctorNotes, prescription = []) {
    try {
        return await client
            .patch(appointmentId)
            .set({
                status: 'completed',
                doctorNotes,
                prescription,
                updatedAt: new Date().toISOString(),
            })
            .commit();
    } catch (error) {
        console.error('Error completing appointment:', error);
        throw error;
    }
}
