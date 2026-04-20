import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { fetchCurrentSession, logoutUser } from "@/api/auth-api";
import { AuthUser } from "@/api/types/auth";
import { ApiError } from "@/api/http-client";

type AuthStatus =
    | "bootstrapping"
    | "authenticated"
    | "must_change_password"
    | "unauthenticated";

type AuthContextType = {
    user: AuthUser | null;
    authStatus: AuthStatus;
    isAuthenticated: boolean;
    isBootstrapping: boolean;
    login: (user: AuthUser) => void;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [authStatus, setAuthStatus] = useState<AuthStatus>("bootstrapping");

    function applyUser(userData: AuthUser) {
        setUser(userData);
        setAuthStatus(
            userData.mustChangePassword ? "must_change_password" : "authenticated"
        );
    }

    function clearSession() {
        setUser(null);
        setAuthStatus("unauthenticated");
    }

    async function refreshSession() {
        try {
            const sessionUser = await fetchCurrentSession();
            applyUser(sessionUser);
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                clearSession();
                return;
            }

            throw error;
        }
    }

    useEffect(() => {
        refreshSession().catch((error) => {
            console.error("Failed to restore session", error);
            clearSession();
        });
    }, []);

    function login(userData: AuthUser) {
        applyUser(userData);
    }

    async function logout() {
        try {
            await logoutUser();
        } finally {
            clearSession();
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                authStatus,
                isAuthenticated:
                    authStatus === "authenticated" ||
                    authStatus === "must_change_password",
                isBootstrapping: authStatus === "bootstrapping",
                login,
                logout,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}
