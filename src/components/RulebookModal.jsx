import React, { useState, useRef, useEffect } from "react";
import { RULEBOOK_DATA } from "../data/rulebookData";
import "./RulebookModal.css";

// リッチテキスト変換関数（変更なし）
const renderRichText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("[img:") && trimmed.endsWith("]")) {
            const url = trimmed.slice(5, -1);
            return (
                <img
                    key={i}
                    src={url}
                    alt="挿絵"
                    className="book-inline-image"
                />
            );
        }
        if (trimmed.startsWith("### ")) {
            return (
                <h5 key={i} className="book-subheading">
                    {trimmed.substring(4)}
                </h5>
            );
        }
        let isList = false;
        let contentStr = line;
        if (trimmed.startsWith("- ")) {
            isList = true;
            contentStr = trimmed.substring(2);
        }
        const parts = contentStr.split(/(\*\*.*?\*\*|==.*?==)/g);
        const lineContent = parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**"))
                return (
                    <strong key={j} className="book-bold">
                        {part.slice(2, -2)}
                    </strong>
                );
            if (part.startsWith("==") && part.endsWith("=="))
                return (
                    <strong key={j} className="book-accent">
                        {part.slice(2, -2)}
                    </strong>
                );
            return part;
        });
        if (trimmed === "") return <div key={i} className="book-spacer"></div>;
        if (isList)
            return (
                <div key={i} className="book-list-item">
                    <span className="list-bullet">◆</span>
                    {lineContent}
                </div>
            );
        return (
            <div key={i} className="book-paragraph">
                {lineContent}
            </div>
        );
    });
};

export default function RulebookModal({ isOpen, onClose }) {
    const [currentPage, setCurrentPage] = useState(0); // 見開き単位のインデックス
    const [maxPage, setMaxPage] = useState(0);
    const [flipAnim, setFlipAnim] = useState("none");
    const scrollContainerRef = useRef(null);

    // 🌟 左右ページの間隔（CSSの column-gap と完全に一致させる）
    const COLUMN_GAP = 100;

    // レンダリング後に「全部で何ページになったか」を自動計算する
    useEffect(() => {
        if (!isOpen) return;
        const calcMaxPage = () => {
            const container = scrollContainerRef.current;
            if (container) {
                // 自動生成されたカラムの総幅から、最大見開き数を計算
                const totalWidth = container.scrollWidth;
                const viewWidth = container.clientWidth + COLUMN_GAP;
                setMaxPage(Math.max(0, Math.ceil(totalWidth / viewWidth) - 1));
            }
        };
        const timer = setTimeout(calcMaxPage, 200); // 描画を待ってから計算
        window.addEventListener("resize", calcMaxPage);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", calcMaxPage);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // 🌟 単一ページめくり（見開き幅分だけ横にスライドさせる）
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

        // 対象の要素がコンテナの左端からどれだけ離れているか
        const offset =
            targetRect.left - containerRect.left + container.scrollLeft;
        const scrollAmount = container.clientWidth + COLUMN_GAP;
        const targetPage = Math.floor(offset / scrollAmount);

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
                    {/* 付箋（タブ） */}
                    <div className="book-tabs">
                        {RULEBOOK_DATA.map((chapter, i) => {
                            const tabColors = [
                                "#b45309",
                                "#15803d",
                                "#0f766e",
                                "#4338ca",
                                "#a21caf",
                            ];
                            const bgColor = tabColors[i % tabColors.length];
                            const [chapterNum, chapterName] =
                                chapter.title.split("：");
                            return (
                                <button
                                    key={chapter.id}
                                    className="book-tab"
                                    style={{ backgroundColor: bgColor }}
                                    onClick={() =>
                                        jumpToChapter(chapter.sections[0].id)
                                    }
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

                        {/* 🌟 自動でカラム分割（ページ化）されるテキストコンテナ */}
                        <div className="book-page-padding">
                            <div
                                className="book-columns-scroll"
                                ref={scrollContainerRef}
                            >
                                <div className="book-columns-content">
                                    {RULEBOOK_DATA.map((chapter, cIdx) => (
                                        <div
                                            key={chapter.id}
                                            className="chapter-wrapper"
                                        >
                                            {chapter.sections.map(
                                                (sec, sIdx) => {
                                                    // 最初以外のセクションは強制的に次のページから始める
                                                    const isFirst =
                                                        cIdx === 0 &&
                                                        sIdx === 0;
                                                    return (
                                                        <div
                                                            key={sec.id}
                                                            id={sec.id}
                                                            className={`section-wrapper ${isFirst ? "" : "break-before"}`}
                                                        >
                                                            {sIdx === 0 && (
                                                                <h3 className="chapter-title">
                                                                    {
                                                                        chapter.title
                                                                    }
                                                                </h3>
                                                            )}
                                                            <h4 className="section-title">
                                                                {sec.title}
                                                            </h4>
                                                            <div className="section-rich-text">
                                                                {renderRichText(
                                                                    sec.content,
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ))}
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
