const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    let backpack;
    try {
        backpack = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    } catch (e) {
        return msg.reply('❌ 資料庫讀取失敗。');
    }

    const user = backpack[uid];
    if (!user) return msg.reply('❌ 請先 !newplayer');

    // 1. 建立個人狀態 Embed
    const meEmbed = new EmbedBuilder()
        .setTitle(`👤 ${user.name} 的個人狀態`)
        .setColor('#0099ff')
        .addFields(
            { name: '📊 等級', value: `Lv.${user.level || 1} (Exp: ${user.exp || 0})`, inline: true },
            { name: '💰 金錢', value: `$${user.money || 0}`, inline: true },
            { name: '❤️ 生命值', value: `${user.hp} / ${user.maxHp || 100}`, inline: true },
            { name: '⚡ 能量', value: `${user.energy || 0} / ${user.maxEnergy || 1000}`, inline: true },
            { name: '🍖 飽食度', value: `${user.hunger || 0} / ${user.maxHunger || 20}`, inline: true },
            { name: '📍 當前位置', value: `${user.currentLocation || '未知'}`, inline: false }
        )
        .setTimestamp();

    // 2. 建立查看裝備按鈕
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('show_equip')
            .setLabel('查看目前裝備')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⚔️')
    );

    const response = await msg.reply({ embeds: [meEmbed], components: [row] });

    // 3. 設定按鈕監聽器 (僅限本人觸發)
    const filter = i => i.customId === 'show_equip' && i.user.id === msg.author.id;
    const collector = response.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
        // 從目前的 equipments 陣列中整理資料
        let equipList = '（目前沒有裝備）';
        if (user.equipments && user.equipments.length > 0) {
            equipList = user.equipments.map(e => 
                `🗡️ **${e.name}** [Lv.${e.lv}]\n└ ID: \`${e.uuid}\` | ⚔️ 攻擊: ${e.power}`
            ).join('\n\n');
        }

        const equipEmbed = new EmbedBuilder()
            .setTitle(`⚔️ ${msg.author.username} 的裝備欄`)
            .setColor('#e74c3c')
            .setDescription(equipList);

        await i.reply({ embeds: [equipEmbed], ephemeral: true });
    });

    collector.on('end', () => {
        row.components[0].setDisabled(true);
        response.edit({ components: [row] }).catch(() => null);
    });
};
