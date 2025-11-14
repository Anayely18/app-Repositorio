import { Route, Routes } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { routes } from "./routes/routes.js"
import PageWrapper from "./shared/components/PageWrapper"

export default function App() {
    return (
        <div className="font-rubik ">
            <AnimatePresence mode="wait">
                <Routes>
                    {
                        routes.map((item, index) => {
                            return (
                                <Route key={index} path={`${item.path}`} element={<PageWrapper>{item.element}</PageWrapper>}></Route>
                            )
                        })
                    }
                </Routes>
            </AnimatePresence>
        </div>
    )
}
