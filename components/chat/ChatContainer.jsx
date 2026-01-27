'use client';

import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
    Chat,
    Channel,
    ChannelHeader,
    MessageInput,
    MessageList,
    Window,
    LoadingIndicator,
    ChannelList,
    Thread,
} from 'stream-chat-react';
import { useUser } from '@clerk/nextjs';

// Styles
import 'stream-chat-react/dist/css/v2/index.css';
import './chat.css';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function ChatContainer({ targetUserId, doctorName }) {
    const { user, isLoaded } = useUser();
    const [client, setClient] = useState(null);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        if (!isLoaded || !user) return;

        let chatClient;

        const initChat = async () => {
            try {
                chatClient = StreamChat.getInstance(apiKey);

                // Fetch token from our API
                const response = await fetch('/api/stream/token');
                const data = await response.json();

                if (!data.token) {
                    console.error("No token received from API");
                    return;
                }

                await chatClient.connectUser(
                    {
                        id: user.id,
                        name: user.fullName || user.firstName || user.username || 'User',
                        image: user.imageUrl,
                    },
                    data.token
                );

                setClient(chatClient);

                // If a targetUserId is provided (e.g. from doctor profile), create a channel
                if (targetUserId && targetUserId !== user.id) {
                    const newChannel = chatClient.channel('messaging', {
                        members: [user.id, targetUserId],
                        name: doctorName ? `Chat with ${doctorName}` : 'Consultation',
                    });

                    await newChannel.watch();
                    setChannel(newChannel);
                }
            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        };

        initChat();

        return () => {
            if (chatClient) {
                chatClient.disconnectUser();
            }
        };
    }, [user, isLoaded, targetUserId, doctorName]);

    if (!isLoaded || !client) {
        return (
            <div className="flex items-center justify-center h-[600px] bg-white rounded-xl shadow-sm border">
                <LoadingIndicator size={40} />
            </div>
        );
    }

    const filters = { members: { $in: [user.id] }, type: 'messaging' };
    const sort = { last_message_at: -1 };
    const options = { limit: 10 };

    return (
        <div className="chat-container-wrapper h-[700px] shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
            <Chat client={client} theme="messaging light">
                <div className="flex h-full">
                    {/* Sidebar: Channel List */}
                    <div className="w-1/3 border-l border-gray-100 bg-white overflow-y-auto">
                        <ChannelList
                            filters={filters}
                            sort={sort}
                            options={options}
                            showChannelSearch
                            onSelect={(c) => setChannel(c)}
                        />
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 bg-gray-50 flex flex-col relative">
                        {channel ? (
                            <Channel channel={channel}>
                                <Window>
                                    <ChannelHeader />
                                    <MessageList />
                                    <MessageInput focus />
                                </Window>
                                <Thread />
                            </Channel>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">مرحباً بك في نظام المحادثات</h3>
                                <p>اختر محادثة من القائمة الجانبية أو ابدأ محادثة جديدة مع أحد الأطباء</p>
                            </div>
                        )}
                    </div>
                </div>
            </Chat>
        </div>
    );
}
