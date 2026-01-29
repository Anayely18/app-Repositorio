import { Link } from "react-router-dom"
import logo from "@/assets/img/logo.png"
export default function Logo() {
    return (
       <div className="">
            <Link to="/" className="inline-flex items-center">
                <img
                src={logo}
                alt="Logo"
                className="h-16 w-auto object-contain"
                />
            </Link>
        </div>

    )
}

