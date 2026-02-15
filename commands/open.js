const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const filePath = path.join(__dirname, '../backpack.json');

    // 1. 強制讀取最新檔案，避免快取錯誤
    let backpack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = backpack[uid];

    if (!user) return msg.reply('❌ 找不到你的資料！');

    // 2. 定義重複欄位的對應關係
    const chestMapping = [
        { cn: "傳奇寶箱", id: "legendary_chest", color: "#FF4500" },
        { cn: "黃金寶箱", id: "golden_chest", color: "#FFD700" },
        { cn: "木製寶箱", id: "wooden_chest", color: "#8B4513" }
    ];

    // 3. 找出目前哪種寶箱有剩餘 (兩邊都檢查)
    const target = chestMapping.find(c => 
        (user.items && user.items[c.cn] > 0) || 
        (user.inventory && user.inventory[c.id] > 0)
    );

    if (!target) return msg.reply('❌ 你的背包裡已經沒有任何寶箱了！');

    // 4. --- 關鍵：同時扣除兩個重複欄位 ---
    // 扣除 user.items 裡的中文名稱
    if (user.items && user.items[target.cn] > 0) {
        user.items[target.cn] -= 1;
    }
    
    // 扣除 user.inventory 裡的英文 ID
    if (user.inventory && user.inventory[target.id] > 0) {
        user.inventory[target.id] -= 1;
    }

    // 5. 給予隨機金幣獎勵
    const rewardMoney = Math.floor(Math.random() * 800) + 200;
    user.money = (user.money || 0) + rewardMoney;

    // 6. --- 強制寫入檔案 ---
    fs.writeFileSync(filePath, JSON.stringify(backpack, null, 4));

    // 7. 計算最後剩餘總量供顯示
    const currentItems = user.items ? (user.items[target.cn] || 0) : 0;
    const currentInv = user.inventory ? (user.inventory[target.id] || 0) : 0;
    const totalLeft = currentItems + currentInv;

    const embed = new EmbedBuilder()
        .setTitle(`🎁 已開啟：${target.cn}`)
        .setColor(target.color)
        .setDescription(`成功清理重複欄位並扣除寶箱！\n獲得金幣：**$${rewardMoney}**\n目前總剩餘：**${totalLeft}** 個`)
        .setFooter({ text: '開啟成功!' });

    return msg.reply({ embeds: [embed] });
};
