/**
 * 處理玩家經驗值增加與升級邏輯
 * @param {Object} user 玩家數據對象
 * @param {number} amount 獲得的經驗值量
 * @returns {Object} { leveledUp: boolean, newLevel: number }
 */
// 指數成長：回傳等級 level 所需的 EXP 門檻
function requiredExp(level) {
    // level 從 1 開始
    return Math.floor(100 * Math.pow(1.15, level - 1));
}

function addExp(user, amount, options = {}) {
    // 確保數值型態，避免從 JSON 讀出來為字串造成拼接或比較錯誤
    user.level = Number(user.level) || 1;
    user.exp = Number(user.exp) || 0;

    // 只在開發環境或明確傳入 options.debug 時輸出除錯日誌
    const debugEnabled = process.env.NODE_ENV === 'development' || process.env.LEVELSYS_DEBUG === '1' || options.debug === true;
    if (debugEnabled) console.log(`[addExp] before -> level=${user.level}, exp=${user.exp}, amount=${amount}`);

    user.exp += Number(amount);
    let leveledUp = false;

    // 使用指數成長公式來計算每級所需經驗
    let need = requiredExp(user.level);
    while (user.exp >= need) {
        user.exp -= need;
        user.level += 1;
        leveledUp = true;
        // 計算下一級所需經驗
        need = requiredExp(user.level);
    }

    if (debugEnabled) console.log(`[addExp] after  -> level=${user.level}, exp=${user.exp}, leveledUp=${leveledUp}`);

    return { leveledUp, newLevel: user.level };
}

module.exports = { addExp, requiredExp };