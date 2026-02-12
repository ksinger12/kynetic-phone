import { createContext, useContext, useState, ReactNode } from "react";

type User = {
    userId: string;
    clubs: { clubId: string; clubName: string }[];
};

type AuthContextType = {
    user: User | null;
    activeClubId: string | null;
    login: (user: User) => void;
    logout: () => void;
    setActiveClubId: (clubId: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // 🔥 HARDCODED IN ONE PLACE ONLY (temporary)
    const [user, setUser] = useState<User | null>({
        userId: "1",
        clubs: [{ clubId: "1", clubName: "Cedar Brae Golf Club" }],
    });

    const [activeClubId, setActiveClubId] = useState<string | null>("1");

    function login(userData: User) {
        setUser(userData);
        setActiveClubId(userData.clubs[0]?.clubId ?? null);
    }

    function logout() {
        setUser(null);
        setActiveClubId(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, activeClubId, login, logout, setActiveClubId }}
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
