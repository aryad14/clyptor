// types/next-auth.d.ts
import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role: UserRole;
            isTwoFactorEnabled?: boolean;
            isOAuth?: boolean;
        };
    }
}
