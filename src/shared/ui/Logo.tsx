import { Link } from "react-router-dom"
export default function Logo() {
    return (
       <div className="">
            <Link to="/" className="inline-flex items-center">
                <img
                src="assets/img/logo.png"
                alt="Logo"
                className="h-16 w-auto object-contain"
                />
            </Link>
        </div>

    )
}

