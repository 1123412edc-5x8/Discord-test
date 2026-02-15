const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const user = backpack[uid];

    if (!user) return msg.reply('❌ 請先使用 `!newplayer` 註冊。');

    // 確保玩家資料中有 location 欄位，沒有的話預設為遺忘荒野
    const currentLoc = user.location || "遺忘荒野";

    const embed = new EmbedBuilder()
        .setTitle('🗺️ | 世界地圖移動')
        .setDescription(`您目前位於：**${currentLoc}**\n點擊下方按鈕即可前往目的地。`)
        .setColor('#5865F2')
        .addFields(
            { name: '📍 可前往地區', value: '🏕️ 遺忘荒野\n🦇 陰風洞窟\n👺 哥布林營地\n🏰 廢棄古城', inline: true }
        )
        .setFooter({ text: '移動不需要消耗體力，但請注意各區怪物強度不同。' });

    // 建立地圖按鈕
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('move_遺忘荒野')
            .setLabel('遺忘荒野')
            .setEmoji('🏕️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentLoc === '遺忘荒野'),
        new ButtonBuilder()
            .setCustomId('move_陰風洞窟')
            .setLabel('陰風洞窟')
            .setEmoji('🦇')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentLoc === '陰風洞窟'),
        new ButtonBuilder()
            .setCustomId('move_哥布林營地')
            .setLabel('哥布林營地')
            .setEmoji('👺')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentLoc === '哥布林營地'),
        new ButtonBuilder()
            .setCustomId('move_廢棄古城')
            .setLabel('廢棄古城')
            .setEmoji('🏰')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentLoc === '廢棄古城')
    );

    await msg.reply({ embeds: [embed], components: [row] });
};