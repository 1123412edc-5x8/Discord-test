const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const itemsList = require('../items.js'); // 請確保檔案在根目錄

module.exports = async (msg) => {
    // 取得指令名稱
    const args = msg.content.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    
    // 定義支援的指令
    const jobConfig = {
        '!mine': { name: '礦工', type: 'mine', emoji: '⛏️' },
        '!fish': { name: '漁夫', type: 'fish', emoji: '🎣' },
        '!herd': { name: '牧農', type: 'herd', emoji: '🐑' },
        '!fell': { name: '伐木工', type: 'fell', emoji: '🪓' },
        '!work': { name: '打工仔', type: 'work', emoji: '👷' } // 補上這行，防止 !work 崩潰
    };

    if (!jobConfig[cmd]) return; // 如果不是這些指令就不執行

    const uid = msg.author.id;
    let backpack;
    try {
        backpack = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    } catch (e) {
        return msg.reply('⚠️ 資料庫讀取失敗，請聯絡管理員。');
    }

    const user = backpack[uid];
    if (!user) return msg.reply('❌ 請先使用 `!newplayer` 註冊角色！');

    const config = jobConfig[cmd];

    // 1. 職業檢查 (!work 是通用打工，不檢查職業；其餘要檢查)
    if (cmd !== '!work' && user.job !== config.name) {
        return msg.reply(`❌ 你的職業是 **${user.job || '無'}**，不能執行此專屬工作！`);
    }

    // 2. 飽食度檢查
    if ((user.hunger || 0) <= 0) {
        return msg.reply('😫 **0/20** 你餓到沒力氣了，快去吃點東西！');
    }

    // 3. 隨機抽取掉落物 (對應 items.js 裡的 type)
    const possibleDrops = Object.entries(itemsList).filter(([id, info]) => info.type === config.type);
    
    // 如果是通用打工 (!work) 或者是該職業沒掉落物，則給予金幣報酬
    if (cmd === '!work' || possibleDrops.length === 0) {
        user.hunger -= 1;
        const salary = Math.floor(Math.random() * 51) + 100;
        user.money = (user.money || 0) + salary;
        user.workCount = (user.workCount || 0) + 1; // 增加 cw 統計次數

        fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));
        return msg.reply(`👷 你完成了臨時打工，獲得了 **$${salary}**！ (飽食度 -1)`);
    }

    // 4. 正常職業工作產出
    const [itemId, itemInfo] = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
    
    user.hunger -= 1;
    user.inventory[itemId] = (user.inventory[itemId] || 0) + 1;
    user.workCount = (user.workCount || 0) + 1; // 職業工作也計入 cw 次數
 // 在 work.js 執行成功的區塊（fs.writeFileSync 之前）
// 確保 user.workLog 存在
if (!user.workLog) user.workLog = [];

// 紀錄當前時間戳 (毫秒)
const now = Date.now();
user.workLog.push(now);

// 更新總次數 (舊有的欄位保留)
user.workCount = (user.workCount || 0) + 1;

// (可選) 為了效能，只保留最近 1000 筆紀錄，避免資料庫過大
if (user.workLog.length > 1000) user.workLog.shift();

fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));   fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));

    const embed = new EmbedBuilder()
        .setTitle(`${config.emoji} | 工作成果：${config.name}`)
        .setColor('#FFA500')
        .setDescription(`經過一番辛勞，你獲得了：\n**${itemInfo.name}** x \`1\``)
        .addFields({ name: '🍖 飽食度變化', value: `${user.hunger + 1} ➔ **${user.hunger}** / 20`, inline: true })
        .setFooter({ text: `加油，${msg.author.username}！`, iconURL: msg.author.displayAvatarURL() });

    await msg.reply({ embeds: [embed] });
};