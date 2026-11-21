import { headers } from "next/headers";
import { auth } from "../auth";
import NotFound from "@/app/not-found";
import { redirect } from "next/navigation";

export const getSession = async () => {
    "use server"
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session;
}

export const getToken = async () => {
    const session = await getSession();
    if (!session || !session.session?.token) {
       redirect("/unauthorized")
    }
    return session.session?.token;
}


export const authFetch = async (api: string) => {
   const token = await getToken();
   console.log("Token:", token); 
   const res = await fetch(api, {
     headers: {
       "Authorization": `Bearer ${token}`,
     },
   })

   return res;
}

export const requireRole = async (role: string) => {
    const session = await getSession();
    console.log("Session:", session);

    if (!session || session?.user.role !== role) {
        redirect("/unauthorized")
    }
    return session;
}