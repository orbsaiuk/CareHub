"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
    useEffect(() => {
        const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

        if (!clarityId) {
            console.warn("Clarity: Project ID not found");
            return;
        }

        Clarity.init(clarityId);
    }, []);

    return null;
}
