'use client';

import { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="text-right">
                    <label htmlFor="name" className="block text-gray-700 text-lg font-medium mb-2">
                        الاسم الكامل
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="نور علي"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                        required
                    />
                </div>

                {/* Email */}
                <div className="text-right">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        البريد الإلكتروني
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nour Air123@gmail.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                        required
                    />
                </div>

                {/* Phone */}
                <div className="text-right">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                        رقم الجوال
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+966 50 123 4567"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        dir="rtl"
                        required
                    />
                </div>

                {/* Message */}
                <div className="text-right">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                        الرسالة
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        dir="rtl"
                        required
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-4 rounded-lg transition-colors duration-200"
                >
                    إرسال رسالة
                </button>
            </form>
        </div>
    );
}
