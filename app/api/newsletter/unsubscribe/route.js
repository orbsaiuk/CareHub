import { NextResponse } from "next/server";
import { unsubscribeFromNewsletter } from "@/services/sanity/newsletter";

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "الرجاء إدخال بريد إلكتروني صحيح",
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "صيغة البريد الإلكتروني غير صحيحة",
        },
        { status: 400 }
      );
    }

    // Unsubscribe from newsletter
    const result = await unsubscribeFromNewsletter(email);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Newsletter unsubscribe API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ في الخادم. الرجاء المحاولة مرة أخرى",
      },
      { status: 500 }
    );
  }
}
