import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import WorkShowcase from "@/components/WorkShowcase";

export default function WorkPage() {
    return (
        <div className="bg-background min-h-screen text-primary">
            <FloatingCTA />
            <Navbar />

            <main className="pt-24 pb-12">
                <WorkShowcase />
            </main>

            <Footer />
        </div>
    );
}
