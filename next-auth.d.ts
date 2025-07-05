import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultUser & {
            uid: string;
            name?: string;
            image?: string

        };
    }

    interface User {
        uid: string;
        name?: string;
        image?: string

    }
    interface Session {
        user: User & {
            uid: string;
            name?: string;
            image?: string
        };
    }
}
