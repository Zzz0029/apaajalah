import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { getDbData } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

const TABLE_NAME = 'portfolio_data';
const dataFilePath = path.join(process.cwd(), 'data', 'db.json');

export const maxDuration = 60; // increase timeout limits 

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb', // Handle large Base64 encodings
        },
    },
};

export async function GET() {
    try {
        const data = await getDbData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Authenticate the request first (check cookie)
        const authCookie = request.headers.get('cookie')?.includes('admin_session=true');
        if (!authCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Try to save to Supabase
        let supabaseSuccess = false;
        const dbClient = supabaseAdmin || supabase;
        if (dbClient) {
            const { error } = await dbClient
                .from(TABLE_NAME)
                .upsert({ id: 1, data: body });

            if (!error) {
                supabaseSuccess = true;
            } else {
                console.error("Supabase save error:", error.message);
            }
        }

        // Try to save to local file as backup / fallback
        // Wrap in try-catch because Vercel/serverless environments have read-only filesystems
        try {
            // Ensure data folder exists
            const dataDir = path.dirname(dataFilePath);
            await fs.mkdir(dataDir, { recursive: true });

            await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2), 'utf8');

            if (supabaseSuccess) {
                return NextResponse.json({ success: true, message: 'Data saved to Supabase and local backup' });
            } else {
                return NextResponse.json({ success: true, message: 'Data saved to local backup (Supabase unavailable)' });
            }
        } catch (fsError: any) {
            console.warn("Could not save to local filesystem:", fsError.message);

            if (supabaseSuccess) {
                return NextResponse.json({ success: true, message: 'Data saved to Supabase (local backup skipped)' });
            } else {
                // Return a strict error so the user knows
                return NextResponse.json({ error: 'Supabase storage failed AND local fallback failed. Please run setup.sql in Supabase.' }, { status: 500 });
            }
        }
    } catch (error) {
        console.error("Failed to save database:", error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
