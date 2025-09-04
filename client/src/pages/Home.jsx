import React from 'react'
import Navbar from '../components/navbar.jsx';
import { useNavigate } from "react-router-dom"
import { AppContext } from '../context/AppContext.jsx';
import { useContext } from 'react';

function Home() {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-transparent">
            <div className="relative z-20">
                <Navbar />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center">
                {/* Rocket with bounce animation */}
                <div className="text-6xl mb-8 animate-bounce">🚀</div>

                {/* Main heading with slide-in and fade animations */}
                <h1 className="text-foreground text-4xl font-bold mb-4 transform transition-all duration-700 ease-out animate-fade-in-up">
                    Hey{' '}
                    <span className="inline-block">
                        {userData ? (
                            <>
                                {userData.name} <span className="animate-pulse">👋</span>
                            </>
                        ) : (
                            'Developers'
                        )}
                    </span>
                </h1>


                {/* Description with delayed fade-in */}
                <p className="text-muted-foreground text-lg mb-8 max-w-md transform transition-all duration-700 delay-300 ease-out animate-fade-in-up">
                    Build amazing applications with modern tools and technologies.
                    Start your journey with us today.
                </p>

                {/* Button with hover animations and delayed appearance */}
                <button
                    onClick={() => navigate("/login")}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold 
                             transform transition-all duration-700 delay-500 ease-out animate-fade-in-up
                             hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:-translate-y-1
                             active:scale-95 cursor-pointer"
                >
                    Get Started
                </button>
            </div>

            {/* Custom CSS animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    )
}

export default Home