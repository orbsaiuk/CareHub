import { Card, CardContent } from "@/components/ui/card";

export default function QualificationsSection({ qualifications }) {
    if (!qualifications || qualifications.length === 0) {
        return null;
    }

    return (
        <Card className="shadow-md border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-right">المؤهلات العلمية</h2>
                <ul className="space-y-3 text-right list-disc list-inside">
                    {qualifications.map((qual, index) => (
                        <li key={qual._key || index} className="text-gray-600 text-lg">
                            {typeof qual === 'string'
                                ? qual
                                : `${qual.degree} - ${qual.institution}${qual.year ? ` (${qual.year})` : ''}`
                            }
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
