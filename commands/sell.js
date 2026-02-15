const fs = require('fs');
const itemsList = require('../items.js');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const backpackPath = './backpack.json';

    // 1. 讀取與基礎檢查
    let backpack = JSON.parse(fs.readFileSync(backpackPath, 'utf8'));
    const user = backpack[uid];

    if (!user) return msg.reply('❌ 找不到你的資料！');

    const itemName = args[0];
    const amountArg = args[1]; // 可能是數字或 "all"

    if (!itemName) return msg.reply('❓ 用法：`!sell [物品] [數量/all]`');

    // 2. 尋找物品 ID
    const inv = user.inventory || {};
    let targetID = null;

    if (inv[itemName] !== undefined) {
        targetID = itemName;
    } else {
        targetID = Object.keys(inv).find(id => itemsList[id]?.name === itemName);
    }

    if (!targetID || inv[targetID] <= 0) {
        return msg.reply(`❌ 你的背包裡沒有 **${itemName}**！`);
    }

    // 3. 核心邏輯：判斷是否全賣
    let sellCount;
    if (amountArg === 'all') {
        sellCount = inv[targetID]; // 直接抓取背包內所有數量
    } else {
        sellCount = parseInt(amountArg);
        if (isNaN(sellCount) || sellCount <= 0) return msg.reply('❌ 請輸入正確的數量或 `all`。');
        if (sellCount > inv[targetID]) return msg.reply(`❌ 數量不足，你只有 ${inv[targetID]} 個。`);
    }

    // 4. 計算價格
    const itemData = itemsList[targetID];
    const unitPrice = itemData?.sellPrice || (itemData?.price ? Math.floor(itemData.price * 0.5) : 10);
    const totalMoney = unitPrice * sellCount;

    // 5. 更新資料
    user.inventory[targetID] -= sellCount;
    user.money = (user.money || 0) + totalMoney;

    // 清理 0 數量的物品，讓 JSON 保持乾淨
    if (user.inventory[targetID] <= 0) delete user.inventory[targetID];

    // 6. 存檔
    fs.writeFileSync(backpackPath, JSON.stringify(backpack, null, 4));

    return msg.reply(`💰 **全額收購成功！**\n賣出了 **${itemData?.name || targetID} x ${sellCount}**\n總共獲得了 **$${totalMoney.toLocaleString()}**。`);
};