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
import { Home } from "./pages/Home"
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
type HybridPageWrapperProps = {
    ComponentToRender: React.ComponentType<{ className?: string }>
}
const HybridPageWrapper = ({ ComponentToRender }: HybridPageWrapperProps) => {
    const [me, isLoading] = useProtectedRoutes()

    if (isLoading) return null;

    if (me) {
        return (
            <>
                <Sidebar/>
                <ComponentToRender className="ml-16 lg:ml-64"/>
            </>
        )
    }

    return (
        <>
            <TopNav/>
            <ComponentToRender/>
        </>
    )
}

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HybridPageWrapper ComponentToRender={Home}/>} />
                <Route path="/find" element={<HybridPageWrapper ComponentToRender={Find}/>} />
                <Route element={<ProtectedRoutes/>}>
                    <Route element={<Layout/>}>
                        <Route path="/dashboard" element={<Dashboard />} />
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
