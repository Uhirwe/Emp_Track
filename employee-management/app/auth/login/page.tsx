"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Get API URL (same as in employee.ts)
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    return `${protocol}//${hostname}:8080/api`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }
    console.log("this is the login response before json: "+res)
      const data = await res.json()
      const newdata = JSON.stringify(data)
      console.log("this is the login data:", newdata)
      if (data.token) {
        localStorage.setItem("token", data.token)
        if (data.userId) {
          localStorage.setItem("user", data.userId);
        }
        router.push("/dashboard/employees")
      } else {
        throw new Error("No token received from server")
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container relative flex h-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex items-center justify-center">
              <Shield className="h-12 w-12 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-yellow-500">
              Welcome back
            </h1>
            <p className="text-sm text-gray-300">
              Enter your credentials to access your account
            </p>
          </div>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    className="bg-black border-gray-700 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="bg-black border-gray-700 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-gray-700 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </div>
          <p className="px-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-yellow-500 hover:text-yellow-400 underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
