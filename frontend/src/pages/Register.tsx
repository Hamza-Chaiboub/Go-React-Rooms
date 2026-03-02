import { useState } from "react"
import { apiFetch } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import LogoMaster from '../assets/logo-master.png'

type RegisterData = {
    email: string;
    fullName: string;
    password: string;
    passwordConfirmation: string;
}
const PASS_MIN_CHARS = 10

export default function Register() {
    const [formData, setFormData] = useState<RegisterData>({
        email: "",
        fullName: "",
        password: "",
        passwordConfirmation: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const apiUrl = import.meta.env.VITE_API_URL as string
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [showErrors, setShowErrors] = useState<boolean>(false)
    const nameInvalid = showErrors && !formData.fullName.trim()
    const emailInvalid = showErrors && !formData.email.trim()
    const passwordInvalid = showErrors && !formData.password.trim()
    const passwordMismatch = 
        showErrors &&
        formData.password.trim() &&
        formData.passwordConfirmation.trim() &&
        formData.password.trim() !== formData.passwordConfirmation.trim()
    const passwordConfirmationInvalid = (showErrors && !formData.passwordConfirmation.trim()) || passwordMismatch

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

        if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.passwordConfirmation.trim()) {
            setError("Please fill in all fields")
            return
        }

        if (formData.password.trim().length < PASS_MIN_CHARS) {
            setError(`Password must be at least ${PASS_MIN_CHARS} characters.`)
            return
        }

        if (formData.password.trim() !== formData.passwordConfirmation.trim()) {
            setError("Passwords don't match")
            return
        }

        setIsSubmitting(true)
        setError(null)

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
                if (res.status === 409) {setError("Email already registered, try logging in")}
                else setError("Registration failed. Please try again.")
                return
            }

            navigate("/dashboard")

        } catch (e) {
            console.log("signup error", e)
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
                    <label className="font-bold" htmlFor="fullName">Full Name</label>
                    <input
                        className={`${inputBase} ${nameInvalid ? inputBad : inputOk}`}
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleForm}
                        placeholder="Enter your full name"
                    />
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
                        placeholder="Enter your password"
                    />
                    <label className="font-bold" htmlFor="passwordConfirmation">Confirm Password</label>
                    <input
                        className={`${inputBase} ${passwordConfirmationInvalid ? inputBad : inputOk}`}
                        type="password"
                        name="passwordConfirmation"
                        id="passwordConfirmation"
                        value={formData.passwordConfirmation}
                        onChange={handleForm}
                        placeholder="Password Confirmation"
                    />
                    <button className="p-2 rounded-3xl text-white bg-black dark:text-black hover:text-white dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-700 cursor-pointer" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Register"}</button>
                    <Link
                        to="/login"
                        className="bg-zinc-400 dark:bg-zinc-700 mt-4 p-2 rounded-3xl text-black dark:text-zinc-200 text-center hover:bg-black hover:text-zinc-200"
                    >
                        Login
                    </Link>
                    {error && <strong className="text-center text-red-400 mt-2">{error}</strong>}
                </form>
            </div>
        </div>
    )
}