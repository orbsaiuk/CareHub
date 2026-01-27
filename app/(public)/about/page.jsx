import { HeroSection, ContactInfo, ContactForm } from './_components';

export const metadata = {
    title: 'تواصل معنا | About Us',
    description: 'نحن هنا لمساعدتك تواصل في اي وقت',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <HeroSection />

            {/* Contact Section */}
            <section className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-8">
                    <ContactForm />
                    <ContactInfo />
                </div>
            </section>
        </div>
    );
}
