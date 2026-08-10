import React from "react";
import "./LogoArea.css";

export default function LogoArea({ cur }) {
    // RGB (肉体) の色計算
    const rColor = (cur.r / 15) * 255;
    const gColor = (cur.g / 15) * 255;
    const bColor = (cur.b / 15) * 255;
    const rgbColor = `rgb(${rColor}, ${gColor}, ${bColor})`;

    // CMY (精神) の色計算
    const kBase = Math.min(cur.c, cur.m, cur.y);
    const c = cur.c / 100;
    const m = cur.m / 100;
    const y = cur.y / 100;
    const k = kBase / 100;
    const cmyColor = `rgb(${255 * (1 - c) * (1 - k)}, ${255 * (1 - m) * (1 - k)}, ${255 * (1 - y) * (1 - k)})`;

    return (
        <div className="top-center-logo">
            {/* 肉体側: 角ばった形（左側奥） */}
            <div
                className="logo-bg-shape logo-shape-rgb"
                style={{ backgroundColor: rgbColor }}
                title="肉体の色"
            ></div>

            {/* 精神側: 丸い形（右側奥） */}
            <div
                className="logo-bg-shape logo-shape-cmy"
                style={{ backgroundColor: cmyColor }}
                title="精神の色"
            ></div>

            {/* 中央のロゴ画像コンテナ */}
            <div className="logo-image-wrapper">
                <img
                    src="/logo.png"
                    alt="彩鳥々ロゴ"
                    className="logo-img-large"
                    onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                    }}
                />
                <span className="logo-alt-fallback" style={{ display: "none" }}>
                    彩鳥々
                </span>
            </div>
        </div>
    );
}
