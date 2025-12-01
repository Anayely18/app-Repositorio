export default function JuryItem({ rol, nombre, badge }) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
                <span className="font-semibold text-slate-700">{rol}:</span>
                <span className="ml-2">{nombre}</span>
            </div>
            <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-1 rounded">{badge}</span>
        </div>
    );
}
