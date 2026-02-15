const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const itemsList = require('../items.js');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json'));
    
    if (!backpack[uid]) {
        backpack[uid] = { inventory: {}, hunger: 0, job: '無' };
    }
    const user = backpack[uid];

    // 1. 如果沒帶參數，顯示 Embed 清單
    if (!args || args.length === 0) {
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🍴 | 可以吃的東西')
            .setDescription(`體力值：**${user.hunger || 0} / 20** 點`)
            .setTimestamp();

        const categories = [
            { type: 'farm', label: '👩‍🌾 **農作物**' },
            { type: 'herd', label: '🥩 **肉類**' },
            { type: 'food', label: '🍳 **廚師料理**' }
        ];

        categories.forEach(cat => {
            let catContent = '';
            for (const [id, info] of Object.entries(itemsList)) {
                if (info.type === cat.type) {
                    const count = user.inventory[id] || 0;
                    // 還原圖片中的格式：名稱 數量 個 (回復 X 🍗)
                    catContent += `${info.name} **${count}** 個 (回復 ${info.heal || 0} 🍗)\n`;
                }
            }
            if (catContent) {
                embed.addFields({ name: cat.label, value: catContent, inline: false });
            }
        });

        return msg.reply({ embeds: [embed] });
    }

    // 2. 執行吃東西邏輯 (維持原樣)
    const targetName = args[0];
    const amount = parseInt(args[1]) || 1;
    const itemEntry = Object.entries(itemsList).find(([id, info]) => info.name.includes(targetName));
    
    if (!itemEntry) return msg.reply(`📖 請輸入正確名稱，例如：\`!eat 馬鈴薯 1\``);

    const [itemId, itemInfo] = itemEntry;
    if (!user.inventory[itemId] || user.inventory[itemId] < amount) {
        return msg.reply(`❌ 你身上的 ${itemInfo.name} 不夠！`);
    }

    const healValue = (itemInfo.heal || 0) * amount;
    user.hunger = Math.min(20, (user.hunger || 0) + healValue);
    user.inventory[itemId] -= amount;
    if (user.inventory[itemId] <= 0) delete user.inventory[itemId];

    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));
    
    return msg.reply(`🍴 你吃了 ${amount} 個 ${itemInfo.name}，回復了 ${healValue} 點體力！(目前: ${user.hunger}/20)`);
};
