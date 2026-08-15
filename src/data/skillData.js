// 各ステータスの色定義（背景用のパステルカラーと、文字用の濃い色）
export const SKILL_STATS = {
    R: { label: "剛性", short: "Rig", bg: "#fee2e2", text: "#ef4444" },
    G: { label: "滑空", short: "Gli", bg: "#dcfce7", text: "#22c55e" },
    B: { label: "均衡", short: "Bal", bg: "#dbeafe", text: "#3b82f6" },
    C: { label: "明晰", short: "Cla", bg: "#cffafe", text: "#0891b2" },
    M: { label: "動機", short: "Mot", bg: "#fce7f3", text: "#db2777" },
    Y: { label: "憧憬", short: "Yea", bg: "#fef3c7", text: "#d97706" },
};

// 技能リスト（全18種：RGB×CMY各2パターン）
export const SKILL_LIST = [
    // --- 🟥 剛性 (Rig) ベース ---
    { name: "〈解体〉", phys: "R", ment: "C" }, // 戦闘・破壊：構造の論理的破壊
    { name: "〈説得〉", phys: "R", ment: "C" }, // 交渉・影響：強引な理屈や勢いで相手を言いくるめる
    { name: "〈突破〉", phys: "R", ment: "M" }, // 戦闘・移動：衝動による障害排除・突撃
    { name: "〈耐久〉", phys: "R", ment: "M" }, // 戦闘・生存：過酷な環境やダメージを物理的に耐え抜く
    { name: "〈威圧〉", phys: "R", ment: "Y" }, // 交渉・阻害：圧倒的な力によるプレッシャー
    { name: "〈創造〉", phys: "R", ment: "Y" }, // 探索・作業：発想を形にする創作・構築

    // --- 🟩 滑空 (Gli) ベース ---
    { name: "〈機動〉", phys: "G", ment: "C" }, // 戦闘・移動：瞬時の判断で攻撃や障害を回避する
    { name: "〈隠密〉", phys: "G", ment: "C" }, // 探索・潜入：気配を消して忍び寄る
    { name: "〈察知〉", phys: "G", ment: "M" }, // 探索・感知：周囲の状況や危険を直感的に察知する
    { name: "〈強襲〉", phys: "G", ment: "M" }, // 戦闘・移動：本能と衝動のままに素早く距離を詰め奇襲する
    { name: "〈軽業〉", phys: "G", ment: "Y" }, // 探索・移動：美しく無駄のないパルクール
    { name: "〈魅了〉", phys: "G", ment: "Y" }, // 交渉・表現：美しい軌道で相手の心を惹きつける

    // --- 🟦 均衡 (Bal) ベース ---
    { name: "〈精密〉", phys: "B", ment: "C" }, // 戦闘・行動：感情を排した狙撃・命中
    { name: "〈解析〉", phys: "B", ment: "C" }, // 探索・情報：ハッキングやギミックの論理解除
    { name: "〈適応〉", phys: "B", ment: "M" }, // 探索・生存：悪路や異常状態に対し、体勢やシステムを瞬時に立て直す
    { name: "〈共感〉", phys: "B", ment: "M" }, // 交渉・同調：相手の気持ちや考えに直感で寄り添う
    { name: "〈細工〉", phys: "B", ment: "Y" }, // 探索・創造：アイテムの制作や美しい調整
    { name: "〈欺瞞〉", phys: "B", ment: "Y" }, // 交渉・虚偽：表情や挙動を完璧に制御し、相手を欺く（フェイント・嘘）
];
