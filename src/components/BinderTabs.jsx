import { useEffect } from "react";
import "./BinderTabs.css";

export default function BinderTabs({ tabs, activeId, setActiveId }) {
    return (
        <div className="binder-tabs-scroll">
            {tabs.map((t) => (
                <button
                    key={t.id}
                    className={`binder-tab ${t.id === activeId ? "active" : ""}`}
                    onClick={() => setActiveId(t.id)}
                >
                    <span>{t.name}</span>
                </button>
            ))}
        </div>
    );
}
