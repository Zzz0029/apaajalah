import { supabase } from './supabase';
import fs from 'fs/promises';
import path from 'path';

const TABLE_NAME = 'portfolio_data';

export interface ProfileData {
    name: string;
    role: string;
    statementTitle: string;
    statementDesc: string;
    quote: string;
    bioText: string;
    bioTextSize?: "small" | "medium" | "large" | "xlarge";
}

export interface ContactData {
    email: string;
    whatsapp: string;
    whatsappLink: string;
    linkedin: string;
    instagram: string;
}

export interface Certification {
    id: string;
    title: string;
    category: string;
    image: string;
    year: string;
    pinned?: boolean;
}

export interface HallOfFameEntry {
    id: string;
    title: string;
    url: string;
    pinned?: boolean;
}

export interface BioBlock {
    id: string;
    text: string;
    textSize: "small" | "normal" | "large" | "xlarge";
    textColor: "white" | "gray";
}

export interface AboutData {
    title: string;
    subtitle: string;
    image: string;
    capabilities: string[];
    bioBlocks: BioBlock[];
}

export interface FaqEntry {
    q: string;
    a: string;
}

export interface DbSchema {
    profile: ProfileData;
    contact: ContactData;
    certifications: Certification[];
    hallOfFame: HallOfFameEntry[];
    about: AboutData;
    faqs: FaqEntry[];
}

const defaultDb: DbSchema = {
    profile: {
        name: "Riski Permana",
        role: "Cyber Security Consultant & Web Developer",
        statementTitle: "Securing the Future, Building the Web.",
        statementDesc: "I help organizations secure their critical assets while crafting high-end, dynamic web experiences.",
        quote: "Security is not a product, but a process.",
        bioText: "Creative Developer & Security Researcher based in Indonesia."
    },
    contact: {
        email: "",
        whatsapp: "",
        whatsappLink: "",
        linkedin: "",
        instagram: ""
    },
    certifications: [],
    hallOfFame: [],
    about: {
        title: "Behind\nThe Entity",
        subtitle: "Core Capabilities",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
        capabilities: ["Web Penetrasi", "Bug Hunter", "CTF", "Cyber Security Enthusiast"],
        bioBlocks: []
    },
    faqs: [
        {
            q: "Do you take on freelance Web Development projects?",
            a: "Yes. In addition to security audits, I specialize in crafting high-end, Awwwards-winning websites using Next.js and Motion."
        }
    ]
};

export async function getDbData(): Promise<DbSchema> {
    // Try Supabase first
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('data')
                .eq('id', 1)
                .single();

            if (!error && data && data.data) {
                const dbData = data.data as Partial<DbSchema>;
                // If it's empty {} like from setup script, use defaultDb
                if (!dbData.profile) {
                    return defaultDb;
                }
                return { ...defaultDb, ...dbData } as DbSchema;
            }
            if (error) console.warn("Supabase fetch error, falling back to local:", error.message);
        }
    } catch (err) {
        console.error("Supabase connection failed:", err);
    }

    // Fallback to local db.json then default data
    const dataFilePath = path.join(process.cwd(), 'data', 'db.json');
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        const dbData = JSON.parse(fileContent) as Partial<DbSchema>;
        if (!dbData.profile) {
            return defaultDb;
        }
        return { ...defaultDb, ...dbData } as DbSchema;
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            console.error("Failed to read local database:", error);
        }
        return defaultDb;
    }
}
