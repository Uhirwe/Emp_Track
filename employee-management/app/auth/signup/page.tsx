"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    organisationName: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match")
    setIsLoading(false)
    return
  }

  try {
    const res = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: mapRole(formData.role),
      }),
    })

    if (!res.ok) throw new Error("Signup failed")

    router.push("/dashboard")
  } catch (err) {
    console.error(err)
    alert("Signup failed")
  } finally {
    setIsLoading(false)
  }
}

const mapRole = (val: string) => {
  switch (val) {
    case "hr_admin":
      return "HR Administrator"
    case "manager":
      return "Department Manager"
    case "employee":
      return "Employee"
    default:
      return ""
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
              Create an account
            </h1>
            <p className="text-sm text-gray-300">
              Enter your details to get started with EmpTrack
            </p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName" className="text-gray-300">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      autoCapitalize="none"
                      autoComplete="given-name"
                      autoCorrect="off"
                      className="bg-black border-gray-700 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      autoCapitalize="none"
                      autoComplete="family-name"
                      autoCorrect="off"
                      className="bg-black border-gray-700 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
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
                  <Label htmlFor="email" className="text-gray-300">Organisation Name</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Engineering company"
                   
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    className="bg-black border-gray-700 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500"
                    value={formData.organisationName}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-gray-300">Role</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="bg-black border-gray-700 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700">
                      <SelectItem value="hr_admin" className="text-gray-100 hover:bg-gray-800">HR Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className="bg-black border-gray-700 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className="bg-black border-gray-700 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" className="border-gray-700 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium text-gray-300"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-yellow-500 hover:text-yellow-400 underline underline-offset-4">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-yellow-500 hover:text-yellow-400 underline underline-offset-4">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
          <p className="px-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-yellow-500 hover:text-yellow-400 underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
