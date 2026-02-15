const fs = require('fs');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const targetUUID = args[0];

    if (!targetUUID) return msg.reply("❌ 請輸入裝備編號！範例：`!up 4ed3ee1a`");

    let backpack = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
    const user = backpack[uid];

    // 關鍵修正：從截圖看到的 user.equipments 陣列中尋找
    if (!user.equipments) {
        return msg.reply("❌ 你的資料中沒有裝備欄位。");
    }

    const weapon = user.equipments.find(e => e.uuid === targetUUID);

    if (!weapon) {
        return msg.reply(`❌ 找不到編號為 \`${targetUUID}\` 的裝備，請檢查輸入是否正確。`);
    }

    // 強化石檢查：從截圖看到你的 ID 是 upgrade_stone
    const stoneId = 'upgrade_stone';
    if ((user.inventory[stoneId] || 0) < 1) {
        return msg.reply("❌ 你的強化石不足！");
    }

    // 執行強化
    user.inventory[stoneId] -= 1;
    weapon.lv = (weapon.lv || 0) + 1;
    weapon.power = (weapon.power || 10) + 5;

    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));
    
    msg.reply(`✨ **強化成功！**\n🔹 武器：**${weapon.name}**\n📈 等級：Lv.${weapon.lv - 1} ➔ **Lv.${weapon.lv}**\n⚔️ 攻擊力：${weapon.power}`);
};
