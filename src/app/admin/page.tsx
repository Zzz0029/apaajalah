"use client";

import { useEffect, useState } from "react";
import { DbSchema } from "@/lib/db";
import { LogOut, Save, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";

const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (file.type === "application/pdf") {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            return;
        }

        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const MAX_DIM = 1920;
            if (width > height && width > MAX_DIM) {
                height *= MAX_DIM / width;
                width = MAX_DIM;
            } else if (height > MAX_DIM) {
                width *= MAX_DIM / height;
                height = MAX_DIM;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.onerror = error => reject(error);
    });
};

export default function AdminDashboard() {
    const [data, setData] = useState<DbSchema | null>(null);
    const [activeTab, setActiveTab] = useState<"home" | "about" | "certifications" | "hallOfFame" | "contact">("home");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();



    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await fetch("/api/data");
        if (res.ok) {
            const db = await res.json();
            setData(db);
        }
    };

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);
        try {
            const res = await fetch("/api/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const responseData = await res.json();

            if (res.ok) alert(responseData.message || "Data saved successfully!");
            else alert(`Failed to save data: ${responseData.error || "Unknown error"}`);
        } catch (e: any) {
            alert(`Error saving data: ${e.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
    };

    if (!data) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
            <RefreshCw className="animate-spin mr-2" /> Initializing Dashboard...
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden">


            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-900 flex flex-col justify-between py-8 px-6 bg-zinc-950">
                <div>
                    <h1 className="text-2xl font-heading font-black tracking-widest uppercase mb-12">Control<br />Panel</h1>
                    <nav className="flex flex-col gap-4 font-mono text-sm uppercase tracking-widest">
                        <button
                            onClick={() => setActiveTab("home")}
                            className={`text-left py-2 border-l-2 pl-4 transition-colors ${activeTab === 'home' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Home Page
                        </button>
                        <button
                            onClick={() => setActiveTab("about")}
                            className={`text-left py-2 border-l-2 pl-4 transition-colors ${activeTab === 'about' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            About Page
                        </button>
                        <button
                            onClick={() => setActiveTab("certifications")}
                            className={`text-left py-2 border-l-2 pl-4 transition-colors ${activeTab === 'certifications' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Certifications
                        </button>
                        <button
                            onClick={() => setActiveTab("hallOfFame")}
                            className={`text-left py-2 border-l-2 pl-4 transition-colors ${activeTab === 'hallOfFame' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Hall Of Fame
                        </button>
                        <button
                            onClick={() => setActiveTab("contact")}
                            className={`text-left py-2 border-l-2 pl-4 transition-colors ${activeTab === 'contact' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            Contact Details
                        </button>
                    </nav>
                </div>

                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400 font-mono text-sm uppercase tracking-widest transition-colors">
                    <LogOut size={16} /> Terminate
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12">
                <div className="max-w-4xl mx-auto flex flex-col gap-8">

                    <div className="flex justify-between items-end border-b border-gray-900 pb-6">
                        <h2 className="text-4xl font-heading font-bold uppercase tracking-tighter">
                            {activeTab === 'home' && 'Edit Home Page'}
                            {activeTab === 'about' && 'Edit About Page'}
                            {activeTab === 'certifications' && 'Manage Certifications'}
                            {activeTab === 'hallOfFame' && 'Hall Of Fame Links'}
                            {activeTab === 'contact' && 'Contact Details'}
                        </h2>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-white text-black px-6 py-3 font-bold uppercase text-sm tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? 'Syncing...' : 'Deploy Changes'}
                        </button>
                    </div>

                    {/* Form Tabs */}
                    {activeTab === "home" ? (
                        <div className="flex flex-col gap-12 animate-in fade-in duration-500">

                            {/* Personal Info */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-heading font-bold uppercase border-b border-gray-900 pb-2">Core Identity</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Operator Name</label>
                                        <input
                                            type="text"
                                            value={data.profile.name}
                                            onChange={(e) => setData({ ...data, profile: { ...data.profile, name: e.target.value } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Role Designation</label>
                                        <input
                                            type="text"
                                            value={data.profile.role}
                                            onChange={(e) => setData({ ...data, profile: { ...data.profile, role: e.target.value } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Hero Statement */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-heading font-bold uppercase border-b border-gray-900 pb-2">Mission Statement</h3>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Headline (Large Text)</label>
                                        <input
                                            type="text"
                                            value={data.profile.statementTitle}
                                            onChange={(e) => setData({ ...data, profile: { ...data.profile, statementTitle: e.target.value } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Sub-Description</label>
                                        <textarea
                                            value={data.profile.statementDesc}
                                            onChange={(e) => setData({ ...data, profile: { ...data.profile, statementDesc: e.target.value } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white min-h-[100px] focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Floating Quote (Supports HTML &lt;br/&gt;)</label>
                                        <input
                                            type="text"
                                            value={data.profile.quote}
                                            onChange={(e) => setData({ ...data, profile: { ...data.profile, quote: e.target.value } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Biography */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-heading font-bold uppercase border-b border-gray-900 pb-2">Home Intro Text</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-2 md:col-span-3">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Intro Text (Used on the Homepage above the Certifications)</label>
                                        <textarea
                                            value={data.profile.bioText}
                                            onChange={(e) => setData({ ...data, profile: { ...data.profile, bioText: e.target.value } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white min-h-[150px] focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-1">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Text Size</label>
                                        <select
                                            value={data.profile.bioTextSize || "large"}
                                            onChange={(e) => setData({ ...data, profile: { ...data.profile, bioTextSize: e.target.value as any } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-white transition-colors h-[50px]"
                                        >
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                            <option value="xlarge">X-Large</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                        </div>
                    ) : activeTab === "contact" ? (
                        <div className="flex flex-col gap-12 animate-in fade-in duration-500">

                            {/* Contact Links */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-heading font-bold uppercase border-b border-gray-900 pb-2">Comms & Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Email Address</label>
                                        <input type="email" value={data.contact.email} onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} className="bg-black border border-gray-800 rounded px-4 py-3 text-white" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">WhatsApp Number (Display)</label>
                                        <input type="text" value={data.contact.whatsapp} onChange={(e) => setData({ ...data, contact: { ...data.contact, whatsapp: e.target.value } })} className="bg-black border border-gray-800 rounded px-4 py-3 text-white" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">WhatsApp URL</label>
                                        <input type="url" value={data.contact.whatsappLink} onChange={(e) => setData({ ...data, contact: { ...data.contact, whatsappLink: e.target.value } })} className="bg-black border border-gray-800 rounded px-4 py-3 text-white" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">LinkedIn URL</label>
                                        <input type="url" value={data.contact.linkedin} onChange={(e) => setData({ ...data, contact: { ...data.contact, linkedin: e.target.value } })} className="bg-black border border-gray-800 rounded px-4 py-3 text-white" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Instagram URL</label>
                                        <input type="url" value={data.contact.instagram} onChange={(e) => setData({ ...data, contact: { ...data.contact, instagram: e.target.value } })} className="bg-black border border-gray-800 rounded px-4 py-3 text-white" />
                                    </div>
                                </div>
                            </section>

                            {/* FAQs */}
                            <section className="space-y-6">
                                <div className="flex justify-between items-end border-b border-gray-900 pb-2">
                                    <div>
                                        <h3 className="text-xl font-heading font-bold uppercase">Frequently Asked Questions</h3>
                                        <p className="text-gray-500 font-mono text-xs mt-1">Manage the Q&A section on the Contact page.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newFaq = { q: "New Question?", a: "Answer..." };
                                            setData({ ...data, faqs: [...(data.faqs || []), newFaq] });
                                        }}
                                        className="text-xs uppercase font-bold tracking-widest text-white hover:text-gray-300 transition-colors"
                                    >
                                        + Add FAQ
                                    </button>
                                </div>
                                <div className="flex flex-col gap-6">
                                    {(data.faqs || []).map((faq, idx) => (
                                        <div key={idx} className="relative p-6 border border-gray-800 bg-zinc-950 rounded-lg flex flex-col gap-4 group">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Question</label>
                                                <input
                                                    type="text"
                                                    value={faq.q}
                                                    onChange={(e) => {
                                                        const newFaqs = [...(data.faqs || [])];
                                                        newFaqs[idx].q = e.target.value;
                                                        setData({ ...data, faqs: newFaqs });
                                                    }}
                                                    className="bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Answer</label>
                                                <textarea
                                                    value={faq.a}
                                                    onChange={(e) => {
                                                        const newFaqs = [...(data.faqs || [])];
                                                        newFaqs[idx].a = e.target.value;
                                                        setData({ ...data, faqs: newFaqs });
                                                    }}
                                                    className="bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm min-h-[100px]"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newFaqs = (data.faqs || []).filter((_, i) => i !== idx);
                                                    setData({ ...data, faqs: newFaqs });
                                                }}
                                                className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 rounded"
                                                title="Delete FAQ"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    ))}
                                    {(!data.faqs || data.faqs.length === 0) && (
                                        <div className="p-12 text-center border border-dashed border-gray-800 rounded-lg text-gray-500 font-mono">
                                            No FAQs configured.
                                        </div>
                                    )}
                                </div>
                            </section>

                        </div>
                    ) : activeTab === "about" ? (
                        <div className="flex flex-col gap-12 animate-in fade-in duration-500">

                            {/* Page Header */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-heading font-bold uppercase border-b border-gray-900 pb-2">Page Header & Visuals</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Large Title (Supports \n)</label>
                                        <textarea
                                            value={data.about.title}
                                            onChange={(e) => setData({ ...data, about: { ...data.about, title: e.target.value } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white min-h-[100px]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Abstract Image URL (Recommended: 16:9)</label>
                                        <div className="flex gap-4 items-center">
                                            <input
                                                type="url"
                                                value={data.about.image}
                                                onChange={(e) => setData({ ...data, about: { ...data.about, image: e.target.value } })}
                                                className="flex-1 bg-black border border-gray-800 rounded px-4 py-3 text-white"
                                                placeholder="Paste URL or upload file ->"
                                            />
                                            <label className="cursor-pointer bg-white text-black px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors whitespace-nowrap rounded">
                                                Upload File
                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        setIsSaving(true);
                                                        try {
                                                            const base64Url = await compressImage(file);
                                                            setData({ ...data, about: { ...data.about, image: base64Url } });
                                                        } catch (err) {
                                                            alert("Error processing file.");
                                                        } finally {
                                                            setIsSaving(false);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Bio Builder */}
                            <section className="space-y-6">
                                <div className="flex justify-between items-end border-b border-gray-900 pb-2">
                                    <h3 className="text-xl font-heading font-bold uppercase">Dynamic Bio Builder</h3>
                                    <button
                                        onClick={() => {
                                            const newBlock = { id: Date.now().toString(), text: "New text block", textSize: "normal" as const, textColor: "gray" as const };
                                            setData({ ...data, about: { ...data.about, bioBlocks: [...data.about.bioBlocks, newBlock] } });
                                        }}
                                        className="text-xs uppercase font-bold tracking-widest text-white hover:text-gray-300 transition-colors"
                                    >
                                        + Add Block
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {data.about.bioBlocks.map((block, idx) => (
                                        <div key={block.id} className="p-4 border border-gray-800 bg-zinc-950 rounded relative group">
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                                <div className="md:col-span-8">
                                                    <textarea
                                                        value={block.text}
                                                        onChange={(e) => {
                                                            const newBlocks = [...data.about.bioBlocks];
                                                            newBlocks[idx].text = e.target.value;
                                                            setData({ ...data, about: { ...data.about, bioBlocks: newBlocks } });
                                                        }}
                                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <select
                                                        value={block.textSize}
                                                        onChange={(e) => {
                                                            const newBlocks = [...data.about.bioBlocks];
                                                            newBlocks[idx].textSize = e.target.value as any;
                                                            setData({ ...data, about: { ...data.about, bioBlocks: newBlocks } });
                                                        }}
                                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm"
                                                    >
                                                        <option value="small">Small</option>
                                                        <option value="normal">Normal</option>
                                                        <option value="large">Large</option>
                                                        <option value="xlarge">X-Large</option>
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <select
                                                        value={block.textColor}
                                                        onChange={(e) => {
                                                            const newBlocks = [...data.about.bioBlocks];
                                                            newBlocks[idx].textColor = e.target.value as any;
                                                            setData({ ...data, about: { ...data.about, bioBlocks: newBlocks } });
                                                        }}
                                                        className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-sm"
                                                    >
                                                        <option value="white">White</option>
                                                        <option value="gray">Gray</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newBlocks = data.about.bioBlocks.filter((_, i) => i !== idx);
                                                    setData({ ...data, about: { ...data.about, bioBlocks: newBlocks } });
                                                }}
                                                className="absolute -right-2 -top-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Canvas Configuration */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-heading font-bold uppercase border-b border-gray-900 pb-2">Physics Canvas (Capabilities)</h3>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Canvas Subtitle</label>
                                        <input
                                            type="text"
                                            value={data.about.subtitle}
                                            onChange={(e) => setData({ ...data, about: { ...data.about, subtitle: e.target.value } })}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Keywords (Comma separated blocks)</label>
                                        <textarea
                                            value={data.about.capabilities.join(", ")}
                                            onChange={(e) => {
                                                const newCaps = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                                                setData({ ...data, about: { ...data.about, capabilities: newCaps } });
                                            }}
                                            className="bg-black border border-gray-800 rounded px-4 py-3 text-white min-h-[100px] font-mono text-sm"
                                        />
                                        <p className="text-xs text-gray-500 font-mono">Used to generate the interactive physics rectangles on the About page.</p>
                                    </div>
                                </div>
                            </section>

                        </div>
                    ) : activeTab === "certifications" ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-500">

                            <div className="flex justify-between items-center bg-zinc-950 p-6 border border-gray-900 rounded-lg">
                                <div>
                                    <h3 className="text-xl font-heading font-bold uppercase">Active Operations</h3>
                                    <p className="text-gray-500 font-mono text-sm mt-1">Manage certification records and featured projects.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const newCert = {
                                            id: Date.now().toString(),
                                            title: "New Certification",
                                            category: "CATEGORY",
                                            year: new Date().getFullYear().toString(),
                                            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
                                        };
                                        setData({ ...data, certifications: [newCert, ...data.certifications] });
                                    }}
                                    className="px-6 py-3 border border-white text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors"
                                >
                                    + Deploy New Record
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {data.certifications.map((cert, index) => (
                                    <div key={cert.id} className="relative p-6 border border-gray-800 bg-zinc-950 rounded-lg flex flex-col md:flex-row gap-6 group">

                                        {/* Image Preview */}
                                        <div className="w-full md:w-48 h-32 rounded bg-black border border-gray-800 overflow-hidden relative shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={cert.image} alt="Preview" className="w-full h-full object-cover opacity-50 grayscale" />
                                        </div>

                                        {/* Edit Fields */}
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Title</label>
                                                <input
                                                    type="text"
                                                    value={cert.title}
                                                    onChange={(e) => {
                                                        const newCerts = [...data.certifications];
                                                        newCerts[index].title = e.target.value;
                                                        setData({ ...data, certifications: newCerts });
                                                    }}
                                                    className="bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Category</label>
                                                <input
                                                    type="text"
                                                    value={cert.category}
                                                    onChange={(e) => {
                                                        const newCerts = [...data.certifications];
                                                        newCerts[index].category = e.target.value;
                                                        setData({ ...data, certifications: newCerts });
                                                    }}
                                                    className="bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm"
                                                />
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {["CTF", "Vulnerability Disclosure Program", "Licence"].map((cat) => (
                                                        <button
                                                            key={cat}
                                                            onClick={() => {
                                                                const newCerts = [...data.certifications];
                                                                newCerts[index].category = cat;
                                                                setData({ ...data, certifications: newCerts });
                                                            }}
                                                            className={`px-2 py-1 text-[10px] font-mono border rounded transition-colors ${cert.category === cat ? 'bg-white text-black border-white' : 'border-gray-800 text-gray-500 hover:border-gray-400'}`}
                                                        >
                                                            {cat === "Vulnerability Disclosure Program" ? "VDP" : cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Year</label>
                                                <input
                                                    type="text"
                                                    value={cert.year}
                                                    onChange={(e) => {
                                                        const newCerts = [...data.certifications];
                                                        newCerts[index].year = e.target.value;
                                                        setData({ ...data, certifications: newCerts });
                                                    }}
                                                    className="bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={cert.pinned || false}
                                                    onChange={(e) => {
                                                        const newCerts = [...data.certifications];
                                                        newCerts[index].pinned = e.target.checked;
                                                        setData({ ...data, certifications: newCerts });
                                                    }}
                                                    className="w-5 h-5 accent-white rounded border-gray-800 bg-black"
                                                />
                                                <label className="text-white text-xs uppercase tracking-widest font-mono font-bold">Pin to Homepage</label>
                                            </div>

                                            <div className="flex flex-col gap-2 w-full md:col-span-2">
                                                <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Media URL (PNG/JPG/PDF - Recommended: 16:9)</label>
                                                <div className="flex gap-4 items-center">
                                                    <input
                                                        type="text"
                                                        value={cert.image}
                                                        onChange={(e) => {
                                                            const newCerts = [...data.certifications];
                                                            newCerts[index].image = e.target.value;
                                                            setData({ ...data, certifications: newCerts });
                                                        }}
                                                        className="flex-1 bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm"
                                                        placeholder="Paste URL or upload file ->"
                                                    />
                                                    <label className="cursor-pointer bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors whitespace-nowrap rounded">
                                                        Upload File
                                                        <input
                                                            type="file"
                                                            accept=".pdf,image/png,image/jpeg"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;

                                                                setIsSaving(true);
                                                                try {
                                                                    const base64Url = await compressImage(file);
                                                                    const newCerts = [...data.certifications];
                                                                    newCerts[index].image = base64Url;
                                                                    setData({ ...data, certifications: newCerts });
                                                                } catch (err) {
                                                                    alert("Error processing file.");
                                                                } finally {
                                                                    setIsSaving(false);
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => {
                                                const newCerts = data.certifications.filter((_, i) => i !== index);
                                                setData({ ...data, certifications: newCerts });
                                            }}
                                            className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 rounded"
                                            title="Delete Record"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                ))}
                                {data.certifications.length === 0 && (
                                    <div className="p-12 text-center border border-dashed border-gray-800 rounded-lg text-gray-500 font-mono">
                                        No active operations on record.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-500">

                            <div className="flex justify-between items-center bg-zinc-950 p-6 border border-gray-900 rounded-lg">
                                <div>
                                    <h3 className="text-xl font-heading font-bold uppercase">Hall of Fame Links</h3>
                                    <p className="text-gray-500 font-mono text-sm mt-1">Manage external mentions, awards, or hall of fame URLs.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const newEntry = {
                                            id: Date.now().toString(),
                                            title: "New Recognition",
                                            url: "https://"
                                        };
                                        setData({ ...data, hallOfFame: [newEntry, ...data.hallOfFame] });
                                    }}
                                    className="px-6 py-3 border border-white text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors"
                                >
                                    + Add New Link
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {data.hallOfFame.map((entry, index) => (
                                    <div key={entry.id} className="relative p-6 border border-gray-800 bg-zinc-950 rounded-lg flex flex-col md:flex-row gap-4 group items-center">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Display Text</label>
                                                <input
                                                    type="text"
                                                    value={entry.title}
                                                    onChange={(e) => {
                                                        const newHoF = [...data.hallOfFame];
                                                        newHoF[index].title = e.target.value;
                                                        setData({ ...data, hallOfFame: newHoF });
                                                    }}
                                                    className="bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-gray-500 text-xs uppercase tracking-widest font-mono">Target URL</label>
                                                <input
                                                    type="url"
                                                    value={entry.url}
                                                    onChange={(e) => {
                                                        const newHoF = [...data.hallOfFame];
                                                        newHoF[index].url = e.target.value;
                                                        setData({ ...data, hallOfFame: newHoF });
                                                    }}
                                                    className="bg-black border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={entry.pinned || false}
                                                    onChange={(e) => {
                                                        const newHoF = [...data.hallOfFame];
                                                        newHoF[index].pinned = e.target.checked;
                                                        setData({ ...data, hallOfFame: newHoF });
                                                    }}
                                                    className="w-5 h-5 accent-white rounded border-gray-800 bg-black"
                                                />
                                                <label className="text-white text-xs uppercase tracking-widest font-mono font-bold">Pin to Highlights</label>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                const newHoF = data.hallOfFame.filter((_, i) => i !== index);
                                                setData({ ...data, hallOfFame: newHoF });
                                            }}
                                            className="text-red-500 hover:text-red-400 p-2 md:mt-6 bg-red-500/10 rounded shrink-0"
                                            title="Delete Record"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                ))}
                                {data.hallOfFame.length === 0 && (
                                    <div className="p-12 text-center border border-dashed border-gray-800 rounded-lg text-gray-500 font-mono">
                                        No Hall of Fame entries yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
