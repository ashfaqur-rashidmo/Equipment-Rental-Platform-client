import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect, unstable_rethrow } from "next/navigation";

export const getSession = async () => {
    "use server"
    // Read headers outside the try/catch: Next.js signals dynamic rendering
    // with an exception that must never be swallowed.
    const requestHeaders = await headers();
    try {
        const session = await auth.api.getSession({
            headers: requestHeaders,
        });
        return session;
    } catch (error) {
        // Let Next.js keep its own control-flow errors (dynamic rendering,
        // redirects, etc.) — swallowing them would make these routes static.
        unstable_rethrow(error);
        // Stripe checkout/success pages must degrade gracefully rather than
        // throw a 500 when the session database is temporarily unavailable.
        console.error("Failed to read session:", error);
        return null;
    }
}

export const requireRole = async (role: string) => {
    const session = await getSession();

    if (!session || session?.user.role !== role) {
        redirect("/Unauthorized")
    }
    return session;
}