import { Card, CardContent } from "@/components/ui/card";
import { FaStar } from "react-icons/fa";

export default function ReviewsSection({ reviews = [] }) {
    // Mock reviews if none provided
    const mockReviews = [
        {
            id: 1,
            name: "محمد أحمد",
            date: "منذ 3 أيام",
            rating: 5,
            comment: "دكتور ممتاز وخبرة عالية، شرح كل شيء بالتفصيل وتعامله جيداً"
        },
        {
            id: 2,
            name: "محمد أحمد",
            date: "منذ 3 أيام",
            rating: 5,
            comment: "دكتور ممتاز وخبرة عالية، شرح كل شيء بالتفصيل وتعامله جيداً"
        },
        {
            id: 3,
            name: "محمد أحمد",
            date: "منذ 3 أيام",
            rating: 5,
            comment: "دكتور ممتاز وخبرة عالية، شرح كل شيء بالتفصيل وتعامله جيداً"
        },
        {
            id: 4,
            name: "محمد أحمد",
            date: "منذ 3 أيام",
            rating: 5,
            comment: "دكتور ممتاز وخبرة عالية، شرح كل شيء بالتفصيل وتعامله جيداً"
        }
    ];

    const displayReviews = reviews.length > 0 ? reviews : mockReviews;

    return (
        <Card className="shadow-md border-r-4 border-r-primary">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">
                    آراء المرضى ({displayReviews.length})
                </h2>
                <div className="space-y-4">
                    {displayReviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    <p className="font-semibold text-gray-900">{review.name}</p>
                                    <p className="text-xs text-gray-500">{review.date}</p>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                            size={16}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
