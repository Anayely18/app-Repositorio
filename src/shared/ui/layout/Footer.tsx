import React from 'react'

export default function Footer() {
    return (
        <footer className="w-full bg-gray-100 text-gray-700 py-2 border-t mt-4">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="mt-1 text-gray-500 text-xs">
                    © {new Date().getFullYear()} Universidad Nacional Micaela Bastidas de Apurímac — Todos los derechos reservados.
                </p>
            </div>
        </footer>
    )
}
