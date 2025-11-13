import { Route, Routes } from "react-router-dom"
import { routes } from "./routes/routes"

function App() {
  return (
    <div className="font-poppins">
      <Routes>
        {
            routes.map((item, index) => {
                return (
                    <Route key={index} path={`${item.path}`} element={item.element}></Route>
                )
            })
        }
      </Routes>
    </div>
  )
}

export default App
