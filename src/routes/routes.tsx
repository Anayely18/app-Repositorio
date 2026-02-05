import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/home/Home";
import ListThesisWorks from "@/pages/list/ListThesisWorks";
import StudentResearchReportRequest from "@/pages/report/StudentResearchReportRequest";
import TeacherResearchReportRequest from "@/pages/report/TeacherResearchReportRequest";
import Layout from "@/shared/ui/layout/Layout";
import RequestDetailsPage from "@/pages/list/details/RequestDetailsPage";
import Profile from "@/pages/auth/Profile";
import TramiteStatusApp from "@/shared/components/TramiteStatusApp";
import ProtectedRoute from "./ProtectedRoute";

export const routes = [
    {
        path: '/rootrepo',
        element: <Login />
    },
    {
        path: "/register",
        element: (
                <Register />
        ),
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
        path: '/teacher-research-report-request',
        element: <TeacherResearchReportRequest />
    },
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/process',
        element: <TramiteStatusApp />
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "",
                element: <ListThesisWorks />,
            },
            {
                path: "details/:id",
                element: (
                    <ProtectedRoute>
                        <RequestDetailsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ]
    }
]
