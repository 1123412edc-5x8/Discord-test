const fs = require('fs');
const itemsList = require('../items.js');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json'));
    const user = backpack[uid];

    if (!user) return msg.reply('❌ 請先開始遊戲！');
    const itemName = args[0];
    if (!itemName) return msg.reply('❓ 請輸入要製作的物品名稱。');

    // 擴充配方清單：對應 wiki 中的 ID（武器新增需使用冒險素材 adv 類）
    const recipes = {
        '木棒': { id: 'stick', name: '🥢 木棒 (x4)', cost: { 'log_oak': 1 }, lv: 1, amount: 4 },
        // 基礎武器：加入冒險素材作為組成之一
        '木劍': { id: 'sword_1', name: '🗡️ 木劍', cost: { 'log_oak': 3, 'rabbit_fur': 1 }, lv: 1 },
        '木斧': { id: 'axe_1', name: '🪓 木斧', cost: { 'log_oak': 3, 'boar_tusk': 1 }, lv: 1 },
        '短弓': { id: 'bow_1', name: '🏹 短弓', cost: { 'log_oak': 2, 'rabbit_fur': 2 }, lv: 1 },
        // 中高階武器：需要稀有冒險素材
        '橡木長劍': { id: 'sword_2', name: '⚔️ 橡木長劍', cost: { 'log_oak': 8, 'deer_antler': 1 }, lv: 5 },
        '橡木戰斧': { id: 'axe_2', name: '🪓 橡木戰斧', cost: { 'log_oak': 10, 'boar_tusk': 2 }, lv: 8 },
        '樺木長弓': { id: 'bow_2', name: '🏹 樺木長弓', cost: { 'log_birch': 6, 'rabbit_fur': 3, 'deer_antler': 1 }, lv: 8 },
        '雲杉巨斧': { id: 'axe_3', name: '🪓 雲杉巨斧', cost: { 'log_spruce': 12, 'deer_antler': 2 }, lv: 12 }
    };

    const target = recipes[itemName];
    if (!target) return msg.reply('❌ 找不到此配方！請參考 `!craft`。');

    // 檢查等級
    if ((user.level || 1) < target.lv) return msg.reply(`⚠️ 等級不足！需要 **Lv.${target.lv}** 才能製作 ${target.name}`);

    // 檢查材料
    for (const [matId, amount] of Object.entries(target.cost)) {
        const currentAmount = user.inventory[matId] || 0;
        if (currentAmount < amount) {
            const displayName = itemsList[matId]?.name || matId;
            return msg.reply(`❌ 材料不足！需要 **${displayName}** x${amount} (目前：${currentAmount})`);
        }
    }

    // 扣除材料並給予物品
    for (const [matId, amount] of Object.entries(target.cost)) user.inventory[matId] -= amount;
    user.inventory[target.id] = (user.inventory[target.id] || 0) + (target.amount || 1);
    
    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));
    return msg.reply(`🔨 製作成功！你打造了 **${target.name}**！`);
};
