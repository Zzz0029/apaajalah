"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Certification, HallOfFameEntry } from "@/lib/db";
import { FileText, ArrowUpRight } from "lucide-react";

export default function CertificationsSection({ certifications, hallOfFame }: { certifications: Certification[], hallOfFame: HallOfFameEntry[] }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="py-24 px-4 md:px-24 bg-black relative">
            <div className="max-w-7xl mx-auto w-full">
                {/* Hall Of Fame Highlight */}
                {hallOfFame && hallOfFame.length > 0 && (
                    <div className="mb-32">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6">
                            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter uppercase whitespace-pre-line leading-[0.9] text-gray-400">
                                Hall of Fame<br /><span className="text-white">Highlights</span>
                            </h2>
                            <a href="/hall-of-fame" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2 group shadow-lg shadow-red-500/20">
                                View Full Hall of Fame <span className="group-hover:translate-x-2 transition-transform">→</span>
                            </a>
                        </div>
                        <div className="flex flex-col border-t border-gray-900">
                            {hallOfFame.slice(0, 2).map((entry, idx) => (
                                <motion.a
                                    key={entry.id}
                                    href={entry.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-center justify-between py-6 border-b border-gray-900 hover:bg-white/5 transition-colors px-4 -mx-4 rounded"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <div className="flex items-center gap-6">
                                        <span className="text-red-500 font-bold mb-1">★</span>
                                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase group-hover:text-white transition-colors">{entry.title}</h3>
                                    </div>
                                    <div className="text-gray-500 group-hover:text-white transition-colors group-hover:rotate-45 duration-300">
                                        <ArrowUpRight size={24} />
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-8">
                    <h2 className="text-4xl md:text-8xl font-heading font-black tracking-tighter uppercase whitespace-pre-line leading-[0.9]">
                        Certification<br />& Licenses
                    </h2>
                    <a href="/certifications" className="group flex items-center gap-2 pb-2 text-xl font-mono border-b border-gray-600 hover:border-white hover:text-white transition-colors">
                        See All <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </a>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 md:gap-12 [column-fill:_balance]">
                    {certifications.map((cert, idx) => {
                        const isPdf = cert.image.includes("data:application/pdf") || cert.image.toLowerCase().split('?')[0].endsWith(".pdf");
                        return (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                onHoverStart={() => setHoveredIndex(idx)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                className="group relative cursor-pointer break-inside-avoid mb-12"
                            >
                                <a href={cert.image} target="_blank" rel="noreferrer" className="block w-full">
                                    <div className="relative w-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
                                        {isPdf ? (
                                            <div className="aspect-video flex flex-col items-center justify-center text-gray-400 group-hover:text-white transition-colors duration-500">
                                                <FileText size={64} className="mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                                <span className="font-mono text-sm uppercase tracking-widest">PDF Document</span>
                                            </div>
                                        ) : (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={cert.image}
                                                alt={cert.title}
                                                className="w-full h-auto transition-transform duration-700 group-hover:scale-105 opacity-100 grayscale hover:grayscale-0"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay" />
                                    </div>

                                    <div className="mt-6 flex justify-between items-start">
                                        <div className="max-w-[80%]">
                                            <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-2">{cert.category}</p>
                                            <h3 className="text-xl md:text-2xl font-heading font-bold group-hover:text-white transition-colors leading-tight">{cert.title}</h3>
                                        </div>
                                        <span className="text-gray-500 font-mono text-sm">{cert.year}</span>
                                    </div>
                                </a>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
