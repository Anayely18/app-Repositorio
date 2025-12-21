import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function Timeline({ timeline, onTimelineClick }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const filteredTimeline = timeline.filter(
        item => item.document_type !== null &&
            item.document_type !== undefined &&
            item.document_type !== ''
    );

    const sortedTimeline = [...filteredTimeline].sort((a, b) => new Date(b.date) - new Date(a.date));

    const visibleTimeline = showAll ? sortedTimeline : sortedTimeline.slice(0, 3);
    const hasMore = sortedTimeline.length > 3;
    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {visibleTimeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100 shadow-sm"></div>
                            {index < visibleTimeline.length - 1 && (
                                <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                            )}
                        </div>
                        <div className="flex-1 pb-6">
                            <div
                                onClick={() => onTimelineClick(item)}
                                className="bg-slate-50 rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-200"
                            >
                                <p className="text-sm text-slate-600 mb-2 leading-relaxed">{item.description}</p>
                                <p className="text-xs text-slate-500 font-mono bg-white inline-block px-2 py-1 rounded">
                                    {formatDate(item.date)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {hasMore && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-lg transition-colors text-sm font-semibold text-slate-700"
                >
                    <Calendar className="w-4 h-4" />
                    {showAll ? (
                        <>
                            Mostrar menos
                            <ChevronUp className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            Ver {timeline.length - 3} registros más
                            <ChevronDown className="w-4 h-4" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
