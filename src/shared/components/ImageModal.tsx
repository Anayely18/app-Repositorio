import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function ImageModal({ show, images, currentIndex, onClose, onNext, onPrev }) {
    if (!show) return null;
    return (
        <div
            className="fixed inset-0 bg-black/80 bg-opacity-90 z-50 flex items-center justify-center p-2"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300"
                >
                    <X className="w-6 h-6" />
                </button>
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); onPrev(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm" onClick={(e) => e.stopPropagation()}>
                    <img
                        src={images[currentIndex]}
                        alt="Evidencia ampliada"
                        className="w-full h-auto max-h-[80vh] object-contain"
                    />
                    {images.length > 1 && (
                        <div className="bg-white px-3 py-2 text-center text-xs text-slate-600 border-t">
                            Imagen {currentIndex + 1} de {images.length}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
