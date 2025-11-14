import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Home } from "../pages/home/Home";
import { StudentResearchReportRequest } from "../pages/report/StudentResearchReportRequest";

export const routes = [
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/student-research-report-request',
        element: <StudentResearchReportRequest />
    },
    {
        path: '/',
        element: <Home />
    }
]