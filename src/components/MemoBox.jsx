import "./MemoBox.css";

export default function MemoBox({ cur, updateCur }) {
    return (
        <div className="box memo-box">
            <h3>メモ</h3>
            <textarea
                placeholder="メモを入力..."
                value={cur.memo}
                onChange={(e) => updateCur("memo", e.target.value)}
            />
        </div>
    );
}
