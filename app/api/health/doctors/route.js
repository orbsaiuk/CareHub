import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
    getDoctors,
    searchDoctors,
    getFilteredDoctors,
    upsertDoctor,
} from '@/services/sanity/doctors';

/**
 * GET /api/health/doctors
 * Get doctors with optional filters and search
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const search = searchParams.get('search');
        const specialtyId = searchParams.get('specialtyId');
        const hospitalId = searchParams.get('hospitalId');
        const minFee = searchParams.get('minFee') ? parseInt(searchParams.get('minFee')) : null;
        const maxFee = searchParams.get('maxFee') ? parseInt(searchParams.get('maxFee')) : null;

        let result;

        // Search query
        if (search) {
            const doctors = await searchDoctors(search, limit);
            result = {
                doctors,
                total: doctors.length,
                page: 1,
                limit,
                totalPages: 1,
            };
        }
        // Filtered query
        else if (specialtyId || hospitalId || minFee || maxFee) {
            const doctors = await getFilteredDoctors(
                { specialtyId, hospitalId, minFee, maxFee },
                page,
                limit
            );
            result = {
                doctors,
                total: doctors.length,
                page,
                limit,
                totalPages: Math.ceil(doctors.length / limit),
            };
        }
        // Default query
        else {
            result = await getDoctors(page, limit);
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in GET /api/health/doctors:', error);
        return NextResponse.json(
            { error: 'Failed to fetch doctors' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/health/doctors
 * Create or update doctor profile (authenticated)
 */
export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Add clerk user ID to the data
        const doctorData = {
            ...body,
            clerkUserId: userId,
        };

        const doctor = await upsertDoctor(doctorData);

        return NextResponse.json(doctor, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/health/doctors:', error);
        return NextResponse.json(
            { error: 'Failed to create/update doctor' },
            { status: 500 }
        );
    }
}
