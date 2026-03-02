import { useState } from "react"
import { apiFetch } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import LogoMaster from '../assets/logo-master.png'

type LoginData = {
    email: string;
    password: string;
}

export default function Login() {
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const apiUrl = import.meta.env.VITE_API_URL as string
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [showErrors, setShowErrors] = useState<boolean>(false)
    const emailInvalid = showErrors && !formData.email.trim()
    const passwordInvalid = showErrors && !formData.password.trim()

    const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isSubmitting) return

        setShowErrors(true)

        if (!formData.email.trim() || !formData.password.trim()) {
            setError("Please fill in email and password")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await apiFetch(`${apiUrl}`, "/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })

            if (!res.ok) {
                setError("Invalid credentials")
                return
            }

            navigate("/dashboard", { replace: true })

        } catch (e) {
            console.log("login error", e)
            setError("Something went wrong. Please try again")
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputBase = "bg-zinc-100 focus:outline-none px-3 py-2 text-zinc-700 dark:text-zinc-100 dark:bg-zinc-600 dark:focus:bg-zinc-300 dark:focus:text-black rounded-lg mb-5 border-2";
    const inputOk = "border-transparent focus:border-zinc-400 dark:focus:border-zinc-500";
    const inputBad = "border-red-500 focus:border-red-500";

    return (
        <div className="flex flex-col justify-center items-center bg-white dark:bg-black h-screen">
            <div className="w-md flex flex-col justify-center items-center p-4 rounded-lg text-black bg-zinc-200 dark:bg-zinc-800 dark:text-white">
                <img className="w-48" src={LogoMaster} alt="" />
                <form className="w-full flex flex-col p-8" onSubmit={handleFormSubmission}>
                    <label className="font-bold" htmlFor="email">Email Address</label>
                    <input
                        className={`${inputBase} ${emailInvalid ? inputBad : inputOk}`}
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleForm}
                        placeholder="Enter your email"
                    />
                    <label className="font-bold" htmlFor="password">Password</label>
                    <input
                        className={`${inputBase} ${passwordInvalid ? inputBad : inputOk}`}
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleForm}
                        placeholder="Enter you password"
                    />
                    <span className="flex items-center mb-4 gap-2">
                        <input className="relative peer shrink-0 appearance-none w-5 h-5 border-2 border-zinc-100 dark:border-zinc-400 rounded-md bg-white mt-1 checked:bg-white dark:checked:bg-black checked:border-0 p-1" type="checkbox" name="remember-me" id="remember-me" />
                        <label htmlFor="remember-me">Remember me</label>
                        <svg
                            className="absolute w-5 h-5 mt-1 hidden peer-checked:block pointer-events-none text-black dark:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                    <button className="p-2 rounded-3xl text-white bg-black dark:text-black hover:text-white dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-700 cursor-pointer" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Login"}</button>
                    <Link
                        to="/register"
                        className="bg-zinc-400 dark:bg-zinc-700 mt-4 p-2 rounded-3xl text-black dark:text-zinc-200 text-center hover:bg-black hover:text-zinc-200"
                    >
                        Create new account
                    </Link>
                    {error && <strong className="text-center text-red-400 mt-2">{error}</strong>}
                </form>
            </div>
        </div>
    )
}