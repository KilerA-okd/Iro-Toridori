// src/components/RulebookModal.jsx
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rulebookText from "../data/rulebook.md?raw"; // 🌟 マークダウンを読み込む
import "./RulebookModal.css";

const cleanedRulebookText = rulebookText
    ? rulebookText.replace(/<!--[\s\S]*?-->/g, "")
    : "";

export default function RulebookModal({ isOpen, onClose }) {
    const [currentPage, setCurrentPage] = useState(0); // 見開き単位のインデックス
    const [maxPage, setMaxPage] = useState(0);
    const [flipAnim, setFlipAnim] = useState("none");
    const scrollContainerRef = useRef(null);

    // 🌟 左右ページの間隔（CSSの column-gap と完全に一致させる）
    const COLUMN_GAP = 100;

    const currentPageRef = useRef(currentPage);
    useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    // 🌟 マークダウンテキストから「# 」（H1）を抽出して付箋（タブ）を自動生成する
    const tabs = [];
    if (cleanedRulebookText) {
        const lines = cleanedRulebookText.split("\n");
        lines.forEach((line) => {
            if (line.startsWith("# ")) {
                const title = line.replace("# ", "").trim();
                const id = `chapter-${title.replace(/\s+/g, "-")}`;
                tabs.push({ id, title });
            }
        });
    }

    // レンダリング後に「全部で何ページになったか」を自動計算する
    useEffect(() => {
        if (!isOpen) return;

        const adjustLayout = () => {
            const container = scrollContainerRef.current;
            if (!container) return;

            const viewWidth = container.clientWidth + COLUMN_GAP;
            const totalWidth = container.scrollWidth;

            // 1. 最大ページ数を再計算
            const newMaxPage = Math.max(
                0,
                Math.ceil(totalWidth / viewWidth) - 1,
            );
            setMaxPage(newMaxPage);

            // 2. 画面が狭くなって最大ページ数が減った場合、範囲外にならないよう安全なページへ移動
            const safePage = Math.min(currentPageRef.current, newMaxPage);
            if (safePage !== currentPageRef.current) {
                setCurrentPage(safePage);
            }

            // 3. スクロールのズレを補正し、現在のページの先頭にピタッと強制スナップ
            container.scrollLeft = safePage * viewWidth;
        };

        // 開いた直後に一度レイアウト計算（DOM描画を待つために少し遅延）
        const initialTimer = setTimeout(adjustLayout, 200);

        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            // パフォーマンス低下を防ぐため、ウィンドウのリサイズが落ち着いた瞬間（150ms後）に位置を合わせる
            resizeTimer = setTimeout(adjustLayout, 150);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(initialTimer);
            clearTimeout(resizeTimer);
            window.removeEventListener("resize", handleResize);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // 🌟 単一ページめくり
    const turnPage = (direction) => {
        if (flipAnim !== "none") return;
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth + COLUMN_GAP;

        if (direction === "next" && currentPage < maxPage) {
            setFlipAnim("next");
            setTimeout(() => {
                container.scrollLeft += scrollAmount;
                setCurrentPage((p) => p + 1);
            }, 150);
            setTimeout(() => setFlipAnim("none"), 300);
        } else if (direction === "prev" && currentPage > 0) {
            setFlipAnim("prev");
            setTimeout(() => {
                container.scrollLeft -= scrollAmount;
                setCurrentPage((p) => p - 1);
            }, 150);
            setTimeout(() => setFlipAnim("none"), 300);
        }
    };

    // 🌟 付箋タップ時（対象のセクションまで距離を測ってジャンプ）
    const jumpToChapter = (chapterId) => {
        if (flipAnim !== "none") return;
        const container = scrollContainerRef.current;
        const targetEl = document.getElementById(chapterId);
        if (!container || !targetEl) return;

        const containerRect = container.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const offset =
            targetRect.left - containerRect.left + container.scrollLeft;
        const scrollAmount = container.clientWidth + COLUMN_GAP;

        const targetPage = Math.floor(
            (offset + scrollAmount / 4) / scrollAmount,
        );

        if (targetPage === currentPage) return;

        const isForward = targetPage > currentPage;
        setFlipAnim(isForward ? "multi-next" : "multi-prev");

        setTimeout(() => {
            container.scrollLeft = targetPage * scrollAmount;
            setCurrentPage(targetPage);
        }, 250);
        setTimeout(() => setFlipAnim("none"), 500);
    };

    return (
        <div className="rulebook-overlay no-print" onClick={onClose}>
            <div className="book-stage" onClick={(e) => e.stopPropagation()}>
                <button className="book-close-btn" onClick={onClose}>
                    ×
                </button>
                <div
                    className={`book-container ${flipAnim !== "none" ? "is-animating" : ""}`}
                >
                    {/* 🌟 抽出したデータから付箋（タブ）を描画 */}
                    <div className="book-tabs">
                        {tabs.map((tab, i) => {
                            const tabColors = [
                                "#b45309",
                                "#15803d",
                                "#0f766e",
                                "#4338ca",
                                "#a21caf",
                            ];
                            const bgColor = tabColors[i % tabColors.length];
                            const [chapterNum, chapterName] =
                                tab.title.split("：");
                            return (
                                <button
                                    key={tab.id}
                                    className="book-tab"
                                    style={{ backgroundColor: bgColor }}
                                    onClick={() => jumpToChapter(tab.id)}
                                >
                                    <div className="tab-text">
                                        <span className="tab-chapter">
                                            {chapterNum}
                                        </span>
                                        {chapterName && (
                                            <span className="tab-title">
                                                {chapterName}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="book-spread">
                        {/* 背景の固定UI（影、ページ番号、ボタン） */}
                        <div className="book-spine-shadow"></div>
                        <div className="page-number left-number">
                            {currentPage * 2 + 1}
                        </div>
                        <div className="page-number right-number">
                            {currentPage * 2 + 2}
                        </div>

                        <button
                            className="page-turn-btn prev-btn"
                            onClick={() => turnPage("prev")}
                            disabled={currentPage === 0}
                        >
                            ◀ 前へ
                        </button>
                        <button
                            className="page-turn-btn next-btn"
                            onClick={() => turnPage("next")}
                            disabled={currentPage >= maxPage}
                        >
                            次へ ▶
                        </button>

                        <div className="book-page-padding">
                            <div
                                className="book-columns-scroll"
                                ref={scrollContainerRef}
                            >
                                <div className="book-columns-content">
                                    {/* 🌟 React Markdown による描画 */}
                                    <ReactMarkdown
                                        components={{
                                            // # 章タイトル (自動的に新しいページへ送る)
                                            h1: ({
                                                node,
                                                children,
                                                ...props
                                            }) => {
                                                const title = String(children);
                                                const id = `chapter-${title.replace(/\s+/g, "-")}`;
                                                return (
                                                    <h1
                                                        id={id}
                                                        className="chapter-title break-before"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </h1>
                                                );
                                            },
                                            // ## セクションタイトル (自動的に新しいページへ送る)
                                            h2: ({ node, ...props }) => (
                                                <h2
                                                    className="section-title break-before"
                                                    {...props}
                                                />
                                            ),
                                            // ### 小見出し
                                            h3: ({ node, ...props }) => (
                                                <h3
                                                    className="book-subheading"
                                                    {...props}
                                                />
                                            ),
                                            // 普通のテキスト
                                            p: ({ node, ...props }) => (
                                                <p
                                                    className="book-paragraph section-rich-text"
                                                    {...props}
                                                />
                                            ),
                                            // **太字**
                                            strong: ({ node, ...props }) => (
                                                <strong
                                                    className="book-bold"
                                                    {...props}
                                                />
                                            ),
                                            // *斜体 (赤字アクセントに利用)*
                                            em: ({ node, ...props }) => (
                                                <span
                                                    className="book-accent"
                                                    {...props}
                                                />
                                            ),
                                            // 箇条書き
                                            ul: ({ node, ...props }) => (
                                                <ul
                                                    style={{
                                                        padding: 0,
                                                        margin: "0 0 16px 0",
                                                        listStyle: "none",
                                                    }}
                                                    {...props}
                                                />
                                            ),
                                            li: ({
                                                node,
                                                children,
                                                ...props
                                            }) => (
                                                <li
                                                    className="book-list-item"
                                                    {...props}
                                                >
                                                    <span className="list-bullet">
                                                        ◆
                                                    </span>
                                                    <div>{children}</div>
                                                </li>
                                            ),
                                            // 画像
                                            img: ({ node, ...props }) => (
                                                <img
                                                    className="book-inline-image"
                                                    {...props}
                                                    alt={props.alt || "挿絵"}
                                                />
                                            ),
                                        }}
                                    >
                                        {cleanedRulebookText}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* 3Dめくりアニメーション用レイヤー */}
                        {flipAnim === "next" && (
                            <div className="flip-page flip-next"></div>
                        )}
                        {flipAnim === "prev" && (
                            <div className="flip-page flip-prev"></div>
                        )}
                        {flipAnim === "multi-next" &&
                            [...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flip-page flip-next multi"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                ></div>
                            ))}
                        {flipAnim === "multi-prev" &&
                            [...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flip-page flip-prev multi"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                ></div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
