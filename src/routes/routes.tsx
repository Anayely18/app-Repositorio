import ForgotPassword from "@/pages/auth/ForgotPassword"
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"
import Home from "@/pages/home/Home"
import ListThesisWorks from "@/pages/list/ListThesisWorks"
import StudentResearchReportRequest from "@/pages/report/StudentResearchReportRequest"
import TeacherResearchReportRequest from "@/pages/report/TeacherResearchReportRequest"
import Layout from "@/shared/ui/layout/Layout"
import RequestDetailsPage from "@/pages/list/details/RequestDetailsPage"; 

export const routes = [
    {
        path: '/admin',
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
        path: '/teacher-research-report-request',
        element: <TeacherResearchReportRequest />
    },
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/dashboard',
        element: <Layout />,
        children: [
            {
                path: "",
                element: <ListThesisWorks />
            },
            {
            path: "details/:id", 
            element: <RequestDetailsPage />
            }
        ]
    }
]