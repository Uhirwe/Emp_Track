"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Clock, Users, Building, Calendar, Shield, Zap, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#181C23] via-[#181C23] to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-yellow-600/30 bg-black/90">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">EmpTrack</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-medium text-white hover:text-yellow-400 transition-colors">
              Login
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg px-6 py-2 rounded-md">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <section className="w-full py-16 md:py-28 lg:py-36 xl:py-44">
          <div className="container px-4 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_550px] items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-1.5 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full">
                    Workforce Management Solution
                  </span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold tracking-tight leading-tight">
                    <span className="text-yellow-400">Digital Employee Management</span>
                    <br />
                    <span className="text-white">Made Simple</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl leading-relaxed">
                    Streamline your workforce management with our comprehensive platform. Track performance, manage schedules, and boost productivity.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/auth/signup">
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg w-full min-[400px]:w-auto px-6 py-2 rounded-md">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500 w-full min-[400px]:w-auto px-6 py-2 rounded-md">
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="pt-4 flex items-center gap-6">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-xs text-white">JD</div>
                    <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-black flex items-center justify-center text-xs text-white">AL</div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs text-white">RS</div>
                    <div className="w-8 h-8 rounded-full bg-yellow-600 border-2 border-black flex items-center justify-center text-xs text-white">+</div>
                  </div>
                  <p className="text-sm text-gray-400">Trusted by <span className="text-yellow-400 font-bold">1,000+</span> managers worldwide</p>
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="absolute w-full h-full bg-yellow-500/5 rounded-full blur-3xl"></div>
                <div className="relative h-[380px] w-[380px] rounded-full bg-gradient-to-br from-yellow-500/30 to-amber-600/5 p-8 backdrop-blur-sm border border-yellow-500/10 shadow-2xl">
                  <div className="absolute inset-0 rounded-full border border-yellow-500/20 animate-pulse" style={{animationDuration: '4s'}} />
                  <div className="absolute inset-4 rounded-full border border-yellow-500/10" />
                  <div className="absolute inset-8 rounded-full border border-yellow-500/5" />
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-4 rounded-full bg-yellow-500/20 blur-md"></div>
                      <Shield className="h-32 w-32 text-yellow-400 relative z-10" />
                    </div>
                  </div>
                  
                  {/* Floating elements adjusted for equal spacing */}
                  <div className="absolute top-[15%] left-[15%] p-3 bg-black rounded-lg border border-yellow-500/20 shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                    <Calendar className="h-6 w-6 text-yellow-400" />
                  </div>
                   <div className="absolute top-[15%] right-[15%] p-3 bg-black rounded-lg border border-yellow-500/20 shadow-lg transform translate-x-1/2 -translate-y-1/2">
                    <Users className="h-6 w-6 text-yellow-400" />
                  </div>
                   <div className="absolute top-1/2 left-0 p-3 bg-black rounded-lg border border-yellow-500/20 shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                   <div className="absolute top-1/2 right-0 p-3 bg-black rounded-lg border border-yellow-500/20 shadow-lg transform translate-x-1/2 -translate-y-1/2">
                    <CreditCard className="h-6 w-6 text-yellow-400" />
                  </div>
                   <div className="absolute bottom-[15%] left-[15%] p-3 bg-black rounded-lg border border-yellow-500/20 shadow-lg transform -translate-x-1/2 translate-y-1/2">
                    <BarChart3 className="h-6 w-6 text-yellow-400" />
                  </div>
                   <div className="absolute bottom-[15%] right-[15%] p-3 bg-black rounded-lg border border-yellow-500/20 shadow-lg transform translate-x-1/2 translate-y-1/2">
                    <Building className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-16 md:py-24 lg:py-32 relative">
          <div className="container px-4 md:px-8 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center justify-center p-1 rounded-full bg-yellow-500/20 text-yellow-400 mb-3">
                <span className="px-3 py-1 text-sm font-semibold">Top Features</span>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold tracking-tight text-yellow-400">
                  Powerful Features for Modern Management
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl">
                  Everything you need to manage your workforce effectively
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards */}
              <div className="group flex flex-col items-start space-y-4 rounded-2xl border border-yellow-600/20 bg-[#181C23] p-6 transition-all duration-300 hover:border-yellow-500/50 hover:bg-black/60 hover:shadow-lg hover:shadow-yellow-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/10 p-3">
                  <Users className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400">Employee Management</h3>
                <p className="text-gray-400 text-left">
                  Comprehensive employee profiles with detailed information, document management, and task assignments.
                </p>
              </div>
              
              <div className="group flex flex-col items-start space-y-4 rounded-2xl border border-yellow-600/20 bg-[#181C23] p-6 transition-all duration-300 hover:border-yellow-500/50 hover:bg-black/60 hover:shadow-lg hover:shadow-yellow-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/10 p-3">
                  <BarChart3 className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400">Performance Tracking</h3>
                <p className="text-gray-400 text-left">
                  Monitor and analyze employee performance metrics with customizable KPIs and visual reporting tools.
                </p>
              </div>
              
              <div className="group flex flex-col items-start space-y-4 rounded-2xl border border-yellow-600/20 bg-[#181C23] p-6 transition-all duration-300 hover:border-yellow-500/50 hover:bg-black/60 hover:shadow-lg hover:shadow-yellow-500/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500/10 p-3">
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400">Time Management</h3>
                <p className="text-gray-400 text-left">
                  Efficient scheduling, attendance tracking, and time-off management with automated notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center justify-center p-1 rounded-full bg-yellow-500/20 text-yellow-400 mb-3">
                <span className="px-3 py-1 text-sm font-semibold">Why Choose Us</span>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold tracking-tight text-yellow-400">
                  Why Choose EmpTrack?
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl">
                  Join thousands of managers who trust our platform
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Benefits Cards */}
              <div className="flex flex-col h-full space-y-4 rounded-2xl bg-gradient-to-br from-[#181C23] to-black p-1">
                <div className="flex flex-1 flex-col space-y-4 rounded-xl bg-[#181C23] p-6 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <CheckCircle2 className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400">Easy to Use</h3>
                  <p className="text-gray-400 text-left flex-1">
                    Intuitive interface designed for managers of all technical skill levels. Get up and running in minutes.
                  </p>
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-yellow-400 text-sm font-semibold">No technical skills needed</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col h-full space-y-4 rounded-2xl bg-gradient-to-br from-[#181C23] to-black p-1">
                <div className="flex flex-1 flex-col space-y-4 rounded-xl bg-[#181C23] p-6 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <Shield className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400">Secure & Reliable</h3>
                  <p className="text-gray-400 text-left flex-1">
                    Enterprise-grade security with data encryption, regular backups, and compliance with industry standards.
                  </p>
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-yellow-400 text-sm font-semibold">99.9% uptime guarantee</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col h-full space-y-4 rounded-2xl bg-gradient-to-br from-[#181C23] to-black p-1">
                <div className="flex flex-1 flex-col space-y-4 rounded-xl bg-[#181C23] p-6 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400">Fast & Efficient</h3>
                  <p className="text-gray-400 text-left flex-1">
                    Optimized for quick decision-making with real-time analytics and automated reporting capabilities.
                  </p>
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-yellow-400 text-sm font-semibold">Boost productivity by 35%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 relative">
          <div className="container px-4 md:px-8 relative z-10">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl bg-gradient-to-b from-yellow-500/20 to-black/60 p-1 shadow-xl shadow-yellow-500/10">
                <div className="rounded-xl bg-black/80 p-8 md:p-12 text-center">
                  <div className="mx-auto max-w-md space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight text-yellow-400">
                      Ready to Get Started?
                    </h2>
                    <p className="text-gray-300 md:text-lg">
                      Join thousands of managers who trust EmpTrack to optimize their workforce management.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row justify-center">
                      <Link href="/auth/signup">
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg w-full sm:w-auto px-6 py-2 rounded-md">
                          Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/auth/login">
                        <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500 w-full sm:w-auto px-6 py-2 rounded-md">
                          Login
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t border-yellow-600/30 bg-black/90">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-yellow-400" />
                <span className="text-lg font-bold text-yellow-400">EmpTrack</span>
              </div>
              <p className="text-sm text-gray-400 max-w-xs">
                Modern employee management platform for businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-yellow-400 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-yellow-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-400 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-400 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center text-sm text-gray-500 md:text-left">
              © 2024 EmpTrack. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
