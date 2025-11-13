import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";

export const routes = [
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
]