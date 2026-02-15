const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => {
    const uid = interaction.user.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json'));
    const user = backpack[uid];

    if (!user) return interaction.reply({ content: '❌ 找不到你的帳號數據。', ephemeral: true });

    const embed = new EmbedBuilder()
        .setTitle('👩‍🌾 | 農場狀態查詢')
        .setColor('#FEE75C')
        .setTimestamp();

    // 判斷是否有正在種植的作物
    if (user.pendingCrops && user.pendingCrops > 0) {
        const now = Date.now();
        let timeStatus = '';

        if (now >= user.readyTime) {
            timeStatus = '✅ **已成熟，隨時可以收穫！**';
        } else {
            const timeLeft = Math.ceil((user.readyTime - now) / 1000 / 60);
            timeStatus = `⏳ 生長中（約剩餘 **${timeLeft}** 分鐘）`;
        }

        embed.addFields(
            { name: '🌱 當前規模', value: `${user.pendingCrops} 把鐵鋤的播種量`, inline: true },
            { name: '📅 生長進度', value: timeStatus, inline: true }
        );
    } else {
        embed.setDescription('目前田裡沒有種植任何東西，快去使用 `/farm plant` 吧！');
    }

    await interaction.reply({ embeds: [embed] });
};
