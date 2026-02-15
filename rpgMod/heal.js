const fs = require('fs');
const itemsList = require('../items.js'); // 跳出資料夾讀取根目錄的 items.js

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json'));

    // 初始化玩家資料，確保有血量數值
    if (!backpack[uid]) {
        return msg.reply('❌ 找不到你的冒險者資料！');
    }
    const user = backpack[uid];
    if (user.hp === undefined) user.hp = 100; // 預設血量
    if (user.maxHp === undefined) user.maxHp = 100; // 預設上限

    if (!args[0]) return msg.reply('❌ 請輸入要使用的醫療品名稱或編號，例如：`!heal 簡易繃帶` 或 `!heal 2 3` (2 = 編號, 3 = 數量)');

    // 取得所有可用的 heal 物品（維持檔案順序）
    const healItems = Object.entries(itemsList).filter(([id, info]) => info.type === 'heal');

    let itemId, itemInfo;
    let qty = 1;

    // 支援清單列出：`!heal list` 或 `!heal 清單` / `!heal 列表`
    if (args[0] && (args[0].toLowerCase() === 'list' || args[0] === '清單' || args[0] === '列表')) {
        const listStr = healItems.map(([id, info], i) => {
            const have = user.inventory && user.inventory[id] ? user.inventory[id] : 0;
            return `${i + 1}. ${info.name} - 回復 ${Math.round((info.hpPercent || 0) * 100)}% - 你有：${have}`;
        }).join('\n');
        return msg.reply(`🩺 可用醫療物資：\n${listStr}\n\n使用方式：\`!heal [編號] [數量]\` 或 \`!heal [名稱] [數量]\``);
    }

    // 支援編號縮寫：第一參數為整數代表清單編號
    if (/^\d+$/.test(args[0])) {
        const idx = parseInt(args[0], 10) - 1; // 使用者輸入 1 表示陣列第 0 項
        if (idx < 0 || idx >= healItems.length) {
            const list = healItems.map(([id, info], i) => `${i + 1}. ${info.name}`).join('\n');
            return msg.reply(`❌ 無效編號，請輸入 1 到 ${healItems.length} 之間。可用醫療物資：\n${list}`);
        }
        [itemId, itemInfo] = healItems[idx];
        if (args[1] && /^\d+$/.test(args[1])) qty = Math.max(1, parseInt(args[1], 10));
    } else {
        // 原本的名稱搜尋，並支援後面接數量
        const inputName = args[0];
        const itemEntry = Object.entries(itemsList).find(([id, info]) => info.name.includes(inputName) && info.type === 'heal');
        if (!itemEntry) {
            return msg.reply('❌ 這件物品不是有效的醫療物資！');
        }
        [itemId, itemInfo] = itemEntry;
        if (args[1] && /^\d+$/.test(args[1])) qty = Math.max(1, parseInt(args[1], 10));
    }

    // 數量檢查
    if (!user.inventory[itemId] || user.inventory[itemId] <= 0) {
        return msg.reply(`❌ 你身上沒有 ${itemInfo.name}！`);
    }
    if (user.inventory[itemId] < qty) {
        return msg.reply(`❌ 你只有 ${user.inventory[itemId]} 個 ${itemInfo.name}，無法使用 ${qty} 個。`);
    }

    // 檢查血量是否已滿
    if (user.hp >= user.maxHp) {
        return msg.reply('✨ 你的血量是滿的，不需要治療！');
    }

    // 執行百分比回血邏輯，支援一次使用多個
    const healPercent = itemInfo.hpPercent || 0; // 讀取 items.js 裡的百分比
    const healSingle = Math.floor(user.maxHp * healPercent);
    const totalHeal = healSingle * qty;
    const newHp = Math.min(user.maxHp, user.hp + totalHeal);
    const actualHealed = newHp - user.hp;

    user.hp = newHp;

    // 扣除物品
    user.inventory[itemId] -= qty;
    if (user.inventory[itemId] <= 0) delete user.inventory[itemId];

    // 儲存變更
    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));

    return msg.reply(`🩹 你使用了 **${itemInfo.name}** x${qty}，回復了 **${actualHealed}** 點血量（每個 ${Math.round(healPercent * 100)}%）。\n❤️ 目前狀態：\`${user.hp} / ${user.maxHp}\``);
};