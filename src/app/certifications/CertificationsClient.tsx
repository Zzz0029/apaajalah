"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Footer from "@/components/Footer";
import { DbSchema } from "@/lib/db";
import { FileText } from "lucide-react";

export default function CertificationsClient({ dbData }: { dbData: DbSchema }) {
    return (
        <main className="bg-black min-h-screen text-white pt-32 hidden-scroll">
            <div className="max-w-7xl mx-auto px-4 md:px-24 mb-24">

                <motion.h1
                    className="text-6xl md:text-9xl font-heading font-black tracking-tighter uppercase mb-16"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Operation<br />
                    <span className="text-white">Archives</span>
                </motion.h1>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 md:gap-12 [column-fill:_balance]">
                    {dbData.certifications.map((project, idx) => {
                        const isPdf = project.image.startsWith("data:application/pdf") || project.image.toLowerCase().split('?')[0].endsWith(".pdf");

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group relative cursor-pointer break-inside-avoid mb-12"
                            >
                                <a href={project.image} target="_blank" rel="noreferrer" className="block w-full">
                                    <div className="relative w-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
                                        {isPdf ? (
                                            <div className="aspect-video flex flex-col items-center justify-center text-gray-400 group-hover:text-white transition-colors duration-500">
                                                <FileText size={48} className="mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                                <span className="font-mono text-xs uppercase tracking-widest">PDF Document</span>
                                            </div>
                                        ) : (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-auto transition-transform duration-700 group-hover:scale-105 opacity-100 grayscale hover:grayscale-0"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay" />
                                    </div>
                                    <div className="mt-6 flex justify-between items-start">
                                        <div className="max-w-[80%]">
                                            <p className="text-gray-400 font-mono text-[10px] tracking-widest mb-1">{project.category}</p>
                                            <h3 className="text-xl font-heading font-bold uppercase group-hover:text-white transition-colors leading-tight">{project.title}</h3>
                                        </div>
                                        <span className="text-gray-500 font-mono text-xs">{project.year}</span>
                                    </div>
                                </a>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <Footer profile={dbData.profile} contact={dbData.contact} />
        </main>
    );
}
