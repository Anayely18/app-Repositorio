export default function TimelineItem({ status, title, date, color }) {
    const colorClasses = {
        green: "bg-green-100 text-green-800",
        blue: "bg-blue-100 text-blue-800",
        gray: "bg-slate-100 text-slate-800",
    };

    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${colorClasses[color]} border-2 border-white shadow`}></div>
                <div className="w-0.5 h-full bg-slate-200 mt-1"></div>
            </div>
            <div className="flex-1 pb-4">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-slate-900">{title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${colorClasses[color]}`}>{status}</span>
                </div>
                <p className="text-xs text-slate-500">{date}</p>
            </div>
        </div>
    );
}
