import { SKILL_LIST, SKILL_STATS } from "../utils/skillData";
import "./SkillBox.css";

const CIRCLED_NUMS = ["⓪", "①", "②", "③", "④", "⑤", "⑥"];

export default function SkillBox({ cur, updateCur }) {
    const handleBlockClick = (skillIdx, blockIdx) => {
        // 長さを保証しつつ新しい配列を生成（whileループを1行に短縮）
        const newSkills = Array.from(
            { length: SKILL_LIST.length },
            (_, i) => cur.skills?.[i] || 0,
        );

        const targetLevel = blockIdx + 1;
        newSkills[skillIdx] =
            newSkills[skillIdx] === targetLevel ? 0 : targetLevel;
        updateCur("skills", newSkills);
    };

    return (
        <div className="box skill-box">
            <h3>技能</h3>
            <div className="skill-grid">
                {SKILL_LIST.map((skill, sIdx) => {
                    const phys = SKILL_STATS[skill.phys];
                    const ment = SKILL_STATS[skill.ment];
                    const currentLevel = cur.skills?.[sIdx] || 0;

                    const bgStyle = {
                        background: `linear-gradient(135deg, ${phys.bg} 50%, ${ment.bg} 50%)`,
                    };

                    const physVal = cur[skill.phys.toLowerCase()] || 0;
                    const mentVal = cur[skill.ment.toLowerCase()] || 0;

                    const dice = Math.ceil(mentVal / 10);
                    const target = physVal;
                    const circledZ =
                        CIRCLED_NUMS[currentLevel] || `(${currentLevel})`;

                    return (
                        <div
                            className="skill-item"
                            key={skill.name}
                            style={bgStyle}
                        >
                            <div className="skill-left-pane">
                                <div className="skill-header">
                                    <span className="skill-name">
                                        {skill.name}
                                    </span>
                                    <div className="skill-stat-labels">
                                        <span style={{ color: phys.text }}>
                                            {skill.phys}
                                        </span>
                                        <span className="skill-stat-divider">
                                            /
                                        </span>
                                        <span style={{ color: ment.text }}>
                                            {skill.ment}
                                        </span>
                                    </div>
                                </div>

                                <div className="skill-lv-group">
                                    <span className="skill-lv">
                                        Lv{currentLevel}
                                    </span>
                                    <div className="skill-blocks">
                                        {[0, 1, 2, 3].map((bIdx) => (
                                            <span
                                                key={bIdx}
                                                className={
                                                    bIdx < currentLevel
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    handleBlockClick(sIdx, bIdx)
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="skill-right-pane">
                                <div
                                    className="skill-roll"
                                    title={`ダイス${dice}個 ≦ 目標値${target}`}
                                >
                                    {dice}D≦{target}
                                    <span
                                        style={{
                                            color: "#3182ce",
                                            marginLeft: "2px",
                                        }}
                                    >
                                        {circledZ}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
