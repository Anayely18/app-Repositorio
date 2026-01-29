import { TramiteDetailsPage } from "@/pages/process/TramiteDetailsPage";
import { useState } from "react";
import { SearchPage } from "./SearchPage";

export default function TramiteStatusApp() {
    const [activeTab, setActiveTab] = useState('estudiante');
    const [tramiteData, setTramiteData] = useState(null);

    const handleSearch = (data) => {
        setTramiteData(data);
    };

    const handleReset = () => {
        setTramiteData(null);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (tramiteData) {
        return (
            <TramiteDetailsPage
                tramiteData={tramiteData}
                activeTab={activeTab}
                onReset={handleReset}
            />
        );
    }

    return (
        <SearchPage
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onSearch={handleSearch}
        />
    );
}


