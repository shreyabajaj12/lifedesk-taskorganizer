import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LifeDeskAIWidget from "../ai/LifeDeskAIWidget";

const AppLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 ">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Content */}
            <div className="min-h-screen  md:ml-[clamp(200px,20vw,256px)]">

                <Topbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="p-4 sm:p-5 md:p-6">
                    {children}
                </main>

            </div>

            {/* Global AI assistant: stays mounted during page navigation */}
            <LifeDeskAIWidget />
        </div>
    );
};

export default AppLayout;