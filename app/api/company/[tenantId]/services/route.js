import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";

export async function GET(request, { params }) {
  try {
    const { tenantId } = await params;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Company tenant ID is required" },
        { status: 400 }
      );
    }

    // Categories have been removed from companies
    // Return empty array for backward compatibility
    return NextResponse.json({
      categories: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch company services" },
      { status: 500 }
    );
  }
}
