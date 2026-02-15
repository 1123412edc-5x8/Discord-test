const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');

module.exports = async (msg) => {
    const marketData = JSON.parse(fs.readFileSync('./market.json', 'utf8'));
    
    const embed = new EmbedBuilder()
        .setTitle('🧪 官方藥水市場')
        .setDescription('請從下方下拉選單選擇想要購買的商品：')
        .setColor('#5865F2');

    // 動態生成選單選項
    const options = marketData.items.map(item => ({
        label: item.name,
        description: `價格: $${item.price}`,
        value: item.id,
        emoji: item.id === 'luck' ? '🍀' : '🎫'
    }));

    const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('market_buy_select')
            .setPlaceholder('選擇商品購買...')
            .addOptions(options)
    );

    await msg.reply({ embeds: [embed], components: [row] });
};
