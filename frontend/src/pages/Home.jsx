import { Link } from "react-router-dom";
import { Search, Users, Home as HomeIcon, Shield, MapPin, Star, ArrowRight, CheckCircle, Heart, Clock, Award, MessageCircle, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Home({ isAuthenticated, user, onLogout }) {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: <Search className="w-8 h-8" />,
            title: "AI-Powered Matching",
            desc: "Our advanced algorithm analyzes lifestyle preferences, study habits, and personality traits to find your ideal roommate match.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Verified & Secure",
            desc: "Multi-layer verification including university email, student ID, and background checks ensure a safe community.",
            color: "from-emerald-500 to-teal-500"
        },
        {
            icon: <MapPin className="w-8 h-8" />,
            title: "Location Intelligence",
            desc: "Find housing options with detailed neighborhood insights, commute times, and campus proximity data.",
            color: "from-violet-500 to-purple-500"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community Features",
            desc: "Join study groups, events, and social activities with your matched roommates and nearby students.",
            color: "from-rose-500 to-pink-500"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Stanford University",
            content: "Found my perfect roommate in just 3 days! The matching algorithm is incredibly accurate.",
            rating: 5
        },
        {
            name: "Marcus Johnson",
            role: "MIT",
            content: "The verification process made me feel safe, and the housing options were exactly what I needed.",
            rating: 5
        },
        {
            name: "Emma Rodriguez",
            role: "UC Berkeley",
            content: "Not only found a roommate but made lifelong friends through the community features.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={onLogout} isHomePage={true} />
            {/* Hero Section with Animation */}
            <section className="pt-20 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-cyan-600/5 pointer-events-none" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl pointer-events-none" />


                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-6 py-2 mb-8">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-slate-700">Trusted by 10,000+ students</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Find Your Perfect
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent block mt-2">
                            College Roommate
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed">
                        Connect with compatible students using AI-powered matching. Secure, verified profiles
                        and intelligent recommendations make finding your ideal living situation effortless.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-lg"
                        >
                            Start Matching
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 rounded-2xl border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300 font-semibold text-lg"
                        >
                            Browse Roommates
                        </Link>
                    </div>
                </div>
            </section>

            {/* Interactive Features Section */}
            <section className="py-24 px-6 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Why Students Choose RoomieConnect
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Advanced technology meets human connection to create the most effective roommate matching platform
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${activeFeature === idx
                                        ? 'bg-white shadow-xl border-slate-200 scale-105'
                                        : 'bg-white/60 border-slate-100 hover:bg-white hover:shadow-lg'
                                        }`}
                                    onMouseEnter={() => setActiveFeature(idx)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white flex-shrink-0`}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 h-96 flex items-center justify-center">
                                <div className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} opacity-20 transition-all duration-500`} />
                            </div>
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center pointer-events-none">
                                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} flex items-center justify-center transition-all duration-500`}>
                                    {features[activeFeature].icon}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section with Animation */}
            <section className="py-20 px-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Students Nationwide</h2>
                        <p className="text-xl text-white/80">Real results from real students</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { number: "10,000+", label: "Active Students" },
                            { number: "95%", label: "Success Rate" },
                            { number: "500+", label: "Universities" },
                            { number: "4.9★", label: "Average Rating" }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <p className="text-white/80 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            What Students Say
                        </h2>
                        <p className="text-xl text-slate-600">Real experiences from our community</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                                <div>
                                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                                    <div className="text-slate-500 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced CTA */}
            <section className="py-24 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl" />
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-xl" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Find Your Perfect Match?
                    </h2>
                    <p className="text-xl mb-10 text-white/90 leading-relaxed">
                        Join thousands of students who've found their ideal roommates and created lasting friendships
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="group px-10 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2"
                        >
                            Start Your Journey
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-10 py-4 border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 hover:border-white transition-all duration-300 font-semibold text-lg"
                        >
                            Sign In
                        </Link>
                    </div>

                    <div className="mt-8 text-white/70 text-sm">
                        Free to join • No hidden fees • Cancel anytime
                    </div>
                </div>
            </section>

            {/* Professional Footer */}
            <footer className="bg-slate-900 text-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <HomeIcon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">RoomieConnect</span>
                            </div>
                            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                                The most trusted platform for finding compatible roommates in college.
                                Safe, smart, and designed for students.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                                    <span className="text-sm font-bold">f</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                                    <span className="text-sm font-bold">t</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                                    <span className="text-sm font-bold">in</span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Product</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">How it Works</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Safety</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Support</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
                        <p>© 2025 RoomieConnect. All rights reserved. Built with ❤️ for students.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}