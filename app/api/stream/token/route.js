import { auth } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        const apiSecret = process.env.STREAM_API_SECRET;

        if (!apiKey || !apiSecret) {
            return NextResponse.json(
                { error: "Stream credentials not configured" },
                { status: 500 }
            );
        }

        const serverClient = StreamChat.getInstance(apiKey, apiSecret);

        // Generate token for the user
        const token = serverClient.createToken(userId);

        return NextResponse.json({ token, userId, apiKey });
    } catch (error) {
        console.error("Error generating Stream token:", error);
        return NextResponse.json(
            { error: "Failed to generate token" },
            { status: 500 }
        );
    }
}
