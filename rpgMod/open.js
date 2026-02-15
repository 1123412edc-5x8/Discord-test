const fs = require('fs');
const itemsList = require('../items.js');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const user = backpack[uid];

    if (!user.inventory['mystic_chest'] || user.inventory['mystic_chest'] <= 0) {
        return msg.reply('❌ 你手邊沒有 **神祕寶箱**！去 `!adv` 冒險找找看吧。');
    }

    // 1. 消耗寶箱
    user.inventory['mystic_chest'] -= 1;
    if (user.inventory['mystic_chest'] === 0) delete user.inventory['mystic_chest'];

    // 2. 定義隨機獎勵池 (這裡可以放你覺得酷的東西)
    const lootTable = [
        { id: 'void_shard', name: '🌌 虛空碎片', chance: 10 },
        { id: 'gold_ore', name: '🟡 金礦', chance: 30 },
        { id: 'silver_ore', name: '⚪ 鐵礦', chance: 40 },
        { id: 'iron_ingot', name: '⛓️ 鐵錠', chance: 50 },
        { id: 'potion_chaos', name: '🧪 混亂藥劑', chance: 10 }
    ];

    // 隨機抽獎邏輯
    const roll = Math.random() * 100;
    let reward = lootTable[lootTable.length - 1]; // 預設保底
    let currentChance = 0;
    for (const item of lootTable) {
        currentChance += item.chance;
        if (roll <= currentChance) {
            reward = item;
            break;
        }
    }

    // 3. 🎁 額外驚喜：番茄修正事件
    let bonusMsg = "";
    if (user.inventory['番茄'] > 1000000) {
        user.inventory['番茄'] = 99; // 強制修正回正常值
        bonusMsg = "\n✨ **神蹟顯現：** 寶箱散發出的光芒淨化了你的背包，那些腐爛的幾兆個番茄消失了！";
    }

    // 4. 發放獎勵
    user.inventory[reward.id] = (user.inventory[reward.id] || 0) + 1;
    user.money = (user.money || 0) + 200; // 開箱獎金

    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));

    return msg.reply({
        content: `🎊 你打開了寶箱，獲得了 **${reward.name} x1** 與 **$200**！${bonusMsg}`
    });
};