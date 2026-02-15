const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = async (msg) => {
    const uid = msg.author.id;
    const filePath = './backpack.json';
    let backpack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = backpack[uid];

    if (!user) return msg.reply('❌ 你還沒註冊！請先輸入 `!newplayer`。');

    // --- 📅 簽到時間檢查 ---
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 格式：2026-02-03

    if (user.lastSign === today) {
        return msg.reply('❌ 你今天已經簽到過了，明天再來吧！');
    }

    // --- 🎁 簽到獎勵與恢復 ---
    const rewardMoney = 500;
    const recoverEnergy = 1000;

    user.money = (user.money || 0) + rewardMoney;
    user.energy = 1000; // 直接補滿體力，解決之前的 -10 問題
    user.lastSign = today; // 紀錄簽到日期

    fs.writeFileSync(filePath, JSON.stringify(backpack, null, 4));

    const embed = new EmbedBuilder()
        .setTitle('✍️ 每日簽到成功')
        .setDescription('感謝你的遊玩！')
        .addFields(
            { name: '💰 獲得金幣', value: `\`$${rewardMoney}\``, inline: true },
            { name: '⚡ 體力恢復', value: `\`+${recoverEnergy}\` (已補滿)`, inline: true }
        )
        .setColor('#2ECC71')
        .setTimestamp();

    return msg.reply({ embeds: [embed] });
};
