import { Routes,Route } from "react-router"
import Home from "./pages/Home"
import Register from "./pages/Register"
import { ToastContainer } from "react-toastify"
function App() {

  return (
    <>
       <Routes>
          <Route path="/*" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
       </Routes>
       <ToastContainer />
    </>
  )
}

export default App
