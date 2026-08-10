import { useEffect, useRef, useState } from "react";
import "./SymbolArea.css";

export default function SymbolArea({ cur, updateCur }) {
    const lwMax = Math.max(1, Math.ceil(cur.g / 2));
    const rwMax = Math.max(1, Math.ceil(cur.g / 2));
    const bodyMax = cur.r;
    const armLegMax = Math.max(1, Math.ceil(cur.b / 4));

    const lw =
        cur.lwCur !== null && cur.lwCur !== undefined ? cur.lwCur : lwMax;
    const rw =
        cur.rwCur !== null && cur.rwCur !== undefined ? cur.rwCur : rwMax;
    const body =
        cur.bodyCur !== null && cur.bodyCur !== undefined
            ? cur.bodyCur
            : bodyMax;
    const la =
        cur.laCur !== null && cur.laCur !== undefined ? cur.laCur : armLegMax;
    const ra =
        cur.raCur !== null && cur.raCur !== undefined ? cur.raCur : armLegMax;
    const ll =
        cur.llCur !== null && cur.llCur !== undefined ? cur.llCur : armLegMax;
    const rl =
        cur.rlCur !== null && cur.rlCur !== undefined ? cur.rlCur : armLegMax;

    // ★追加: ダメージ演出のためのシェイク状態管理
    const [shakePart, setShakePart] = useState(null);

    // ★追加: 最大値の変動を監視して現在値を自動スライドさせる魔法の処理
    const prevMaxRef = useRef({
        lw: lwMax,
        rw: rwMax,
        body: bodyMax,
        armLeg: armLegMax,
    });

    useEffect(() => {
        const p = prevMaxRef.current;
        // 最大値に一切変化がなければ何もしない
        if (
            p.lw === lwMax &&
            p.rw === rwMax &&
            p.body === bodyMax &&
            p.armLeg === armLegMax
        )
            return;

        const updates = {};
        const check = (key, oldM, newM) => {
            if (oldM === newM) return;
            const current =
                cur[key] !== null && cur[key] !== undefined ? cur[key] : oldM;
            const diff = newM - oldM;
            if (diff > 0) {
                updates[key] = current + diff; // 最大値が増えたら同じだけ増やす
            } else if (current > newM) {
                updates[key] = newM; // 最大値が減って現在値を下回ったら最大値に合わせる
            }
        };

        check("lwCur", p.lw, lwMax);
        check("rwCur", p.rw, rwMax);
        check("bodyCur", p.body, bodyMax);
        check("laCur", p.armLeg, armLegMax);
        check("raCur", p.armLeg, armLegMax);
        check("llCur", p.armLeg, armLegMax);
        check("rlCur", p.armLeg, armLegMax);

        // 変化があった部位を一括更新
        if (Object.keys(updates).length > 0) updateCur(updates);

        // 新しい最大値を記憶
        prevMaxRef.current = {
            lw: lwMax,
            rw: rwMax,
            body: bodyMax,
            armLeg: armLegMax,
        };
    }, [lwMax, rwMax, bodyMax, armLegMax, cur, updateCur]);

    // ボタン操作時の数値増減関数
    const adjustHp = (key, current, maxVal, amount) => {
        let next = current + amount;
        if (next > maxVal) next = maxVal;
        if (next < 0) next = 0;

        // ★追加: ダメージを受けた（減った）時にシェイクをトリガー
        if (next < current) {
            setShakePart(key);
            setTimeout(() => setShakePart(null), 300); // 0.3秒で揺れを止める
        }

        updateCur(key, next);
    };

    const getFillColor = (currentHp) => {
        if (currentHp === 0) return "#4a5568";
        if (currentHp === 1) return "#fca5a5";
        return "#f1f5f9";
    };

    // シェイク用クラスを付与するヘルパー
    const getShakeClass = (key) => (shakePart === key ? " shake-anim" : "");

    const kBase = Math.min(cur.c, cur.m, cur.y);
    const kTotal = Math.min(
        100,
        Math.max(0, kBase + (parseInt(cur.kManual) || 0)),
    );
    const p = kTotal;

    // パネルUI描画用のヘルパー関数
    const renderPanelItem = (keyName, label, current, maxVal) => (
        <div className="panel-item">
            <span className="panel-label">{label}</span>
            <div className="panel-btns">
                <button
                    type="button"
                    onClick={() => adjustHp(keyName, current, maxVal, -1)}
                >
                    -
                </button>
                <button
                    type="button"
                    onClick={() => adjustHp(keyName, current, maxVal, 1)}
                >
                    +
                </button>
            </div>
        </div>
    );

    return (
        <div className="symbol-col">
            <div className="bird-symbol-container">
                <svg
                    className="bird-bg"
                    viewBox="0 10 400 115"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <polygon
                        className={`bird-part${getShakeClass("lwCur")}`}
                        points="-10,10 65,15 120,80"
                        fill={getFillColor(lw)}
                        stroke="#8dee8d"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <polygon
                        className={`bird-part${getShakeClass("rwCur")}`}
                        points="410,10 335,15 280,80"
                        fill={getFillColor(rw)}
                        stroke="#8dee8d"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <polygon
                        className={`bird-part${getShakeClass("laCur")}`}
                        points="75,15 160,30 160,65 130,80"
                        fill={getFillColor(la)}
                        stroke="#8d8dee"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <polygon
                        className={`bird-part${getShakeClass("raCur")}`}
                        points="240,30 325,15 270,80 240,65"
                        fill={getFillColor(ra)}
                        stroke="#8d8dee"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <polygon
                        className={`bird-part${getShakeClass("bodyCur")}`}
                        points="200,15 230,30 230,65 200,80 170,65 170,30"
                        fill={getFillColor(body)}
                        stroke="#ee8d8d"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <polygon
                        className={`bird-part${getShakeClass("llCur")}`}
                        points="165,72 195,87 195,120 135,87"
                        fill={getFillColor(ll)}
                        stroke="#8d8dee"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <polygon
                        className={`bird-part${getShakeClass("rlCur")}`}
                        points="205,87 235,72 265,87 205,120"
                        fill={getFillColor(rl)}
                        stroke="#8d8dee"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* 鳥のイラスト上の重なりUI */}
                <div className="hp-input hp-lw">
                    <input type="number" value={lw} readOnly />
                    <span className="hp-max-label">/{lwMax}</span>
                </div>
                <div className="hp-input hp-rw">
                    <input type="number" value={rw} readOnly />
                    <span className="hp-max-label">/{rwMax}</span>
                </div>
                <div className="hp-input hp-body">
                    <input type="number" value={body} readOnly />
                    <span className="hp-max-label">/{bodyMax}</span>
                </div>
                <div className="hp-input hp-la">
                    <input type="number" value={la} readOnly />
                    <span className="hp-max-label">/{armLegMax}</span>
                </div>
                <div className="hp-input hp-ra">
                    <input type="number" value={ra} readOnly />
                    <span className="hp-max-label">/{armLegMax}</span>
                </div>
                <div className="hp-input hp-ll">
                    <input type="number" value={ll} readOnly />
                    <span className="hp-max-label">/{armLegMax}</span>
                </div>
                <div className="hp-input hp-rl">
                    <input type="number" value={rl} readOnly />
                    <span className="hp-max-label">/{armLegMax}</span>
                </div>
            </div>

            {/* ★横1行にスッキリ収めたコントロールパネル */}
            <div className="hp-control-panel">
                {renderPanelItem("lwCur", "LW", lw, lwMax)}
                {renderPanelItem("laCur", "LA", la, armLegMax)}
                {renderPanelItem("llCur", "LL", ll, armLegMax)}
                {renderPanelItem("bodyCur", "BD", body, bodyMax)}
                {renderPanelItem("rlCur", "RL", rl, armLegMax)}
                {renderPanelItem("raCur", "RA", ra, armLegMax)}
                {renderPanelItem("rwCur", "RW", rw, rwMax)}
            </div>
        </div>
    );
}
