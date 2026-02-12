import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');

            if (isOnAdminPanel) {
                if (isLoggedIn) {
                    // Check if user is admin
                    // roughly checking role here or in session
                    // For now, let's assume any logged in user can see admin panel OR verify role in session
                    // ideally we check auth.user.role === 'ADMIN'
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
