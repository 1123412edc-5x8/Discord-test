const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = async (msg, args) => {
    // 檢查 msg 是否存在，防止 crash
    if (!msg || !msg.author) return;

    try {
        const uid = msg.author.id;
        const username = msg.author.username;
        const filePath = './backpack.json';

        // 讀取檔案
        let backpack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // 如果玩家不存在，則初始化
        if (!backpack[uid]) {
            backpack[uid] = {
                name: username,
                money: 1000,
                inventory: {},
                energy:1000,
                hp: 100,
                maxHp: 100,
                energy: 1000,
                hunger:20,
                level: 1,
                exp: 0
            };
            fs.writeFileSync(filePath, JSON.stringify(backpack, null, 4));

            const embed = new EmbedBuilder()
                .setTitle('✨ 帳號註冊成功')
                .setDescription(`歡迎 **${username}** 加入！\n你已獲得初始資金 **$1,000**。 !help可以查看指令喔~`)
                .setColor('#57F287');

            return msg.reply({ embeds: [embed] });
        } else {
            return msg.reply('❌ 你已經註冊過帳號囉！');
        }
    } catch (error) {
        console.error('Newplayer 指令出錯:', error);
        return msg.reply('❌ 註冊時發生錯誤，請檢查 backpack.json 格式是否正確。');
    }
};