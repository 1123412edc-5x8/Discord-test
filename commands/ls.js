const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const itemsInfo = require('../items.js');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const user = backpack[uid];
    if (!user) return msg.reply('❌ 請先 !newplayer');

    // 建立一個統一的背包物件來合併資料
    const mergedBag = {};

    // 合併函數：處理數字與舊版物件格式
    const addToBag = (sourceObj) => {
        for (let [id, val] of Object.entries(sourceObj || {})) {
            // 如果 items.js 裡有這個 ID，就統一用它的名稱翻譯
            const info = itemsInfo[id];
            const finalName = info ? info.name : id;
            
            // 處理數量：相容數字格式與物件格式
            const count = (typeof val === 'object') ? (val.amount || 0) : val;
            
            mergedBag[finalName] = (mergedBag[finalName] || 0) + count;
        }
    };

    // 把兩個地方的東西都丟進去合併
    addToBag(user.inventory);
    addToBag(user.items);

    // 格式化輸出
    let displayList = Object.entries(mergedBag)
        .filter(([_, amt]) => amt > 0)
        .map(([name, amt]) => `• ${name}: **${amt}**`)
        .join('\n') || '（背包空空如也）';

    const embed = new EmbedBuilder()
        .setTitle(`🎒 ${user.name} 的背包`)
        .setColor('#2ecc71')
        .setDescription(`### 💎 物品清單\n${displayList}`)
        .addFields({ name: '💰 目前金錢', value: `$${user.money || 0}` });

    msg.reply({ embeds: [embed] });
};
