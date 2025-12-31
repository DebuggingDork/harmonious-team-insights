import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect } from "react";

interface UseTabPersistenceOptions {
    defaultTab: string;
    validTabs: string[];
}

export const useTabPersistence = ({ defaultTab, validTabs }: UseTabPersistenceOptions) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const tabParam = searchParams.get("tab");

    // Determine the effective active tab
    // If tabParam is present and valid, use it.
    // Otherwise, use defaultTab.
    const activeTab = tabParam && validTabs.includes(tabParam)
        ? tabParam
        : defaultTab;

    // Function to update the tab
    const setActiveTab = useCallback((newTab: string) => {
        if (!validTabs.includes(newTab)) {
            console.warn(`Attempted to set invalid tab: ${newTab}`);
            return;
        }

        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set("tab", newTab);
            return newParams;
        });
    }, [validTabs, setSearchParams]);

    // Effect to sync URL on mount or if invalid tab is present
    useEffect(() => {
        // If we have a tab param but it's invalid, reset to default
        if (tabParam && !validTabs.includes(tabParam)) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set("tab", defaultTab);
                return newParams;
            });
        }
        // If we have no tab param, we could optionally set it to default, 
        // but cleaner URLs (without ?tab=default) are usually preferred.
        // However, the requirement says "Update the URL and/or storage immediately".
        // If strictly interpreted, on load if I'm at /dashboard/member, I should maybe show /dashboard/member?tab=overview?
        // User requirement: "On page load: Read... Validate... Set".
        // "On tab change: Update URL".
        // It doesn't explicitly force setting URL on load if missing, but it implies state persistence.
        // I'll leave the URL clean if it matches default, UNLESS user explicitly asked to always have it.
        // "Update the URL and/or storage immediately" is listed under "On tab change".
        // So implicit default is fine.
    }, [tabParam, validTabs, defaultTab, setSearchParams]);

    return { activeTab, setActiveTab };
};
