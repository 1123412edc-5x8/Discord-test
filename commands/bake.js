const fs = require('fs');
const itemsList = require('../items.js');

module.exports = async (interaction) => {
    const uid = interaction.user.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json'));
    const user = backpack[uid];

    if (!user || user.job !== '廚師') {
        return interaction.reply({ content: '👨‍🍳 只有 **廚師** 具備專業烹飪技術（且製作不消耗體力）！', ephemeral: true });
    }

    const recipes = {
        '番茄濃湯': { req: { 'tomato': 2, 'coal': 1 }, gain: 'tomato_soup' },
        '滷肉飯': { req: { 'raw_pork': 1, 'wheat': 2, 'coal': 1 }, gain: 'pork_rice' },
        '紅酒燉牛肉': { req: { 'raw_beef': 1, 'cabbage': 1, 'coal': 2 }, gain: 'beef_stew' },
        '炸魚薯條': { req: { 'fish_tilapia': 1, 'potato': 1, 'coal': 1 }, gain: 'fish_and_chips' },
        '豪華早午餐': { req: { 'raw_mutton': 1, 'egg': 2, 'tomato': 1, 'coal': 2 }, gain: 'full_breakfast' }
    };

    const target = interaction.options.getString('item'); 
    if (!target || !recipes[target]) {
        let menu = '👨‍🍳 **廚師專業菜單 (燃料消耗：煤炭)**\n----------------------------------\n';
        for (const [name, data] of Object.entries(recipes)) {
            const item = itemsList[data.gain];
            menu += `🍴 **${name}** (回復: +${item.heal})\n└ 材料: ${Object.entries(data.req).map(([id, amt]) => `${itemsList[id]?.name || id} x${amt}`).join(', ')}\n\n`;
        }
        return interaction.reply({ content: menu, ephemeral: true });
    }

    const recipe = recipes[target];
    for (const [id, amt] of Object.entries(recipe.req)) {
        if ((user.inventory[id] || 0) < amt) {
            return interaction.reply({ content: `❌ 缺少材料：${itemsList[id]?.name || id}。`, ephemeral: true });
        }
    }

    for (const [id, amt] of Object.entries(recipe.req)) {
        user.inventory[id] -= amt;
        if (user.inventory[id] <= 0) delete user.inventory[id];
    }
    user.inventory[recipe.gain] = (user.inventory[recipe.gain] || 0) + 1;

    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));

    await interaction.reply({ 
        content: `👨‍🍳 **烹飪成功！**\n作為專業廚師，你製作了 **${itemsList[recipe.gain].name}**！\n🍖 飽食度目前為: ${user.hunger}/20` 
    });
};
