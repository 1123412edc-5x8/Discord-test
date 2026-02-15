const fs = require('fs');
const itemsList = require('../items.js');

module.exports = async (interaction) => {
    const uid = interaction.user.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json'));
    const user = backpack[uid];

    if (!user || !user.pendingCrops || user.pendingCrops <= 0) {
        return interaction.reply({ content: '❌ 田裡空空如也！', ephemeral: true });
    }

    const now = Date.now();
    if (user.readyTime && now < user.readyTime) {
        const timeLeft = Math.ceil((user.readyTime - now) / 1000 / 60);
        return interaction.reply({ content: `⏳ 作物還沒成熟！還需等待 **${timeLeft}** 分鐘。`, ephemeral: true });
    }

    // --- 核心修正：1 把鋤頭 = 1 個隨機東西 ---
    const farmItems = Object.keys(itemsList).filter(id => itemsList[id].type === 'farm');
    let harvestResults = {}; // 用來統計拿到多少種類
    const totalSeeds = user.pendingCrops;

    for (let i = 0; i < totalSeeds; i++) {
        const randomCropId = farmItems[Math.floor(Math.random() * farmItems.length)];
        
        // 增加到統計中
        harvestResults[randomCropId] = (harvestResults[randomCropId] || 0) + 1;
        
        // 增加到背包
        user.inventory[randomCropId] = (Number(user.inventory[randomCropId]) || 0) + 1;
    }

    // 清除狀態
    user.pendingCrops = 0;
    user.readyTime = null;

    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));

    // 製作漂亮的收成清單
    let resultText = '';
    for (const [id, count] of Object.entries(harvestResults)) {
        resultText += `• ${itemsList[id].name}: **${count}** 個\n`;
    }

    await interaction.reply({ 
        content: `🚜 **收穫季完成！**\n你使用了 ${totalSeeds} 把鋤頭，收成了以下作物：\n${resultText}` 
    });
};
