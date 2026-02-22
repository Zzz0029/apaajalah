"use client";

import { motion } from "motion/react";
import Footer from "@/components/Footer";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import { DbSchema } from "@/lib/db";

const services = [
    {
        title: "Penetration Testing",
        desc: "Rigorous offensive testing to break into systems before malicious actors do. Covering web apps, networks, and APIs.",
    },
    {
        title: "Cyber Security Enthusiast",
        desc: "Continuously learning and exploring the latest in security research, vulnerability disclosure, and digital defense strategies.",
    },
    {
        title: "CTF",
        desc: "Actively participating in Capture The Flag competitions to hone practical exploitation and defensive skills in real-world scenarios.",
    }
];

export default function ServicesClient({ dbData }: { dbData: DbSchema }) {
    return (
        <main className="bg-black min-h-screen text-white pt-32">
            <div className="max-w-7xl mx-auto px-4 md:px-24 mb-16">

                <motion.h1
                    className="text-6xl md:text-9xl font-heading font-black tracking-tighter uppercase mb-8"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    Tactical<br />
                    <span className="text-white">Services</span>
                </motion.h1>

                <motion.p
                    className="max-w-xl text-xl font-mono text-gray-400 leading-relaxed mb-24"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Specialized offensive and defensive capabilities tailored to fortify modern digital infrastructure.
                </motion.p>

                <div className="space-y-12 max-w-4xl mx-auto">
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            className="border-b border-gray-800 pb-12 flex justify-between items-start gap-8 flex-col sm:flex-row group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-heading font-bold w-full sm:w-1/2 group-hover:text-white transition-colors">
                                <span className="text-sm font-mono text-gray-600 mb-2 block">0{idx + 1}</span>
                                {service.title}
                            </h2>
                            <p className="text-lg text-gray-400 font-mono w-full sm:w-1/2 pt-4 sm:pt-8 group-hover:text-gray-200 transition-colors">
                                {service.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <InfiniteMarquee
                items={["AUDIT COMPLETE", "ZERO VULNERABILITIES", "SYSTEM SECURED", "100% COVERAGE"]}
                direction="left" speed="fast" />

            <Footer profile={dbData.profile} contact={dbData.contact} />
        </main>
    );
}
