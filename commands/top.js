const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = async (msg) => {
    const backpack = JSON.parse(fs.readFileSync('./backpack.json'));
    
    // 將 JSON 轉為陣列並按金幣排序
    const sortedList = Object.entries(backpack)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (b.money || 0) - (a.money || 0))
        .slice(0, 10); // 取前 10 名

    const embed = new EmbedBuilder()
        .setColor('#FFD700') // 金色
        .setTitle('🏆 | 伺服器財富排行榜')
        .setDescription('看看誰才是真正的伺服器霸主！')
        .setTimestamp();

    let listContent = '';
    for (let i = 0; i < sortedList.length; i++) {
        const user = sortedList[i];
        // 試著從快取抓取使用者名稱，抓不到就顯示 ID
        const member = msg.guild.members.cache.get(user.id);
        const name = member ? member.user.username : `玩家(${user.id.slice(0,4)})`;
        
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        listContent += `${medal} **${name}** - 💰 \`${user.money || 0}\` 金幣\n`;
    }

    embed.addFields({ name: '前 10 名排行', value: listContent || '目前尚無數據' });

    return msg.reply({ embeds: [embed] });
};
