"use client";

import { cn } from "@/lib/utils";

export function FeatureSteps({ steps }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-6 mb-12 max-w-5xl mx-auto">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col space-y-2 shadow-md p-4 rounded-md">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-500">{step.description}</p>
                </div>
            ))}
        </div>
    );
}
