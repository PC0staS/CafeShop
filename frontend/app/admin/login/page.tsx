'use client'
import { useState } from "react"
import { handleSubmit } from "@/app/lib/handleSubmit"

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        const email = event.currentTarget.email.value
        const password = event.currentTarget.password.value
        const error = await handleSubmit(event, email, password)
        if (error) {
            setErrorMessage(error)
        }
    }



    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
            <h1 className="text-2xl font-bold">Bienvenido a la página de Login</h1>
            <h2 className="text-lg mt-2">Si eres un usuario corriente por favor regresa.</h2>
            <h2 className="text-lg mt-2">Si necesitas ayuda, por favor contacta al administrador.</h2>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 bg-white p-6 rounded-lg shadow-md items-center">
                <div className="flex flex-col">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" className="border border-gray-300 p-2 rounded" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password:</label>
                    <input type={showPassword ? "text" : "password"} name="password" id="password" className="border border-gray-300 p-2 rounded" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm mt-1 cursor-pointer text-blue-500 hover:text-blue-700">
                        {showPassword ? "Ocultar" : "Mostrar"} contraseña
                    </button>

                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600 hover:scale-105 transition-all">Login</button>
            </form>
        </div>
    )
}
