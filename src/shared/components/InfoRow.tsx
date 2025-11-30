export default function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-2">
            <span className="font-semibold text-slate-600 min-w-[140px] text-sm">{label}:</span>
            <span className="text-slate-800 flex-1 text-sm">{value}</span>
        </div>
    );
}
