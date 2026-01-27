import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { routes } from "./routes/routes.js";
import PageWrapper from "./shared/components/PageWrapper";
import { Toaster } from "sonner";

export default function App() {
    return (
        <div className="font-rubik ">
            <Toaster 
                position="top-right" 
                richColors 
                closeButton
                duration={3000}
            />
            <AnimatePresence mode="wait">
                <Routes>
                    {routes.map((item, index) => (
                        <Route
                            key={index}
                            path={item.path}
                            element={<PageWrapper>{item.element}</PageWrapper>}
                        >
                            {item.children &&
                                item.children.map((child, j) => (
                                    <Route
                                        key={`child-${j}`}
                                        path={child.path}
                                        element={child.element}
                                    />
                                ))
                            }
                        </Route>
                    ))}
                </Routes>
            </AnimatePresence>
        </div>
    );
}
