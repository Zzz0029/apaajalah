import { getDbData } from "@/lib/db";
import HallOfFameClient from "./HallOfFameClient";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const db = await getDbData();
    return <HallOfFameClient dbData={db} />;
}
