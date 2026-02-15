const fs = require('fs');
const { EmbedBuilder } = require('discord.js');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const backpack = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const user = backpack[uid];

    if (!user) return msg.reply('❌ 請先使用 `!newplayer` 註冊。');

    // --- 關鍵時間修正：強制台灣時區 ---
    const now = new Date();
    
    // 取得台灣時間的字串與各個時間單位
    const taipeiDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' }); // 格式：YYYY-MM-DD
    const taipeiTimeStr = now.toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false, hour: '2-digit', minute: '2-digit' });

    // 取得今天與本週的起點 (以台灣時間為準)
    const today = new Date(taipeiDateStr + "T00:00:00+08:00");
    const startOfToday = today.getTime();

    // 計算本週一 (台灣時間)
    const day = today.getDay(); 
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const startOfWeek = new Date(today.getTime() + diffToMonday * 24 * 60 * 60 * 1000).getTime();

    // 取得工作紀錄
    const workLog = user.workLog || [];

    // --- 計算次數 ---
    const totalCount = workLog.length; 
    const todayCount = workLog.filter(ts => ts >= startOfToday).length;
    const weekCount = workLog.filter(ts => ts >= startOfWeek).length;

    const embed = new EmbedBuilder()
        .setTitle(`📊 ${msg.author.username} 的工作統計`)
        .setColor('#2ecc71')
        .setThumbnail(msg.author.displayAvatarURL())
        .addFields(
            { name: '總累積次數', value: `\`${totalCount}\` 次`, inline: false },
            { name: '📅 本週工作', value: `\`${weekCount}\` 次`, inline: true },
            { name: '🌞 今日工作', value: `\`${todayCount}\` 次`, inline: true }
        )
        .setDescription(`目前的職業：**${user.job || '無'}**`)
        .setFooter({ text: `數據統計中... | 查詢時間：${taipeiTimeStr}(UTC+8)` });

    await msg.reply({ embeds: [embed] });
};