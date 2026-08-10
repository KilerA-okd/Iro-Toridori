import "./RgbBox.css";

export default function RgbBox({ cur, updateCur }) {
    const stats = [
        { key: "r", name: "🟥 剛性 (Rig)", sub: "Rigidity", color: "#f87171" },
        { key: "g", name: "🟩 滑空 (Gli)", sub: "Glide", color: "#4ade80" },
        { key: "b", name: "🟦 均衡 (Bal)", sub: "Balance", color: "#60a5fa" },
    ];

    return (
        <div className="box rgb-box">
            <h3 className="title-rgb">肉体 (RGB)</h3>
            <div className="stats-container">
                {stats.map((s) => {
                    const p = (cur[s.key] / 15) * 100;
                    const trackStyle = {
                        background: `linear-gradient(to right, ${s.color} ${p}%, #fff ${p}%)`,
                    };

                    return (
                        <div className="stat-group-card" key={s.key}>
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
                                        max="15"
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
                                                Math.min(15, cur[s.key] + 1),
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="stat-slider-row">
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
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
