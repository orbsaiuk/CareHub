import { NextResponse } from 'next/server';
import { getDoctorBySlug } from '@/services/sanity/doctors';

export async function GET(request, { params }) {
    try {
        const { slug } = params;

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }

        const doctor = await getDoctorBySlug(slug);

        if (!doctor) {
            return NextResponse.json(
                { error: 'Doctor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(doctor);
    } catch (error) {
        console.error('Error in GET /api/health/doctors/[slug]:', error);
        return NextResponse.json(
            { error: 'Failed to fetch doctor' },
            { status: 500 }
        );
    }
}
