import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection({ bio }) {
    return (
        <Card className="shadow-md border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">نبذة عن الطبيب</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{bio}</p>
            </CardContent>
        </Card>
    );
}
