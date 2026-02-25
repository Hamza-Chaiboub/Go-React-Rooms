import { useEffect, useState } from "react"
import { apiFetch } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import LogoMaster from '../assets/logo-master.png'

type RegisterData = {
    email: string;
    fullName: string;
    password: string;
}

export default function Register() {
    const [formData, setFormData] = useState<RegisterData>({
        email: "",
        fullName: "",
        password: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [, setUser] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL as string
    const navigate = useNavigate()

    useEffect (() => {
        if (isSubmitting) {
            async function register() {
                try {
                    const res = await apiFetch(`${apiUrl}`, "/auth/register", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            name: formData.fullName,
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

            register()
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
                    <label className="font-bold" htmlFor="fullName">Full Name</label>
                    <input
                        className="focus:outline outline-black px-3 py-2 bg-zinc-800 text-zinc-400 dark:text-black dark:bg-white rounded-lg mb-5"
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleForm}
                        placeholder="Enter your full name"
                    />
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
                    <button className="p-2 rounded-3xl text-black bg-white dark:text-white hover:text-white dark:bg-black hover:bg-zinc-700 cursor-pointer">Register</button>
                    <Link
                        to="/login"
                        className="bg-zinc-800 dark:bg-zinc-300 mt-4 p-2 rounded-3xl text-center hover:bg-black hover:text-zinc-200"
                    >
                        Login
                    </Link>
                </form>
            </div>
        </div>
    )
}