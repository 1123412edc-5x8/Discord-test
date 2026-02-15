const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const backpackData = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const user = backpackData[uid];

    if (!user) return msg.reply('❌ 請先使用 `!newplayer` 註冊。');

    // 取得目前穿著的裝備 (如果沒有就顯示未裝備)
    const eq = user.equips || {};
    const currentEquips = [
        `⚔️ **武器**: ${eq.sword?.name || '赤手空拳'}`,
        `🛡️ **頭盔**: ${eq.head?.name || '無'}`,
        `👕 **上衣**: ${eq.armor?.name || '無'}`,
        `👖 **下裝**: ${eq.pants?.name || '無'}`,
        `👟 **鞋子**: ${eq.boots?.name || '無'}`
    ].join('\n');

    const embed = new EmbedBuilder()
        .setTitle('🛡️ | 裝備管理清單')
        .setDescription('這裡只顯示您的武裝實體，不含素材。')
        .setColor('#2b2d31')
        .addFields(
            { name: '👤 當前穿戴', value: currentEquips },
            { name: '🎒 背包容量', value: `🛠️ 裝備數: ${user.backpack?.length || 0} / 50` }
        )
        .setFooter({ text: '選擇下方類別來查看背包內的備用裝備' });

    const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('inv_category_select')
            .setPlaceholder('--- 選擇要查看的背包類別 ---')
            .addOptions([
                { label: '武器類 (劍/弓/斧/杖)', value: 'view_weapon', emoji: '⚔️' },
                { label: '防具類 (頭/甲/褲/鞋)', value: 'view_armor', emoji: '🛡️' }
            ])
    );

    await msg.reply({ embeds: [embed], components: [menu] });
};