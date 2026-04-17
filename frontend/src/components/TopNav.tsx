import { useState } from "react";
import { Link } from "@mui/material";

export const TopNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const active = true

    return (
        <nav className="dark:bg-slate-950 w-full relative z-20">
            <div className="flex justify-between items-center h-16 px-4 md:px-8">
                {/* <p className="dark:text-slate-200! text-3xl font-bold italic">Roomie</p> */}
                <Link
                    href="/"
                    underline="none"
                    className="text-slate-950! dark:text-slate-200! text-3xl! font-bold! italic!"
                >
                    Roomie
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/find"
                        underline="none"
                        className={`rounded-md ${
                            active
                                ? "bg-slate-300 dark:bg-slate-700 text-blue-800! font-bold!"
                                : "text-slate-950!"
                        } dark:text-slate-100! px-4 py-2 hover:bg-slate-300! dark:hover:bg-slate-700! hover:text-blue-800!`}
                    >
                        Find
                    </Link>
                    <Link
                        href="/"
                        underline="none"
                        className="rounded-md text-slate-950! dark:text-slate-100! px-4 py-2 hover:bg-slate-300! dark:hover:bg-slate-700! hover:text-blue-800!"
                    >
                        List
                    </Link>
                    <Link
                        href="/"
                        underline="none"
                        className="rounded-md text-slate-950! dark:text-slate-100! px-4 py-2 hover:bg-slate-300! dark:hover:bg-slate-700! hover:text-blue-800!"
                    >
                        Matches
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        underline="none"
                        className="rounded-md dark:text-slate-100! px-4 py-2 border border-slate-400! dark:border-slate-200/50"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        underline="none"
                        className="rounded-md text-slate-100! px-4 py-2 bg-blue-600"
                    >
                        Sign up
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
                        aria-label="Toggle menu"
                    >
            <span
                className={`block w-6 h-0.5 bg-slate-800 dark:bg-slate-200 transition-transform duration-300 ${
                    isOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
            />
                        <span
                            className={`block w-6 h-0.5 bg-slate-800 dark:bg-slate-200 my-1 transition-opacity duration-300 ${
                                isOpen ? "opacity-0" : ""
                            }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-slate-800 dark:bg-slate-200 transition-transform duration-300 ${
                                isOpen ? "-rotate-45 -translate-y-1.5" : ""
                            }`}
                        />
                    </button>
                </div>
            </div>

            <div
                className={`md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-950 shadow-lg transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="flex flex-col items-center py-4 gap-3">
                    <Link
                        href="/find"
                        underline="none"
                        className={`rounded-md ${
                            active
                                ? "bg-slate-300 dark:bg-slate-700 text-blue-800! font-bold!"
                                : "text-slate-950!"
                        } dark:text-slate-100! px-4 py-2 w-32 text-center`}
                        onClick={() => setIsOpen(false)}
                    >
                        Find
                    </Link>
                    <Link
                        href="/"
                        underline="none"
                        className="rounded-md text-slate-950! dark:text-slate-100! px-4 py-2 w-32 text-center hover:bg-slate-300! dark:hover:bg-slate-700!"
                        onClick={() => setIsOpen(false)}
                    >
                        List
                    </Link>
                    <Link
                        href="/"
                        underline="none"
                        className="rounded-md text-slate-950! dark:text-slate-100! px-4 py-2 w-32 text-center hover:bg-slate-300! dark:hover:bg-slate-700!"
                        onClick={() => setIsOpen(false)}
                    >
                        Matches
                    </Link>
                </div>
            </div>
        </nav>
    );
};