import React from 'react';
import ChatContainer from '@/components/chat/ChatContainer';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'المحادثات | CareHub',
    description: 'تواصل مع أطبائك مباشرة وبشكل آمن',
};

export default async function MessagingPage({ searchParams }) {
    const { userId } = await auth();
    const { doctor, name } = await searchParams;

    if (!userId) {
        redirect('/sign-in');
    }

    return (
        <div className="bg-gray-50/50 min-h-[calc(100-screen-80px)] py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">مركز المحادثات</h1>
                        <p className="text-gray-600">تحدث مع أطبائك واحصل على الاستشارات الطبية بشكل فوري وآمن</p>
                    </div>

                    <ChatContainer 
                        targetUserId={doctor} 
                        doctorName={name ? decodeURIComponent(name) : null} 
                    />
                </div>
            </div>
        </div>
    );
}
