"use client";

import {
    UserButton as ClerkUserButton,
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton
} from "@clerk/nextjs";
import { Button } from "../ui/button";

export function UserButton() {
    return (
        <>
            <SignedIn>
                <ClerkUserButton
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-8"
                        }
                    }}
                />
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button size="sm" className="bg-primary text-white">
                        تسجيل الدخول
                    </Button>
                </SignInButton>

            </SignedOut>
        </>
    );
}
