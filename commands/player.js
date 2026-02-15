const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const fs = require('fs');
const itemsList = require('../items.js');

module.exports = async (msg) => {
    const uid = msg.author.id;
    const filePath = './backpack.json';
    let backpack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = backpack[uid];

    if (!user) return msg.reply('❌ 找不到你的資料！請先輸入 `!newplayer`。');

    // --- 基礎數據處理 ---
    const curHP = typeof user.hp === 'number' ? user.hp : 100;
    const maxHP = user.maxHp || 100;
    const curEnergy = typeof user.energy === 'number' ? user.energy : 1000;
    const maxEnergy = user.maxEnergy || 1000;

    // --- 分頁生成函式 (整合所有邏輯) ---
    const generatePages = () => {
        const equippedName = itemsList[user.equipped]?.name || '無';

        // P1: 狀態面板
        const p1 = new EmbedBuilder()
            .setTitle(`👤 ${msg.author.username} 的個人狀態`)
            .setColor('#F1C40F')
            .addFields(
                { name: '💰 金幣', value: `\`${user.money || 0}\``, inline: true },
                { name: '⭐ 等級', value: `\`Lv.${user.level || 1}\``, inline: true },
                { name: '❤️ 生命值', value: `\`${curHP} / ${maxHP}\``, inline: true },
                { name: '⚡ 體力值', value: `\`${curEnergy} / ${maxEnergy}\``, inline: true },
                { name: '⚔️ 當前裝備', value: `**${equippedName}**`, inline: false }
            );

        // P2: 武器庫
        let weaponStr = "";
        for (const [id, count] of Object.entries(user.inventory || {})) {
            if (count > 0 && (id.startsWith('sword_') || id.startsWith('axe_') || id.startsWith('bow_'))) {
                const item = itemsList[id];
                weaponStr += `• **${item?.name || id}** x${count}\n`;
            }
        }
        const p2 = new EmbedBuilder().setTitle('⚔️ 武器庫').setColor('#E74C3C').setDescription(weaponStr || "目前沒有武器");

        // P3: 物資與糧草 (含字數截斷保護)
        let wood = '', food = '', parts = '', adv = '';
        for (const [id, count] of Object.entries(user.inventory || {})) {
            if (count <= 0 || id.startsWith('sword_') || id.startsWith('axe_') || id.startsWith('bow_')) continue;
            const item = itemsList[id];
            const line = `• ${item?.name || id} x${count}\n`;

            if (id.startsWith('log_')) wood += line;
            else if (['farm', 'herd', 'food', 'heal'].includes(item?.type)) food += line;
            else if (item?.type === 'adv') adv += line;
            else parts += line;
        }

        const limit = (str) => str.length > 500 ? str.substring(0, 500) + "\n...(品項過多已截斷)" : (str || '無');

        const p3 = new EmbedBuilder().setTitle('🎒 物資與糧草').setColor('#3498DB')
            .addFields(
                { name: '🌲 資源/原木', value: limit(wood), inline: true },
                { name: '🍕 食物/補給', value: limit(food), inline: true },
                { name: '🛠️ 其他/零件', value: limit(parts), inline: false },
                { name: '⚔️ 冒險素材', value: limit(adv), inline: false }
            );

        // P4: 冒險地圖
        const worldMap = `\`\`\`
      🏰 城堡
      |
🌳--🌲--🌴--🏝️
 |    |    |
⛰️--🏜️--❄️--🧊
\`\`\`
**目前位置：** **${user.currentLocation || '森林'}**`;

        const p4 = new EmbedBuilder()
            .setTitle('<:1_:1411241634691153981> 冒險大陸')
            .setColor('#27AE60')
            .setDescription(worldMap);

        return { p1, p2, p3, p4 };
    };

    // --- 初始化組件 ---
    const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder().setCustomId('ls_menu').setPlaceholder('🔍 切換背包分頁')
            .addOptions([
                { label: '狀態屬性', value: 'p1', emoji: '👤' },
                { label: '武器裝備', value: 'p2', emoji: '⚔️' },
                { label: '物資糧草', value: 'p3', emoji: '🎒' },
                { label: '冒險地圖', value: 'p4', emoji: '🗺️' }
            ])
    );

    const locationMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder().setCustomId('move_menu').setPlaceholder('選擇傳送目的地...')
            .addOptions([
                { label: '🏰 城堡', value: 'castle' }, { label: '🌲 森林', value: 'forest' },
                { label: '⛰️ 山脈', value: 'mountain' }, { label: '🏜️ 沙漠', value: 'desert' },
                { label: '🧊 冰島', value: 'iceisland' }, { label: '🐉 龍穴', value: 'dragoncave' },
                { label: '👹 深淵', value: 'abyss' }
            ])
    );

    const moveBtn = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('confirm_move').setLabel('確認前往').setStyle(ButtonStyle.Success)
    );

    let pages = generatePages();
    let targetLocation = '';
    const curMsg = await msg.reply({ embeds: [pages.p1], components: [menu] });

    const collector = curMsg.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
        if (i.user.id !== msg.author.id) return i.reply({ content: '這不是你的背包！', ephemeral: true });

        if (i.customId === 'ls_menu') {
            const selected = i.values[0];
            // 只有在 P4 分頁顯示地點選單與按鈕
            const comps = (selected === 'p4') ? [menu, locationMenu, moveBtn] : [menu];
            await i.update({ embeds: [pages[selected]], components: comps });
        } 
        else if (i.customId === 'move_menu') {
            targetLocation = i.values[0];
            await i.deferUpdate();
        } 
        else if (i.customId === 'confirm_move') {
            if (!targetLocation) return i.reply({ content: '❌ 請先選擇一個地點！', ephemeral: true });

            const locationConfig = {
                castle: { name: '🏰 城堡', lv: 1 }, forest: { name: '🌲 森林', lv: 1 },
                mountain: { name: '⛰️ 山脈', lv: 20 }, desert: { name: '🏜️ 沙漠', lv: 40 },
                iceisland: { name: '🧊 冰島', lv: 60 }, dragoncave: { name: '🐉 龍穴', lv: 90 },
                abyss: { name: '👹 深淵', lv: 120 }
            };

            const dest = locationConfig[targetLocation];
            if (user.level < dest.lv) return i.reply({ content: `⚠️ 等級不足！需要 Lv.${dest.lv} 才能前往 ${dest.name}`, ephemeral: true });

            // 更新數據並存檔
            user.currentLocation = dest.name;
            fs.writeFileSync(filePath, JSON.stringify(backpack, null, 4));
            
            // 重新生成分頁數據以反應新位置
            pages = generatePages(); 
            await i.update({ 
                content: `✅ 已成功傳送到 **${dest.name}**！`, 
                embeds: [pages.p4], 
                components: [menu, locationMenu, moveBtn] 
            });
        }
    });
};
