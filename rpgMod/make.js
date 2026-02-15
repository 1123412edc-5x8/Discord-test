const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const items = require('../items2.js'); // 這裡確保對應你的檔名

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const code = args[0]?.toUpperCase(); 

    // 1. 基本檢查
    if (!code) return msg.reply('❌ 請輸入要製作的物品代號，例如：`!make W01`');
    
    const targetItem = items[code];
    if (!targetItem || !targetItem.req) {
        return msg.reply('❌ 找不到該物品的合成配方。');
    }

    // 2. 讀取玩家資料
    let backpackData = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const user = backpackData[uid];
    if (!user) return msg.reply('❌ 請先註冊帳號。');
    if (!user.inventory) user.inventory = {}; // 確保素材庫存在

    // 3. 檢查素材是否充足
    const requirements = Object.entries(targetItem.req); // 把 { "iron": 3 } 轉成 [ ["iron", 3] ]
    let missing = [];

    for (const [resKey, amount] of requirements) {
        const userHas = user.inventory[resKey] || 0;
        if (userHas < amount) {
            // 查一下中文名給玩家看
            const cname = items.materials[resKey]?.name || resKey;
            missing.push(`${cname} (缺 ${amount - userHas} 個)`);
        }
    }

    if (missing.length > 0) {
        return msg.reply(`❌ **素材不足！**\n> ${missing.join('\n> ')}`);
    }

    // 4. 扣除素材
    for (const [resKey, amount] of requirements) {
        user.inventory[resKey] -= amount;
    }

    // 5. 製作物品並放入背包 (複製 items2.js 裡的屬性)
    if (!user.backpack) user.backpack = [];
    
    const newItem = {
        uuid: Date.now().toString() + Math.floor(Math.random() * 1000), // 唯一的 ID
        itemCode: code, // 紀錄代號方便後續處理
        name: targetItem.name,
        type: targetItem.type,
        subtype: targetItem.subtype,
        atk: targetItem.atk || 0,
        def: targetItem.def || 0
    };

    user.backpack.push(newItem);

    // 6. 存檔並回饋
    fs.writeFileSync('./backpack.json', JSON.stringify(backpackData, null, 4));

    const embed = new EmbedBuilder()
        .setTitle('🔨 製作成功！')
        .setDescription(`你成功製作了 **${targetItem.name}**！`)
        .addFields(
            { name: '📊 屬性', value: `⚔️ ATK: ${newItem.atk} / 🛡️ DEF: ${newItem.def}`, inline: true },
            { name: '📦 分類', value: `${newItem.type} (${newItem.subtype})`, inline: true }
        )
        .setColor('#7cfc00');

    await msg.reply({ embeds: [embed] });
};