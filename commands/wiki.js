const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const itemsList = require('../items.js');

module.exports = async (msg) => {
    // --- 1. 資料分類邏輯 ---
    const generateWikiPages = () => {
        let foodList = "";
        let materialList = "";

        // 遍歷所有物品並根據關鍵字分類
        for (const [id, info] of Object.entries(itemsList)) {
            const entry = `\`${id}\` | ${info.name || id} | $${info.price || '??'}\n`;
            
            // 判斷是否為食物、種子或農產品
            if (id.includes('food') || id.includes('seed') || id.includes('apple') || id.includes('egg') || id.includes('soup')) {
                foodList += entry;
            } else {
                materialList += entry;
            }
            {if (id.includes('heal'))
                materialList += entry;
            }
        }
        const p1 = new EmbedBuilder()
            .setTitle('🥗 百科：農耕與料理清單')
            .setDescription(foodList.substring(0, 1900)) // 確保不超過 2000 字
            .setColor('#2ECC71');

        const p2 = new EmbedBuilder()
            .setTitle('💎 百科：冒險素材與寶藏')
            .setDescription(materialList.substring(0, 1900)) // 確保不超過 2000 字
            .setColor('#9B59B6');
        
        const p3 = new EmbedBuilder()
            .setTitle('⚔️ 百科：冒險素材與寶藏清單')
            .setDescription(materialList.substring(0, 1900)) // 確保不超過 2000 字
            .setColor('#3498DB');

        return { p1, p2, p3 };
    };

    const wikiPages = generateWikiPages();

    // --- 2. 建立分頁選單 ---
    const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('wiki_menu')
            .setPlaceholder('選擇查看的百科分類')
            .addOptions([
                { label: '農耕料理', value: 'p1', emoji: '🍎' },
                { label: '冒險素材', value: 'p2', emoji: '⚔️' },
                { label: '冒險寶藏', value: 'p3', emoji: '💎' }

            ])
    );

    const curMsg = await msg.reply({ embeds: [wikiPages.p1], components: [menu] });

    // --- 3. 監聽切換事件 ---
    const collector = curMsg.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
        if (i.user.id !== msg.author.id) return i.reply({ content: '這不是你的選單！', ephemeral: true });

        // 根據選單 ID 切換 Embed
        await i.update({ embeds: [wikiPages[i.values[0]]], components: [menu] });
    })}