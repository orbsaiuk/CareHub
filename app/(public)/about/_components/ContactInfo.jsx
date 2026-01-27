import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactInfoCard from './ContactInfoCard';

export default function ContactInfo() {
    return (
        <div className="space-y-6">
            {/* Address Card */}
            <ContactInfoCard title="العنوان" icon={MapPin}>
                <p>
                    الرياض، المملكة العربية السعودية
                    <br />
                    شارع الملك فهد، برج المملكة
                </p>
            </ContactInfoCard>

            {/* Phone Card */}
            <ContactInfoCard title="الهاتف" icon={Phone}>
                <p className="space-y-1">
                    <span className="block">+966 50 000 0000</span>
                    <span className="block">+966 11 000 0000</span>
                </p>
            </ContactInfoCard>

            {/* Email Card */}
            <ContactInfoCard title="البريد الإلكتروني" icon={Mail}>
                <p className="space-y-1">
                    <span className="block">info@sehetak.com</span>
                    <span className="block">support@sehetak.com</span>
                </p>
            </ContactInfoCard>

            {/* Working Hours Card */}
            <ContactInfoCard title="ساعات العمل" icon={Clock}>
                <p>
                    السبت - الخميس: 8 صباحاً - 10 مساءً
                    <br />
                    الجمعة: 4 مساءً - 10 مساءً
                </p>
            </ContactInfoCard>
        </div>
    );
}
