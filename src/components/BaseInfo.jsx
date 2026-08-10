import { BIRD_SPECIES_MAP } from "../utils/birdData";
import "./BaseInfo.css";

export default function BaseInfo({ cur, updateCur }) {
    const suggestions = BIRD_SPECIES_MAP[cur.type] || [];

    const handleAgeChange = (amount) => {
        let val = (parseInt(cur.age) || 0) + amount;
        if (val < 0) val = 0;
        updateCur("age", String(val));
    };

    return (
        <div className="top-left-info">
            <div className="base-row">
                {/* 1行目: 名前 */}
                <label className="input-group w-full">
                    <span className="group-label">名前</span>
                    <input
                        type="text"
                        value={cur.name}
                        onChange={(e) => updateCur("name", e.target.value)}
                        placeholder="キャラクター名"
                    />
                </label>
            </div>

            <div className="base-row">
                {/* 2行目: タイプ */}
                <label className="input-group" style={{ flex: 1 }}>
                    <span className="group-label">タイプ</span>
                    <select
                        value={cur.type}
                        onChange={(e) => {
                            // 🌟 複数項目の同時更新 (オブジェクト渡しを活用)
                            updateCur({
                                type: e.target.value,
                                species: "",
                            });
                        }}
                    >
                        {Object.keys(BIRD_SPECIES_MAP).map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </label>

                {/* 2行目: 年齢 (一体型コントロール) */}
                <div className="input-group age-container">
                    <span className="group-label">年齢</span>
                    <button
                        type="button"
                        className="btn-age"
                        onClick={() => handleAgeChange(-1)}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={cur.age}
                        onChange={(e) => updateCur("age", e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn-age"
                        onClick={() => handleAgeChange(1)}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="base-row">
                {/* 3行目: モデル */}
                <label className="input-group" style={{ flex: 1 }}>
                    <span className="group-label">モデル</span>
                    <input
                        type="text"
                        value={cur.species}
                        onChange={(e) => updateCur("species", e.target.value)}
                        list="species-options"
                    />
                    <datalist id="species-options">
                        {suggestions.map((s) => (
                            <option key={s} value={s} />
                        ))}
                    </datalist>
                </label>

                {/* 3行目: 性別 */}
                <label className="input-group gender-container">
                    <span className="group-label">性別</span>
                    <select
                        className="gender-select"
                        value={cur.gender}
                        onChange={(e) => updateCur("gender", e.target.value)}
                    >
                        <option value=""></option>
                        <option value="♂">♂</option>
                        <option value="♀">♀</option>
                        <option value="☿">☿</option>
                    </select>
                </label>
            </div>
        </div>
    );
}
