"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface LoadingContextType {
    /** true while the loading screen is active */
    isLoading: boolean;
    /** 0-1 progress value for the progress bar */
    progress: number;
    /** Called by LoadingScreen when all assets are ready and exit animation is done */
    setLoadingComplete: () => void;
    /** Called by LoadingScreen to update progress */
    setProgress: (p: number) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: true,
    progress: 0,
    setLoadingComplete: () => {},
    setProgress: () => {},
});

export function useLoading() {
    return useContext(LoadingContext);
}

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const setLoadingComplete = useCallback(() => {
        setIsLoading(false);
    }, []);

    const value = useMemo(
        () => ({ isLoading, progress, setLoadingComplete, setProgress }),
        [isLoading, progress, setLoadingComplete]
    );

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
}

export default LoadingContext;
