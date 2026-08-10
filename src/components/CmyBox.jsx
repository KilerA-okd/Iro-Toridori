/* CMY uses the same stat/range styles as RGB; shared in RgbBox.css */
import "./CmyBox.css";

export default function CmyBox({ cur, updateCur }) {
    const stats = [
        { key: "c", name: "🔵 明晰 (Cla)", sub: "Clarity", color: "#22d3ee" },
        {
            key: "m",
            name: "🔴 動機 (Mot)",
            sub: "Motivation",
            color: "#f472b6",
        },
        { key: "y", name: "🟡 憧憬 (Yea)", sub: "Yearning", color: "#fbbf24" },
    ];

    return (
        <div className="box cmy-box">
            <h3 className="title-cmy">精神 (CMY)</h3>
            <div className="stats-container">
                {stats.map((s) => {
                    const p = cur[s.key];
                    const trackStyle = {
                        background: `linear-gradient(to right, ${s.color} ${p}%, #1a202c ${p}%)`,
                    };

                    return (
                        <div className="stat-group-card" key={s.key}>
                            {/* 上段: ラベルと数値コントロール */}
                            <div className="stat-input-row">
                                <div className="stat-label-area" title={s.sub}>
                                    <span className="stat-name">{s.name}</span>
                                </div>

                                <div className="stat-control-area">
                                    <button
                                        type="button"
                                        className="btn-stat-step"
                                        onClick={() =>
                                            updateCur(
                                                s.key,
                                                Math.max(0, cur[s.key] - 1),
                                            )
                                        }
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={cur[s.key]}
                                        onChange={(e) =>
                                            updateCur(
                                                s.key,
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        onKeyDown={(e) => e.preventDefault()}
                                        style={{
                                            cursor: "default",
                                            caretColor: "transparent",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-stat-step"
                                        onClick={() =>
                                            updateCur(
                                                s.key,
                                                Math.min(100, cur[s.key] + 1),
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* 下段: スライダー */}
                            <div className="stat-slider-row">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={cur[s.key]}
                                    style={trackStyle}
                                    onChange={(e) =>
                                        updateCur(
                                            s.key,
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
