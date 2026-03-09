import { Link } from "@mui/material"

export const TopNav = () => {
    const active = true
    return (
        <nav className="dark:bg-slate-950 w-full h-16 flex justify-around items-center z-20">
            <div className="flex items-center gap-6">
                <p className="dark:text-slate-200! text-3xl font-bold italic mr-6">Roomie</p>
                <Link href="/find" underline="none" className={`rounded-md ${active ? "bg-slate-300 dark:bg-slate-700 text-blue-800! font-bold!" : "text-slate-950!"} dark:text-slate-100! px-4 py-2 hover:bg-slate-300! dark:hover:bg-slate-700! hover:text-blue-800!`}>Find</Link>
                <Link href="/" underline="none" className="rounded-md text-slate-950! dark:text-slate-100! px-4 py-2  hover:bg-slate-300! dark:hover:bg-slate-700! hover:text-blue-800!">List</Link>
                <Link href="/" underline="none" className="rounded-md text-slate-950! dark:text-slate-100! px-4 py-2  hover:bg-slate-300! dark:hover:bg-slate-700! hover:text-blue-800!">Matches</Link>
            </div>
            <div className="flex gap-4 items-center">
                <Link href="/login" underline="none" className="rounded-md dark:text-slate-100! px-4 py-2 border border:slate-400! dark:border-slate-200/50">Login</Link>
                <Link href="/register" underline="none" className="rounded-md text-slate-100! px-4 py-2 bg-blue-600">Sign up</Link>
            </div>
        </nav>
    )
}