import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { StudentResearchReportRequest } from "../pages/report/StudentResearchReportRequest";

export const routes = [
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/student-research-report-request',
        element: <StudentResearchReportRequest />
    }
]