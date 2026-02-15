const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const filePath = './backpack.json';
    const marketPath = './market.json';

    // 讀取資料
    let backpack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let marketData = JSON.parse(fs.readFileSync(marketPath, 'utf8'));

    // 檢查商店資料格式
    if (!marketData.items || !Array.isArray(marketData.items)) {
        return msg.reply('❌ 商店資料格式錯誤，請檢查 market.json 是否包含 "items" 陣列。');
    }

    const itemID = args[0];
    const item = marketData.items.find(i => i.id === itemID || i.name === itemID);

    if (!item) return msg.reply(`❌ 商店找不到物品: ${itemID || '未輸入'}`);

    const user = backpack[uid];
    if (!user) return msg.reply('❌ 請先使用 !newplayer');
    if ((user.money || 0) < item.price) return msg.reply(`💰 錢不夠！需要 $${item.price}`);

    // 確認按鈕
    const embed = new EmbedBuilder()
        .setTitle('🛒 購買確認')
        .setDescription(`確定購買 **${item.name}** ($${item.price})？`)
        .setColor('#5865F2');

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('confirm').setLabel('確認').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('cancel').setLabel('取消').setStyle(ButtonStyle.Danger)
    );

    const response = await msg.reply({ embeds: [embed], components: [row] });

    const filter = i => i.user.id === msg.author.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter, time: 20000 });
        if (confirmation.customId === 'confirm') {
            backpack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            backpack[uid].money -= item.price;
            if (!backpack[uid].inventory) backpack[uid].inventory = {};
            backpack[uid].inventory[item.id] = (backpack[uid].inventory[item.id] || 0) + 1;

            fs.writeFileSync(filePath, JSON.stringify(backpack, null, 4));
            await confirmation.update({ content: `✅ 購買成功！`, embeds: [], components: [] });
        } else {
            await confirmation.update({ content: '❌ 已取消。', embeds: [], components: [] });
        }
    } catch (e) {
        await response.edit({ content: '⏰ 超時關閉。', components: [] });
    }
};
