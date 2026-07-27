import { createContext, useContext, useEffect, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [mobileSidebar, setMobileSidebar] = useState(false);

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const toggleSidebar = () =>
        setSidebarCollapsed((prev) => !prev);

    const openMobileSidebar = () =>
        setMobileSidebar(true);

    const closeMobileSidebar = () =>
        setMobileSidebar(false);

    const toggleTheme = () =>
        setDarkMode((prev) => !prev);

    useEffect(() => {
        const root = document.documentElement;

        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <LayoutContext.Provider
            value={{
                sidebarCollapsed,
                mobileSidebar,
                darkMode,
                toggleSidebar,
                openMobileSidebar,
                closeMobileSidebar,
                toggleTheme,
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => useContext(LayoutContext);