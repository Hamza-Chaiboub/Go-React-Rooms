import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Chat from "./pages/Chat"
import ProtectedRoutes from "./utils/ProtectedRoutes"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Register from "./pages/Register"
import GuestRoutes from "./utils/GuestRoutes"

function Layout() {
    return (
        <>
            <Sidebar/>
            <Outlet/>
        </>
    )
}

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoutes/>}>
                    <Route element={<Layout/>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/logout" element={<Logout />} />
                    </Route>
                </Route>
                <Route element={<GuestRoutes/>}>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
