import { useState, useRef, useEffect } from "react";
import "./App.css";
import ActionMenu from "./components/ActionMenu";
import BinderTabs from "./components/BinderTabs";
import BaseInfo from "./components/BaseInfo";
import LogoArea from "./components/LogoArea";
import History from "./components/History";
import RgbBox from "./components/RgbBox";
import SymbolArea from "./components/SymbolArea";
import CmyBox from "./components/CmyBox";
import EquipBox from "./components/EquipBox";
import SkillBox from "./components/SkillBox";
import ItemsBox from "./components/ItemsBox";
import MemoBox from "./components/MemoBox";
import RulebookModal from "./components/RulebookModal";
import DiceModal from "./components/DiceModal";

// 🌟 初期IDもUUIDで安全に生成
const createNewCharacter = (id = crypto.randomUUID()) => ({
    id,
    name: `キャラクター`,
    age: "15",
    gender: "",
    type: "小鳥型",
    species: "",
    history: "",
    r: 5,
    g: 5,
    b: 5,
    c: 30,
    m: 30,
    y: 30,
    kManual: 0,
    skills: Array(6).fill(0),
    equips: [
        {
            name: "",
            lx: "",
            slot: "LW",
            type: "武器",
            weaponSkill: "〈解体〉",
            weaponBonus: 0,
            damageAmt: 1,
            damageRange: 1,
            hpBonus: 0,
            skillModifiers: [],
        },
    ],
    items: [{ name: "", lx: "", qty: 1 }],
    memo: "",
    chips: 45,
    lwCur: null,
    rwCur: null,
    bodyCur: null,
    laCur: null,
    raCur: null,
    llCur: null,
    rlCur: null,
});

export default function App() {
    const [tabs, setTabs] = useState([createNewCharacter()]);
    const [activeId, setActiveId] = useState(tabs[0].id);
    const [isRulebookOpen, setIsRulebookOpen] = useState(false);
    const [isDiceModalOpen, setIsDiceModalOpen] = useState(false);
    const [isDiceHovered, setIsDiceHovered] = useState(false);

    const cur = tabs.find((t) => t.id === activeId) || tabs[0];

    const updateCur = (keyOrObj, val) => {
        setTabs((prevTabs) =>
            prevTabs.map((t) => {
                if (t.id !== activeId) return t;
                if (typeof keyOrObj === "object") {
                    return { ...t, ...keyOrObj };
                }
                return { ...t, [keyOrObj]: val };
            }),
        );
    };

    const containerRef = useRef(null);
    const sheetRef = useRef(null);

    useEffect(() => {
        const getScaleForWidth = (w) => {
            if (w >= 1400) return 1.28;
            if (w >= 1100) return 1.08;
            if (w >= 900) return 0.96;
            if (w >= 700) return 0.84;
            return 0.72;
        };

        const updateScale = () => {
            const sheet = sheetRef.current;
            if (!sheet) return;

            sheet.style.transform = "none";
            const rect = sheet.getBoundingClientRect();
            const sheetH = rect.height || sheet.offsetHeight;
            const ww =
                window.innerWidth || document.documentElement.clientWidth;
            const scale = getScaleForWidth(ww);

            sheet.style.transform = `scale(${scale})`;
            sheet.style.transformOrigin = "top center";

            const container = containerRef.current;
            if (container) {
                container.style.minHeight = `${Math.ceil(sheetH * scale) + 40}px`;
            }
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        const ro = new ResizeObserver(updateScale);
        if (sheetRef.current) ro.observe(sheetRef.current);

        return () => {
            window.removeEventListener("resize", updateScale);
            ro.disconnect();
        };
    }, [activeId]);

    const kBase = Math.min(cur.c, cur.m, cur.y);
    const kTotal = Math.min(
        100,
        Math.max(0, kBase + (parseInt(cur.kManual) || 0)),
    );

    return (
        <div className="app-container desk-surface-overall">
            <main id="sheet-container">
                <div className="sheet-zoom" ref={containerRef}>
                    <div className="sheet-scale-wrapper" ref={sheetRef}>
                        <div className="desk-items-anchor">
                            {/* ダイスAをクリックした時にモーダルを開く */}
                            <img
                                src="/dice.png"
                                alt="ダイス"
                                className={`desk-item dice-a no-print ${isDiceHovered ? "hover-active" : ""}`}
                                onClick={() => setIsDiceModalOpen(true)}
                                onMouseEnter={() => setIsDiceHovered(true)}
                                onMouseLeave={() => setIsDiceHovered(false)}
                                title="行為判定（ダイスロール）"
                            />

                            {/* ダイスBをクリックした時も同じモーダルを開く */}
                            <img
                                src="/dice.png"
                                alt="ダイス"
                                className={`desk-item dice-b no-print ${isDiceHovered ? "hover-active" : ""}`}
                                onClick={() => setIsDiceModalOpen(true)}
                                onMouseEnter={() => setIsDiceHovered(true)}
                                onMouseLeave={() => setIsDiceHovered(false)}
                                title="行為判定（ダイスロール）"
                            />
                            {
                                <img
                                    src="/pen.png"
                                    alt="ペン"
                                    className="desk-item pen-a no-print"
                                />
                            }
                            {/* 📖 ルールブックを開く「本」オブジェクト */}
                            <img
                                src="/book.png"
                                alt="ルールブック"
                                className="desk-item book-a no-print"
                                onClick={() => setIsRulebookOpen(true)}
                                title="ルールブックを開く"
                            />
                            <div className="sheet-flip-wrapper" key={activeId}>
                                <div className="binder-cover no-print"></div>
                                <div className="sheet-dummy-paper"></div>
                                <div className="sheet-animating-group">
                                    <div className="sheet a4-portrait">
                                        {/* 上段 */}
                                        <div className="layout-row row-top">
                                            <div className="top-column">
                                                <BaseInfo
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                                <RgbBox
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                            </div>
                                            <div className="top-column">
                                                <LogoArea cur={cur} />
                                                <SymbolArea
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                            </div>
                                            <div className="top-column">
                                                <History
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                                <CmyBox
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                            </div>
                                        </div>

                                        {/* 下段 */}
                                        <div className="layout-row row-bottom">
                                            <div className="bottom-left">
                                                <EquipBox
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                                <ItemsBox
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                            </div>

                                            <div className="bottom-right">
                                                <div className="box karma-meter">
                                                    <div className="karma-header">
                                                        <span className="karma-title">
                                                            ⬛ カルマ (Kar)
                                                        </span>
                                                        <div className="karma-labels">
                                                            <span className="k-label">
                                                                自動：{" "}
                                                                <b>{kBase}</b>
                                                            </span>
                                                            <span className="k-label">
                                                                ＋補正：
                                                                <div className="step-control-side karma-step">
                                                                    <button
                                                                        type="button"
                                                                        className="btn-step-side"
                                                                        onClick={() =>
                                                                            updateCur(
                                                                                "kManual",
                                                                                (parseInt(
                                                                                    cur.kManual,
                                                                                ) ||
                                                                                    0) -
                                                                                    1,
                                                                            )
                                                                        }
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        value={
                                                                            cur.kManual
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateCur(
                                                                                "kManual",
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ) ||
                                                                                    0,
                                                                            )
                                                                        }
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn-step-side"
                                                                        onClick={() =>
                                                                            updateCur(
                                                                                "kManual",
                                                                                (parseInt(
                                                                                    cur.kManual,
                                                                                ) ||
                                                                                    0) +
                                                                                    1,
                                                                            )
                                                                        }
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                                ＝
                                                            </span>
                                                            <span className="k-total">
                                                                {" "}
                                                                <b>
                                                                    {kTotal}
                                                                </b>{" "}
                                                                <span className="k-max">
                                                                    /100
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="karma-bar-container">
                                                        <div
                                                            className="karma-bar-fill"
                                                            style={{
                                                                width: `${kTotal}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <SkillBox
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                                <MemoBox
                                                    cur={cur}
                                                    updateCur={updateCur}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <BinderTabs
                                        tabs={tabs}
                                        activeId={activeId}
                                        setActiveId={setActiveId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* ルールブックモーダル本体 */}
            <RulebookModal
                isOpen={isRulebookOpen}
                onClose={() => setIsRulebookOpen(false)}
            />
            {/* ダイスモーダル本体 */}
            <DiceModal
                isOpen={isDiceModalOpen}
                onClose={() => setIsDiceModalOpen(false)}
                cur={cur}
                updateCur={updateCur}
            />
            {/* 🌟 画面右下に独立して固定されるメニューボタン */}
            <ActionMenu
                tabs={tabs}
                activeId={activeId}
                setActiveId={setActiveId}
                setTabs={setTabs}
                createNewCharacter={createNewCharacter}
                cur={cur}
            />
        </div>
    );
}
