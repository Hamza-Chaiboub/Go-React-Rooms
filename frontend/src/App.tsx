import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Chat from "./pages/Chat"
import ProtectedRoutes from "./utils/ProtectedRoutes"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Register from "./pages/Register"
import GuestRoutes from "./utils/GuestRoutes"
import { Find } from "./pages/Find"
import { TopNav } from "./components/TopNav"
import { useProtectedRoutes } from "./hooks/useProtectedRoutes"
function Layout() {
    return (
        <>
            <Sidebar/>
            <Outlet/>
        </>
    )
}

function GuestLayout() {
    return (
        <>
            <TopNav />
            <Outlet />
        </>
    )
}

function FindPageWrapper() {
    const [me, isLoading] = useProtectedRoutes()

    if (isLoading) return null;

    if (me) {
        return (
            <>
                <Sidebar/>
                <Find/>
            </>
        )
    }

    return (
        <>
            <TopNav/>
            <Find/>
        </>
    )
}

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/find" element={<FindPageWrapper/>} />
                <Route element={<ProtectedRoutes/>}>
                    <Route element={<Layout/>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/chat/*" element={<Chat />} />
                        <Route path="/logout" element={<Logout />} />
                    </Route>
                </Route>
                <Route element={<GuestRoutes/>}>
                    <Route element={<GuestLayout/>}>
                        <Route path="/login" element={<Login/>} />
                        <Route path="/register" element={<Register/>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
