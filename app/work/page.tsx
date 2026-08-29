import React from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTA from "@/components/FloatingCTA";
import WorkShowcase from "@/components/WorkShowcase";
import { sanityFetch } from "@/sanity/lib/live";
import { SHORT_FORM_PROJECTS_QUERY } from "@/sanity/lib/queries";

export default async function WorkPage() {
    const { data: shortFormProjects } = await sanityFetch({
        query: SHORT_FORM_PROJECTS_QUERY,
    });

    return (
        <div className="bg-background min-h-screen text-primary">
            <FloatingCTA />
            <Navbar />

            <main className="pt-24 pb-12">
                <WorkShowcase sanityShortFormItems={shortFormProjects} />
            </main>

            <SiteFooter />
        </div>
    );
}
