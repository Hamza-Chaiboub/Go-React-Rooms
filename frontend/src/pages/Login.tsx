import { useEffect, useState } from "react"
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
    const [, setUser] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL as string
    const navigate = useNavigate()

    useEffect (() => {
        if (isSubmitting) {
            async function login() {
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
                        setUser(null)
                        throw new Error(`HTTP ${res.status}`)
                    }

                    const userData = await res.json()
                    setUser(userData)
                    console.log("login success", userData)
                    navigate("/dashboard")
                } catch (e) {
                    console.log("login error", e)
                } finally {
                    setIsSubmitting(false)
                }
            }

            login()
        }
    }, [isSubmitting, formData])

    const handleForm = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFormSubmission = (e: any) => {
        e.preventDefault()
        setIsSubmitting(true)
        console.log(formData)
    }

    return (
        <div className="flex flex-col justify-center items-center bg-white dark:bg-black h-screen">
            <div className="flex flex-col justify-center items-center p-4 rounded-lg text-white bg-black dark:bg-white dark:text-black">
                <img className="w-48" src={LogoMaster} alt="" />
                <form className="flex flex-col p-8" onSubmit={handleFormSubmission}>
                    <label className="font-bold" htmlFor="email">Email Address</label>
                    <input
                        className="focus:outline outline-black px-3 py-2 bg-zinc-800 text-zinc-400 dark:text-black dark:bg-white rounded-lg mb-5"
                        type="text"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleForm}
                        placeholder="Enter your email"
                    />
                    <label className="font-bold" htmlFor="password">Password</label>
                    <input
                        className="focus:outline outline-black px-3 py-2 bg-zinc-800 text-zinc-400 dark:text-black dark:bg-white rounded-lg mb-5"
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleForm}
                        placeholder="Enter you password"
                    />
                    <span className="flex items-center mb-4 gap-2">
                        <input className="relative peer shrink-0 appearance-none w-5 h-5 border-2 border-zinc-100 dark:border-zinc-400 rounded-md bg-white mt-1 checked:bg-white dark:checked:bg-black checked:border-0 p-1" type="checkbox" name="remember-me" id="rememeber-me" />
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
                    <button className="p-2 rounded-3xl text-black bg-white dark:text-white hover:text-white dark:bg-black hover:bg-zinc-700 cursor-pointer">Login</button>
                    <Link
                        to="/register"
                        className="bg-zinc-800 dark:bg-zinc-300 mt-4 p-2 rounded-3xl text-center hover:bg-black hover:text-zinc-200"
                    >
                        Create new account
                    </Link>
                </form>
            </div>
        </div>
    )
}