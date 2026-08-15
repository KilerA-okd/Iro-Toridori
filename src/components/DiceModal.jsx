// src/components/DiceModal.jsx
import React, { useState, useEffect } from "react";
import { SKILL_LIST, SKILL_STATS } from "../data/skillData";
import "./DiceModal.css";

const getCircleNum = (num) => {
    const chars = "⓪①②③④⑤⑥⑦⑧⑨⑩";
    return num >= 0 && num <= 10 ? chars[num] : `(${num})`;
};

const getRangeText = (min, max) => {
    if (min > max) return "-";
    if (min === max) return `${min}`;
    return `${min}~${max}`;
};

export default function DiceModal({ isOpen, onClose, cur, updateCur }) {
    const [selectedPhys, setSelectedPhys] = useState("R");
    const [selectedMent, setSelectedMent] = useState("C");
    const [selectedSkillName, setSelectedSkillName] = useState(null);
    const [skillLv, setSkillLv] = useState(0);

    const [physMod, setPhysMod] = useState(0); // 身体補正
    const [mentMod, setMentMod] = useState(0); // 精神補正
    const [diceMod, setDiceMod] = useState(0); // ダイス数補正

    const [rollHistory, setRollHistory] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setRollHistory([]);
            setPhysMod(0);
            setMentMod(0);
            setDiceMod(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const physVal = parseInt(cur[selectedPhys.toLowerCase()]) || 0;
    const mentVal = parseInt(cur[selectedMent.toLowerCase()]) || 0;

    const getSkillLevel = (skill, idx) => {
        if (!cur.skills) return 0;
        if (cur.skills[skill.name] !== undefined)
            return parseInt(cur.skills[skill.name]) || 0;
        const cleanName = skill.name.replace(/[〈〉]/g, "");
        if (cur.skills[cleanName] !== undefined)
            return parseInt(cur.skills[cleanName]) || 0;
        if (cur.skills[idx] !== undefined)
            return parseInt(cur.skills[idx]) || 0;
        return 0;
    };

    const applySkill = (skill, idx) => {
        setSelectedPhys(skill.phys);
        setSelectedMent(skill.ment);
        setSelectedSkillName(skill.name);
        setSkillLv(getSkillLevel(skill, idx));
    };

    const handleSelectPhys = (phys) => {
        setSelectedPhys(phys);
        setSelectedSkillName(null);
        setSkillLv(0);
    };
    const handleSelectMent = (ment) => {
        setSelectedMent(ment);
        setSelectedSkillName(null);
        setSkillLv(0);
    };

    const getRollText = (skill, idx) => {
        const pVal = parseInt(cur[skill.phys.toLowerCase()]) || 0;
        const mVal = parseInt(cur[skill.ment.toLowerCase()]) || 0;
        const lv = getSkillLevel(skill, idx);
        const diceCount = 1 + lv;
        const successLine = pVal + lv;
        const resonance = Math.ceil(mVal / 10);
        return `${diceCount}D≦${successLine}${getCircleNum(resonance)}`;
    };

    const diceCount = Math.max(1, 1 + skillLv + diceMod);
    const finalPhys = Math.max(0, physVal + physMod + skillLv);
    const finalMent = Math.max(0, mentVal + mentMod);
    const resonanceValue = Math.ceil(finalMent / 10);

    const actualCritMax = Math.min(resonanceValue, finalPhys);
    const actualSuccMin = actualCritMax + 1;
    const actualSuccMax = finalPhys;

    const actualFailMin = finalPhys + 1;
    const actualFumbMin = Math.max(actualFailMin, 21 - resonanceValue);
    const actualFailMax = actualFumbMin - 1;

    const critText = getRangeText(1, actualCritMax);
    const succText = getRangeText(actualSuccMin, actualSuccMax);
    const failText = getRangeText(actualFailMin, actualFailMax);
    const fumbText = getRangeText(actualFumbMin, 20);

    const rollDice = () => {
        const rolls = [];
        let successCount = 0;
        let fumbleCount = 0; // 🌟 20に限らず「大失敗」の発生回数をカウント

        for (let i = 0; i < diceCount; i++) {
            const result = Math.floor(Math.random() * 20) + 1;
            let type = "通常失敗";
            let typeClass = "fail";
            let score = 0;

            if (result <= actualCritMax) {
                type = "大成功";
                typeClass = "crit";
                score = 2;
            } else if (result <= actualSuccMax) {
                type = "通常成功";
                typeClass = "succ";
                score = 1;
            } else if (result >= actualFumbMin) {
                // 🌟 大失敗判定
                type = "大失敗";
                typeClass = "fumb";
                score = -1;
                fumbleCount++;
            } else {
                type = "通常失敗";
                typeClass = "fail";
                score = 0;
            }

            successCount += score;
            rolls.push({ die: result, type, typeClass, score });
        }

        const newResult = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            skillName: selectedSkillName || "マニュアル判定",
            successLine: finalPhys,
            resonanceValue: resonanceValue,
            rolls,
            totalSuccess: successCount,
            fumbleCount,
        };

        setRollHistory((prev) => [newResult, ...prev]);

        // 🌟 カルマ補正値（kManual）への加算処理
        if (fumbleCount > 0) {
            const currentKManual = parseInt(cur.kManual) || 0;
            updateCur("kManual", currentKManual + fumbleCount * 5);
        }
    };

    return (
        <div className="dice-overlay" onClick={onClose}>
            <div
                className="dice-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="dice-modal-header">
                    <h3>🎲 パレット・ロール</h3>
                    <button className="dice-close-btn" onClick={onClose}>
                        ×
                    </button>
                </header>

                <div className="dice-modal-layout">
                    {/* 左側：所持技能 */}
                    <aside className="skill-sidebar">
                        <div className="sidebar-title">所持技能</div>
                        <ul className="skill-list">
                            {SKILL_LIST.map((skill, idx) => {
                                const isActive =
                                    selectedSkillName === skill.name;
                                const physStat = SKILL_STATS[skill.phys];
                                const mentStat = SKILL_STATS[skill.ment];

                                return (
                                    <li
                                        key={idx}
                                        className={`skill-list-item ${isActive ? "active" : ""}`}
                                        onClick={() => applySkill(skill, idx)}
                                    >
                                        <div className="dm-skill-row">
                                            <span className="skill-name">
                                                {skill.name}
                                            </span>
                                            <div className="dm-skill-meta">
                                                <span
                                                    className="dm-stat-badge"
                                                    style={{
                                                        background: physStat.bg,
                                                        color: physStat.text,
                                                    }}
                                                >
                                                    {skill.phys}
                                                </span>
                                                <span className="dm-stat-cross">
                                                    ×
                                                </span>
                                                <span
                                                    className="dm-stat-badge"
                                                    style={{
                                                        background: mentStat.bg,
                                                        color: mentStat.text,
                                                    }}
                                                >
                                                    {skill.ment}
                                                </span>
                                                <span className="skill-roll-text">
                                                    {getRollText(skill, idx)}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </aside>

                    {/* 中央：値調整 ＆ ロール実行 */}
                    <main className="dice-main-content">
                        <div className="dm-status-and-mods">
                            {/* 左カラム：身体 */}
                            <div className="dm-stat-column">
                                <div className="dm-shape-group">
                                    <div className="dm-shape-row">
                                        <button
                                            className={`dm-shape-btn dm-shape-rect dm-bg-r ${selectedPhys === "R" ? "active" : ""}`}
                                            onClick={() =>
                                                handleSelectPhys("R")
                                            }
                                        >
                                            <span className="shape-val-text">
                                                {selectedPhys === "R" &&
                                                    physVal}
                                            </span>
                                        </button>
                                        <button
                                            className={`dm-shape-btn dm-shape-rect dm-bg-b ${selectedPhys === "B" ? "active" : ""}`}
                                            onClick={() =>
                                                handleSelectPhys("B")
                                            }
                                        >
                                            <span className="shape-val-text">
                                                {selectedPhys === "B" &&
                                                    physVal}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dm-shape-row center">
                                        <button
                                            className={`dm-shape-btn dm-shape-rect dm-bg-g ${selectedPhys === "G" ? "active" : ""}`}
                                            onClick={() =>
                                                handleSelectPhys("G")
                                            }
                                        >
                                            <span className="shape-val-text">
                                                {selectedPhys === "G" &&
                                                    physVal}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="dm-mod-col">
                                    <label>身体補正</label>
                                    <div className="dm-stepper">
                                        <button
                                            onClick={() =>
                                                setPhysMod((p) => p - 1)
                                            }
                                        >
                                            -
                                        </button>
                                        <span className="dm-mod-val">
                                            {physMod > 0
                                                ? `+${physMod}`
                                                : physMod}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setPhysMod((p) => p + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="dm-shape-cross">✖</div>

                            {/* 右カラム：精神 */}
                            <div className="dm-stat-column">
                                <div className="dm-shape-group">
                                    <div className="dm-shape-row center">
                                        <button
                                            className={`dm-shape-btn dm-shape-circle dm-bg-m ${selectedMent === "M" ? "active" : ""}`}
                                            onClick={() =>
                                                handleSelectMent("M")
                                            }
                                        >
                                            <span className="shape-val-text">
                                                {selectedMent === "M" &&
                                                    mentVal}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="dm-shape-row">
                                        <button
                                            className={`dm-shape-btn dm-shape-circle dm-bg-y ${selectedMent === "Y" ? "active" : ""}`}
                                            onClick={() =>
                                                handleSelectMent("Y")
                                            }
                                        >
                                            <span className="shape-val-text">
                                                {selectedMent === "Y" &&
                                                    mentVal}
                                            </span>
                                        </button>
                                        <button
                                            className={`dm-shape-btn dm-shape-circle dm-bg-c ${selectedMent === "C" ? "active" : ""}`}
                                            onClick={() =>
                                                handleSelectMent("C")
                                            }
                                        >
                                            <span className="shape-val-text">
                                                {selectedMent === "C" &&
                                                    mentVal}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="dm-mod-col">
                                    <label>精神補正</label>
                                    <div className="dm-stepper">
                                        <button
                                            onClick={() =>
                                                setMentMod((p) => p - 1)
                                            }
                                        >
                                            -
                                        </button>
                                        <span className="dm-mod-val">
                                            {mentMod > 0
                                                ? `+${mentMod}`
                                                : mentMod}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setMentMod((p) => p + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* その他の補正 */}
                        <div className="dm-bottom-modifiers">
                            <div className="dm-mod-col">
                                <label>技能レベル</label>
                                <div className="dm-skill-lv-display">
                                    Lv {skillLv}
                                </div>
                            </div>
                            <div className="dm-mod-plus">＋</div>
                            <div className="dm-mod-col">
                                <label>ダイス数補正</label>
                                <div className="dm-stepper">
                                    <button
                                        onClick={() => setDiceMod((p) => p - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="dm-mod-val">
                                        {diceMod > 0 ? `+${diceMod}` : diceMod}
                                    </span>
                                    <button
                                        onClick={() => setDiceMod((p) => p + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 下部：ロール実行ボタン ＆ 六角形範囲表示 */}
                        <div className="dm-execute-wrapper">
                            <button
                                className="dm-roll-execute-btn"
                                onClick={rollDice}
                            >
                                <div className="dm-roll-dice-count">
                                    {diceCount}D20
                                </div>
                                <div className="dm-roll-ranges">
                                    <div className="hex-wrap crit">
                                        <div className="hex-inner crit">
                                            {critText}
                                        </div>
                                    </div>
                                    <div className="hex-wrap succ">
                                        <div className="hex-inner succ">
                                            {succText}
                                        </div>
                                    </div>
                                    <div className="hex-wrap fail">
                                        <div className="hex-inner fail">
                                            {failText}
                                        </div>
                                    </div>
                                    <div className="hex-wrap fumb">
                                        <div className="hex-inner fumb">
                                            {fumbText}
                                        </div>
                                    </div>
                                </div>
                                <div className="dm-roll-text">ロール実行！</div>
                            </button>
                        </div>
                    </main>

                    {/* 右側：ロール履歴 */}
                    <aside className="dice-history-sidebar">
                        <div className="sidebar-title">ロール履歴</div>
                        <div className="history-scroll-container">
                            {rollHistory.length > 0 ? (
                                rollHistory.map((historyItem, index) => (
                                    <div
                                        key={historyItem.id}
                                        className={`history-card ${index === 0 ? "latest" : ""}`}
                                    >
                                        <div className="history-header">
                                            <span className="history-skill">
                                                {historyItem.skillName}{" "}
                                                <span className="history-meta">
                                                    (成功≦
                                                    {historyItem.successLine} /
                                                    共鳴値:
                                                    {historyItem.resonanceValue}
                                                    )
                                                </span>
                                            </span>
                                            <span className="history-time">
                                                {historyItem.timestamp}
                                            </span>
                                        </div>
                                        <div className="dice-pool">
                                            {historyItem.rolls.map((r, i) => (
                                                <div
                                                    key={i}
                                                    className={`hex-wrap small ${r.typeClass}`}
                                                >
                                                    <div
                                                        className={`hex-inner small ${r.typeClass}`}
                                                    >
                                                        <span className="die-num">
                                                            {r.die}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="total-success-badge">
                                            最終成功数:{" "}
                                            <span>
                                                {historyItem.totalSuccess}
                                            </span>
                                        </div>
                                        {/* 🌟 大失敗時の警告文言を修正 */}
                                        {historyItem.fumbleCount > 0 && (
                                            <div className="fumble-warning">
                                                ⚠️ 大失敗が{" "}
                                                {historyItem.fumbleCount}{" "}
                                                個発生！ カルマ補正{" "}
                                                <b>
                                                    +
                                                    {historyItem.fumbleCount *
                                                        5}
                                                </b>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="results-placeholder">
                                    結果履歴
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
