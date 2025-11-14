import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Home } from "../pages/home/Home";
import { ListThesisWorks } from "../pages/list/ListThesisWorks";
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
        path: '/forgot-password',
        element: <ForgotPassword />
    },
    {
        path: '/student-research-report-request',
        element: <StudentResearchReportRequest />
    },
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/list-thesis-works',
        element: <ListThesisWorks />
    }
]