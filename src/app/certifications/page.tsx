import { getDbData } from "@/lib/db";
import CertificationsClient from "./CertificationsClient";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const db = await getDbData();
    return <CertificationsClient dbData={db} />;
}
