import React from "react";
import { LiaTelegramPlane } from "react-icons/lia";


export default function NewsletterFooter() {
    return (
        <div className="bg-indigo-400 shadow-md text-white px-4 py-3">
            <div className="flex justify-between container mx-auto items-center">
                <div>
                    <p className="flex items-center">
                        <LiaTelegramPlane size={45} className="mr-2" />
                        Sign up to Newsletter
                    </p>
                </div>
                <div>
                    <p>... and Be aware of all promotions and events!</p>
                </div>
                <div>
                    <div className="hidden md:flex flex-1 max-w-3xl">
                        <input
                            type="text"
                            placeholder="Subsribe for more..."
                            className="flex-1 px-4 py-2 rounded-l-full border border-indigo-500 focus:outline-none"
                        />
                        <button className="bg-indigo-500 px-4 rounded-r-full text-white">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}