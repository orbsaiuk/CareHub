import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/serverClient';

export async function GET() {
    try {
        // Fetch all hospitals
        const hospitals = await writeClient.fetch(`
            *[_type == "hospital"] {
                _id,
                name,
                "slug": slug.current,
                isActive
            }
        `);

        return NextResponse.json({
            success: true,
            count: hospitals.length,
            hospitals
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
