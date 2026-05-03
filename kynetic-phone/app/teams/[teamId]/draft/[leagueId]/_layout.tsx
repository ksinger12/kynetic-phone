import { Stack } from "expo-router";
import { createContext, useContext, useState } from "react";

type DraftSelections = {
    [bracketId: number]: number[];
};

const DraftContext = createContext<any>(null);

export function useDraft() {
    return useContext(DraftContext);
}

export default function DraftLayout() {

    const [selections, setSelections] = useState<DraftSelections>({});

    return (
        <DraftContext.Provider value={{ selections, setSelections }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </DraftContext.Provider>
    );
}
