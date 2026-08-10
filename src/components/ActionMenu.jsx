import { useState } from "react";
import "./ActionMenu.css";

export default function ActionMenu({
    tabs,
    activeId,
    setActiveId,
    setTabs,
    createNewCharacter,
    cur,
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNew = () => {
        const newId = crypto.randomUUID();
        setTabs([...tabs, createNewCharacter(newId)]);
        setActiveId(newId);
        setMenuOpen(false);
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(cur, null, 2)], {
            type: "application/json",
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${cur.name || "wonderbird"}.json`;
        a.click();
        setMenuOpen(false);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = JSON.parse(evt.target.result);
                data.id = crypto.randomUUID();
                setTabs([...tabs, data]);
                setActiveId(data.id);
            } catch (err) {
                alert("インポートに失敗しました。");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
        setMenuOpen(false);
    };

    return (
        <div className={`fab-container no-print ${menuOpen ? "open" : ""}`}>
            <div className="fab-backdrop" onClick={() => setMenuOpen(false)} />

            <div className="fab-options">
                {/* 新規作成 */}
                <div className="fab-option-wrapper">
                    <span className="fab-label-outside">新規作成</span>
                    <button className="fab-option-icon-btn" onClick={handleNew}>
                        <img
                            src="/new.png"
                            alt="新規作成"
                            className="fab-image-icon"
                        />
                    </button>
                </div>

                {/* インポート */}
                <div className="fab-option-wrapper">
                    <span className="fab-label-outside">インポート</span>
                    <button
                        className="fab-option-icon-btn"
                        onClick={() =>
                            document.getElementById("rt-import").click()
                        }
                    >
                        <img
                            src="/import.png"
                            alt="インポート"
                            className="fab-image-icon"
                        />
                    </button>
                </div>

                {/* エクスポート */}
                <div className="fab-option-wrapper">
                    <span className="fab-label-outside">エクスポート</span>
                    <button
                        className="fab-option-icon-btn"
                        onClick={handleExport}
                    >
                        <img
                            src="/export.png"
                            alt="エクスポート"
                            className="fab-image-icon"
                        />
                    </button>
                </div>
            </div>

            <input
                type="file"
                id="rt-import"
                style={{ display: "none" }}
                accept=".json"
                onChange={handleImport}
            />

            <button
                className="fab-main-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="メニュー"
            >
                <span className={`fab-main-icon ${menuOpen ? "rotate" : ""}`}>
                    {menuOpen ? "✕" : "☰"}
                </span>
            </button>
        </div>
    );
}
