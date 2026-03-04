import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

type Club = {
    clubId: string;
    clubName: string;
};

type User = {
    userId: string;
    token: string;
    clubs: Club[];
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
    const [user, setUser] = useState<User | null>(null);
    const [activeClubId, setActiveClubId] = useState<string | null>(null);

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
