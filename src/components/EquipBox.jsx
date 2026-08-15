import "./EquipBox.css";
import { SKILL_LIST } from "../data/skillData";

const SLOT_OPTIONS = ["LW", "RW", "BD", "LA", "RA", "LL", "RL", "HD"];
const TYPE_OPTIONS = ["武器", "装甲", "補助"];

export default function EquipBox({ cur, updateCur }) {
    const equips = Array.isArray(cur.equips) ? cur.equips : [];

    // --- 装備自体の操作 ---
    const addEquip = () => {
        updateCur("equips", [
            ...equips,
            {
                name: "",
                lx: "",
                slot: "LW",
                type: "武器",
                weaponSkill: SKILL_LIST[0].name,
                weaponBonus: 0,
                damageAmt: 1,
                damageRange: 1,
                hpBonus: 0,
                skillModifiers: [],
            },
        ]);
    };

    const updateField = (idx, field, val) => {
        const next = equips.map((eq, i) =>
            i === idx ? { ...eq, [field]: val } : eq,
        );
        updateCur("equips", next);
    };

    const removeEquip = (idx) => {
        updateCur(
            "equips",
            equips.filter((_, i) => i !== idx),
        );
    };

    // --- 🌟 整理: 技能補正の操作 (updateFieldを再利用してスッキリ！) ---
    const addSkillModifier = (eqIdx) => {
        const eq = equips[eqIdx];
        const nextMods = [
            ...(eq.skillModifiers || []),
            { skillName: SKILL_LIST[0].name, value: 0 },
        ];
        updateField(eqIdx, "skillModifiers", nextMods);
    };

    const updateSkillModifier = (eqIdx, modIdx, field, val) => {
        const eq = equips[eqIdx];
        const nextMods = eq.skillModifiers.map((mod, mI) =>
            mI === modIdx ? { ...mod, [field]: val } : mod,
        );
        updateField(eqIdx, "skillModifiers", nextMods);
    };

    const removeSkillModifier = (eqIdx, modIdx) => {
        const eq = equips[eqIdx];
        const nextMods = eq.skillModifiers.filter((_, mI) => mI !== modIdx);
        updateField(eqIdx, "skillModifiers", nextMods);
    };

    // --- 独自の調整ボタン付き数値入力UI ---
    const renderCustomSpinner = (
        value,
        min,
        max,
        onChangeFn,
        isBonus = false,
    ) => {
        const handleAdjust = (amt) => {
            let next = value + amt;
            if (next > max) next = max;
            if (next < min) next = min;
            onChangeFn(next);
        };

        const displayValue = isBonus && value > 0 ? `+${value}` : value;

        return (
            <div className="custom-spinner-wrapper">
                <div className="spinner-display">
                    {displayValue}
                    <input
                        type="number"
                        value={value}
                        min={min}
                        max={max}
                        onChange={(e) => {
                            let next = parseInt(e.target.value) || 0;
                            if (next > max) next = max;
                            if (next < min) next = min;
                            onChangeFn(next);
                        }}
                    />
                </div>
                <div className="spinner-btn-col">
                    <button
                        type="button"
                        className="spinner-btn-up"
                        tabIndex="-1"
                        onClick={() => handleAdjust(1)}
                    >
                        +
                    </button>
                    <button
                        type="button"
                        className="spinner-btn-down"
                        tabIndex="-1"
                        onClick={() => handleAdjust(-1)}
                    >
                        -
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="box equip-box">
            <div className="equip-header">
                <h3>装備</h3>
                <button type="button" className="btn-add" onClick={addEquip}>
                    ＋ 追加
                </button>
            </div>

            <div className="equip-list">
                {equips.map((eq, idx) => (
                    <div key={idx} className="equip-card">
                        {/* 1行目: 名称 ＋ 価値(lx) */}
                        <div className="equip-row row-first">
                            <input
                                type="text"
                                className="eq-name-input"
                                value={eq.name}
                                placeholder="名称"
                                onChange={(e) =>
                                    updateField(idx, "name", e.target.value)
                                }
                            />

                            <div className="eq-lx-wrap">
                                <input
                                    type="number"
                                    value={eq.lx ?? ""}
                                    min="0"
                                    placeholder="0"
                                    onChange={(e) =>
                                        updateField(
                                            idx,
                                            "lx",
                                            e.target.value === ""
                                                ? ""
                                                : parseInt(e.target.value) || 0,
                                        )
                                    }
                                />
                                <span className="eq-lx-unit">lx</span>
                            </div>

                            <button
                                type="button"
                                className="btn-remove-eq"
                                onClick={() => removeEquip(idx)}
                            >
                                ✖
                            </button>
                        </div>

                        {/* 2行目: 種別 ＋ [部位 ＆ 耐久値] */}
                        <div className="equip-row">
                            <div className="eq-pill-group">
                                <span className="pill-title-bg">種別</span>
                                <select
                                    className="eq-type-select-clean"
                                    value={eq.type}
                                    onChange={(e) =>
                                        updateField(idx, "type", e.target.value)
                                    }
                                >
                                    {TYPE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="eq-pill-group">
                                <span className="pill-title-bg">部位</span>
                                <select
                                    value={eq.slot}
                                    onChange={(e) =>
                                        updateField(idx, "slot", e.target.value)
                                    }
                                >
                                    {SLOT_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <span className="pill-title-bg border-left">
                                    耐久値
                                </span>
                                {renderCustomSpinner(
                                    eq.hpBonus || 0,
                                    -9,
                                    9,
                                    (val) => updateField(idx, "hpBonus", val),
                                    true,
                                )}
                            </div>
                        </div>

                        {/* 3行目: 武器専用入力欄 */}
                        {eq.type === "武器" && (
                            <div className="equip-row weapon-row-clean">
                                <div className="eq-pill-group">
                                    <select
                                        value={
                                            eq.weaponSkill || SKILL_LIST[0].name
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                idx,
                                                "weaponSkill",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        {SKILL_LIST.map((s) => (
                                            <option key={s.name} value={s.name}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="pill-title-bg border-left">
                                        補正
                                    </span>
                                    {renderCustomSpinner(
                                        eq.weaponBonus || 0,
                                        -9,
                                        9,
                                        (val) =>
                                            updateField(
                                                idx,
                                                "weaponBonus",
                                                val,
                                            ),
                                        true,
                                    )}
                                </div>

                                <div className="eq-pill-group">
                                    <span
                                        className="pill-title-bg icon-label"
                                        title="ダメージ量"
                                    >
                                        💥
                                    </span>
                                    {renderCustomSpinner(
                                        eq.damageAmt ?? 1,
                                        0,
                                        99,
                                        (val) =>
                                            updateField(idx, "damageAmt", val),
                                        false,
                                    )}

                                    <span
                                        className="pill-title-bg border-left icon-label"
                                        title="攻撃範囲"
                                    >
                                        ⤢
                                    </span>
                                    {renderCustomSpinner(
                                        eq.damageRange ?? 1,
                                        1,
                                        99,
                                        (val) =>
                                            updateField(
                                                idx,
                                                "damageRange",
                                                val,
                                            ),
                                        false,
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 4行目: その他技能補正 */}
                        <div className="equip-row modifier-row-clean">
                            <button
                                type="button"
                                className="btn-add-mod-clean"
                                onClick={() => addSkillModifier(idx)}
                            >
                                ＋ その他技能補正
                            </button>

                            {eq.skillModifiers &&
                                eq.skillModifiers.length > 0 && (
                                    <div className="skill-mod-list-clean">
                                        {eq.skillModifiers.map(
                                            (mod, modIdx) => (
                                                <div
                                                    key={modIdx}
                                                    className="eq-pill-group"
                                                >
                                                    <select
                                                        value={mod.skillName}
                                                        onChange={(e) =>
                                                            updateSkillModifier(
                                                                idx,
                                                                modIdx,
                                                                "skillName",
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
                                                        {SKILL_LIST.map((s) => (
                                                            <option
                                                                key={s.name}
                                                                value={s.name}
                                                            >
                                                                {s.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span className="pill-title-bg border-left">
                                                        補正
                                                    </span>
                                                    {renderCustomSpinner(
                                                        mod.value || 0,
                                                        -9,
                                                        9,
                                                        (val) =>
                                                            updateSkillModifier(
                                                                idx,
                                                                modIdx,
                                                                "value",
                                                                val,
                                                            ),
                                                        true,
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="btn-remove-mod"
                                                        onClick={() =>
                                                            removeSkillModifier(
                                                                idx,
                                                                modIdx,
                                                            )
                                                        }
                                                    >
                                                        ✖
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
