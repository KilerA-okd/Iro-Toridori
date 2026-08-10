import "./ItemsBox.css";

export default function ItemsBox({ cur, updateCur }) {
    const items = Array.isArray(cur.items) ? cur.items : [];

    const addRow = () => {
        const next = [...items, { name: "", lx: "", qty: 1 }];
        updateCur("items", next);
    };

    const removeRow = (index) => {
        const next = items.filter((_, i) => i !== index);
        updateCur("items", next);
    };

    const updateField = (index, field, value) => {
        const next = items.map((row, i) =>
            i === index ? { ...row, [field]: value } : row,
        );
        updateCur("items", next);
    };

    const changeQty = (index, delta) => {
        const curQty = parseInt(items[index]?.qty) || 0;
        const nextQty = Math.max(0, curQty + delta);
        updateField(index, "qty", nextQty);
    };

    return (
        <div className="box items-box">
            <div className="items-header">
                <h3>持ち物</h3>
                <button type="button" className="btn-add" onClick={addRow}>
                    ＋ 追加
                </button>
            </div>

            <div className="items-table-wrap">
                <table className="items-table">
                    <colgroup>
                        <col className="col-name" />
                        <col className="col-lx" />
                        <col className="col-qty" />
                        <col className="col-act" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>lx</th>
                            <th>数量</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((row, idx) => (
                            <tr key={idx}>
                                <td>
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) =>
                                            updateField(
                                                idx,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={String(row.lx ?? "")}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(
                                                /[^0-9]/g,
                                                "",
                                            );
                                            updateField(idx, "lx", v);
                                        }}
                                    />
                                </td>
                                <td className="qty-cell">
                                    <div className="step-control-side">
                                        <button
                                            type="button"
                                            className="btn-step-side"
                                            onClick={() => changeQty(idx, -1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={row.qty}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="btn-step-side"
                                            onClick={() => changeQty(idx, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        title="削除"
                                        aria-label="削除"
                                        onClick={() => removeRow(idx)}
                                    >
                                        ✖
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={4} className="empty-row">
                                    持ち物がありません。行を追加してください。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
