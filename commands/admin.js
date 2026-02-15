const fs = require('fs');

module.exports = async (msg, args) => {
    // 只有你自己可以執行 (請把 你的ID 換成真正的 Discord ID)
    // if (msg.author.id !== '你的ID') return msg.reply('❌ 權限不足');

    const itemName = args[0]; // 物品名稱
    const count = parseInt(args[1]) || 1; // 數量

    if (!itemName) return msg.reply('❓ 用法：!admin [物品] [數量]');

    let backpack = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const uid = msg.author.id;

    if (!backpack[uid]) return msg.reply('❌ 你還沒註冊！');

    // 強制寫入 inventory
    if (!backpack[uid].inventory) backpack[uid].inventory = {};
    backpack[uid].inventory[itemName] = (backpack[uid].inventory[itemName] || 0) + count;

    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));
    
    return msg.reply(`🛠️ 管理員模式：已發放 **${itemName} x ${count}** 到你的背包。`);
};