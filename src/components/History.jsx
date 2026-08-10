import "./History.css";

export default function History({ cur, updateCur }) {
    return (
        <div className="top-right-history">
            <textarea
                className="history"
                placeholder="キャラクターの経歴や設定を記入"
                value={cur.history}
                onChange={(e) => updateCur("history", e.target.value)}
            />
        </div>
    );
}
