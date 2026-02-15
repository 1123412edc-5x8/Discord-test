const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const items = require('../items2.js'); // 確保路徑正確

module.exports = async (interaction) => {
    // 1. 🔍 防呆檢查：只處理「下拉選單」且 ID 是「craft_category_select」的互動
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'craft_category_select') {
        return; 
    }

    const category = interaction.values[0];
    let title = "";
    let listContent = "";

    // 2. 定義各分類對應的 subtype
    const filterMap = {
        'craft_melee': { title: "⚔️ | 物理武器配方", types: ['sword', 'bow', 'axe'] },
        'craft_magic': { title: "🔮 | 魔法媒介配方", types: ['fire', 'water', 'earth', 'dark'] },
        'craft_armor': { title: "🛡️ | 防具套件配方", types: ['head', 'body', 'pants', 'boots'] },
        'craft_accessory': { title: "📿 | 飾品配件配方", types: ['earring', 'ring', 'pendant'] }
    };

    const config = filterMap[category];

    // 🛡️ 安全檢查：防止找不到 config 導致崩潰
    if (!config) {
        return await interaction.reply({ content: '❌ 找不到該分類設定。', ephemeral: true });
    }

    title = config.title;

    // 3. 遍歷 items2.js 找出符合的物品
    const craftableItems = Object.entries(items).filter(([id, data]) => {
        // 必須有 req (合成需求) 且 subtype 在定義的 types 裡面
        return data.req && config.types.includes(data.subtype);
    });

    if (craftableItems.length === 0) {
        listContent = "⚠️ 該分類目前尚無可合成的項目。";
    } else {
        listContent = craftableItems.map(([id, data]) => {
            // 解析素材需求
            const reqText = Object.entries(data.req).map(([reqId, amt]) => {
                const materialName = items.materials[reqId]?.name || reqId;
                return `\`${materialName}\` x${amt}`;
            }).join(', ');

            // 顯示攻擊力或防禦力
            let attrText = data.atk ? `⚔️ATK+${data.atk}` : `🛡️DEF+${data.def}`;
            return `**[${id}] ${data.name}** (${attrText})\n└ 素材：${reqText}`;
        }).join('\n');
    }

    // 4. 組裝 Embed 並回傳
    const newEmbed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(`### 🛠️ 工坊配方清單\n${listContent}`)
        .setColor('#7cfc00')
        .setFooter({ text: '輸入 !make 代號 進行製作（如：!make W01）' });

    return await interaction.update({ embeds: [newEmbed] });
};