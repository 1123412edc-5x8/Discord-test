const fs = require('fs');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const targetId = args[0]; // 玩家輸入的 UUID (從 !inv 看到)

    if (!targetId) return msg.reply('❌ 請輸入裝備的 UUID，例如：`!equip 1712345678`');

    let backpackData = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const user = backpackData[uid];

    if (!user || !user.backpack) return msg.reply('❌ 你的背包是空的。');

    // 1. 找到該裝備
    const itemIndex = user.backpack.findIndex(i => i.uuid === targetId);
    if (itemIndex === -1) return msg.reply('❌ 找不到該裝備，請檢查 UUID 是否正確。');

    const item = user.backpack[itemIndex];

    // 2. 檢查是否已經裝備了
    if (item.isEquipped) {
        // 如果已經裝備，則視為「卸下」
        item.isEquipped = false;
        fs.writeFileSync('./backpack.json', JSON.stringify(backpackData, null, 4));
        return msg.reply(`公 | 卸下了 **${item.name}**。`);
    }

    // 3. 處理「同部位替換」邏輯
    // 找出背包裡跟這件物品相同 subtype 且已經裝備的東西
    user.backpack.forEach(i => {
        if (i.subtype === item.subtype && i.isEquipped) {
            i.isEquipped = false; // 卸下舊的
        }
    });

    // 4. 穿上新的
    item.isEquipped = true;

    // 5. 存檔
    fs.writeFileSync('./backpack.json', JSON.stringify(backpackData, null, 4));

    msg.reply(`✅ 成功裝備 **${item.name}**！(部位：${item.subtype})`);
};