const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const itemsList = require('../items.js');
const { addExp, requiredExp } = require('../utils/levelSystem.js');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    const filePath = './backpack.json';
    let backpack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = backpack[uid];

    if (!user) return msg.reply('❌ 你還沒註冊！請先輸入 `!newplayer`。');

    // --- ⚡ 基礎消耗檢查 ---
    const energyCost = 10;
    if ((user.energy || 0) < energyCost) {
        return msg.reply(`❌ 你太累了！體力不足 **${energyCost}**。`);
    }

    const ticketID = 'adventure_ticket';
    if (!user.inventory || !user.inventory[ticketID] || user.inventory[ticketID] <= 0) {
        return msg.reply('❌ 你沒有 **冒險入場券**！請先去購買。');
    }

    // --- 🗺️ 地圖與等級平衡設定 (整合強制位置邏輯) ---
    const locationConfig = {
        castle: { name: '🏰 城堡', minLv: 1 },
        forest: { name: '🌲 森林', minLv: 1 },
        mountain: { name: '⛰️ 山脈', minLv: 20 },
        desert: { name: '🏜️ 沙漠', minLv: 40 },
        iceisland: { name: '🧊 冰島', minLv: 60 },
        dragoncave: { name: '🐉 龍穴', minLv: 90 },
        abyss: { name: '👹 深淵', minLv: 120 }
    };

    // 關鍵修正：禁止手打，強制讀取 user.currentLocation
    const locMapping = {
        '🏰 城堡': 'castle', '🌲 森林': 'forest', '⛰️ 山脈': 'mountain',
        '🏜️ 沙漠': 'desert', '🧊 冰島': 'iceisland', '🐉 龍穴': 'dragoncave', '👹 深淵': 'abyss'
    };

    const currentLocKey = locMapping[user.currentLocation] || 'forest';
    const config = locationConfig[currentLocKey];

    // 等級檢查 (二次防線)
    if (user.level < config.minLv) {
        return msg.reply(`⚠️ 實力不足！\`${config.name}\` 需要等級 **Lv.${config.minLv}**。請先在 \`!ls\` 切換地點。`);
    }

    // --- 📜 全地圖事件資料庫 (完整保留不刪減) ---
    const locationEvents = {
        castle: [
            { w: 15, msg: "🏰 你在城堡中遇到一位迷失的商人，他給了你一些補給品。", item: "log_oak", amount: 2, money: 100, dmg: 0, color: "#F1C40F" },
            { w: 10, msg: "⚔️ 城堡守衛要求你證明實力，一場激烈的對戰之後你贏了！", item: "shield_basic", amount: 1, money: 150, dmg: 15, color: "#E74C3C" },
            { w: 20, msg: "👑 國王的侍從邀請你去宴會廳，你享受了一頓豐盛的晚餐。", item: "food_bread", amount: 3, money: 200, dmg: 0, color: "#F39C12" },
            { w: 20, msg: "📜 你在圖書館發現了一本古老的日誌，裡面有些有用的訊息。", item: "ancient_tome", amount: 1, money: 80, dmg: 0, color: "#9B59B6" },
            { w: 35, msg: "💨 城堡裡人很多，你什麼都沒獲得。", item: null, amount: 0, money: 0, dmg: 0, color: "#BDC3C7" }
        ],
        forest: [
            { w: 12, msg: "🌲 你在森林深處發現了一個被遺棄的物資箱！", item: "log_oak", amount: 3, money: 50, dmg: 5, color: "#57F287" },
            { w: 10, msg: "🐺 你遇到了一隻野狼並發生戰鬥，雖然受了傷但趕跑了它。", item: "raw_chicken", amount: 1, money: 100, dmg: 20, color: "#E74C3C" },
            { w: 20, msg: "🍎 你在路邊採摘了一些新鮮的蘋果。", item: "apple", amount: 2, money: 20, dmg: 0, color: "#FFFF00" },
            { w: 18, msg: "🐰 一隻灰毛野兔從草叢竄出，你眼疾手快地抓住了它！", item: "rabbit_fur", amount: 1, money: 50, dmg: 0, color: "#FFFFFF" },
            { w: 15, msg: "🐗 一頭暴躁的野豬向你衝來，你側身閃過並反手將其制服。", item: "boar_tusk", amount: 1, money: 120, dmg: 15, color: "#E74C3C" },
            { w: 25, msg: "🌲 森林很安靜，你只是聽到風聲。", item: null, amount: 0, money: 0, dmg: 0, color: "#BDC3C7" }
        ],
        mountain: [
            { w: 15, msg: "⛏️ 你在山脈中發現了豐富的鐵礦！", item: "iron_ore", amount: 3, money: 120, dmg: 5, color: "#95A5A6" },
            { w: 12, msg: "✨ 你發現了一個閃閃發光的金礦脈！", item: "gold_ore", amount: 2, money: 200, dmg: 10, color: "#F1C40F" },
            { w: 8, msg: "💎 天啊！你找到了寶貴的鑽石礦！", item: "diamond_ore", amount: 1, money: 400, dmg: 20, color: "#3498DB" },
            { w: 12, msg: "🪨 一場山崩！你狼狽地逃了出來，但也收穫了不少碎石。", item: "coal", amount: 5, money: 50, dmg: 25, color: "#E74C3C" },
            { w: 20, msg: "🦅 山頂的老鷹看起來不太友善，你決定離開。", item: null, amount: 0, money: 0, dmg: 0, color: "#BDC3C7" },
            { w: 33, msg: "⛑️ 你在山路上迷了方向，什麼也沒找到。", item: null, amount: 0, money: 0, dmg: 0, color: "#BDC3C7" }
        ],
        desert: [
            { w: 15, msg: "🏺 你發現了一個埋藏的古代陶罐，裡面裝滿了古幣！", item: "ancient_coin", amount: 5, money: 300, dmg: 10, color: "#F39C12" },
            { w: 12, msg: "🗿 你找到了一尊神秘的石像，它散發著古老的魔力。", item: "ancient_statue", amount: 1, money: 250, dmg: 5, color: "#9B59B6" },
            { w: 10, msg: "⚱️ 沙漠中的遺跡墓穴裡，你發現了失落的寶藏！", item: "treasure_chest", amount: 1, money: 500, dmg: 30, color: "#E67E22" },
            { w: 15, msg: "🐪 你遇到了沙漠商人，他賣了你一些稀奇古怪的東西。", item: "exotic_spice", amount: 3, money: 100, dmg: 0, color: "#E74C3C" },
            { w: 20, msg: "🌪️ 一場沙塵暴來襲！你狼狽地躲藏起來。", item: null, amount: 0, money: 0, dmg: 25, color: "#BDC3C7" },
            { w: 28, msg: "🏜️ 沙漠太熱了，你決定放棄尋寶。", item: null, amount: 0, money: 0, dmg: 0, color: "#BDC3C7" }
        ],
        iceisland: [
            { w: 10, msg: "❄️ 你發現了一些珍貴的冰晶礦！", item: "ice_crystal", amount: 3, money: 150, dmg: 15, color: "#3498DB" },
            { w: 12, msg: "🧊 一隻冰雪生物向你靠近，但似乎沒有攻擊意圖。", item: "frost_core", amount: 1, money: 200, dmg: 20, color: "#BDC3C7" },
            { w: 10, msg: "⛸️ 你在冰凍的湖面上滑行，發現了古老的遺跡。", item: "frozen_artifact", amount: 1, money: 300, dmg: 30, color: "#9B59B6" },
            { w: 8, msg: "🐧 你和一群企鵝成為了朋友，它們給了你冰封的寶物。", item: "penguin_treasure", amount: 2, money: 80, dmg: 0, color: "#FFFFFF" },
            { w: 25, msg: "🥶 太冷了！你的身體開始冰凍，必須立刻離開。", item: null, amount: 0, money: 0, dmg: 40, color: "#E74C3C" },
            { w: 35, msg: "❄️ 白茫茫一片，什麼都看不清。", item: null, amount: 0, money: 0, dmg: 0, color: "#BDC3C7" }
        ],
        dragoncave: [
            { w: 8, msg: "🐉 你與龍對戰並獲勝！收穫了龍鱗與龍珠！", item: "dragon_scale", amount: 2, money: 600, dmg: 50, color: "#E74C3C" },
            { w: 10, msg: "💍 龍窩裡有一堆寶藏！你拿了一些金銀財寶。", item: "gold_bar", amount: 3, money: 800, dmg: 20, color: "#F1C40F" },
            { w: 6, msg: "👹 小龍怪！它們襲擊了你，但你成功逃脫。", item: "dragon_blood", amount: 1, money: 400, dmg: 45, color: "#9B59B6" },
            { w: 12, msg: "🔥 龍穴太危險了，你被火焰灼傷了。", item: null, amount: 0, money: 0, dmg: 60, color: "#E74C3C" },
            { w: 64, msg: "⚠️ 你感受到了龍的氣息，嚇得逃出了龍穴。", item: null, amount: 0, money: 0, dmg: 0, color: "#BDC3C7" }
        ],
        abyss: [
            { w: 5, msg: "😈 你戰勝了深淵的守護者，獲得了禁忌的力量！", item: "abyss_core", amount: 1, money: 1000, dmg: 80, color: "#2C3E50" },
            { w: 8, msg: "🌑 深淵中的古老魔法物品在呼喚你！", item: "cursed_artifact", amount: 1, money: 500, dmg: 40, color: "#9B59B6" },
            { w: 10, msg: "👻 亡靈們襲擊了你！你舍命奪取了他們的寶物。", item: "soul_fragment", amount: 3, money: 300, dmg: 70, color: "#BDC3C7" },
            { w: 12, msg: "🕷️ 蜘蛛怪群向你撲來，你決定戰鬥！", item: "void_silk", amount: 2, money: 200, dmg: 50, color: "#34495E" },
            { w: 65, msg: "⚠️ 深淵的低語讓你感到恐懼，你退縮了。", item: null, amount: 0, money: 0, dmg: 0, color: "#BDC3C7" }
        ]
    };

    // --- 🎲 隨機事件抽取邏輯 ---
    const events = locationEvents[currentLocKey] || locationEvents.forest;
    const totalWeight = events.reduce((sum, e) => sum + e.w, 0);
    let random = Math.random() * totalWeight;
    let event = events[events.length - 1];

    for (const e of events) {
        if (random < e.w) {
            event = e;
            break;
        }
        random -= e.w;
    }

    // --- 💾 數據更新 ---
    user.energy -= energyCost;
    user.hp = Math.max(0, (user.hp || 100) - event.dmg);
    user.money = (user.money || 0) + event.money;
    
    // 扣除一張入場券
    user.inventory[ticketID] -= 1;

    // 獲得物品邏輯
    let lootMsg = "無";
    if (event.item) {
        user.inventory[event.item] = (user.inventory[event.item] || 0) + event.amount;
        lootMsg = `${itemsList[event.item]?.name || event.item} x${event.amount}`;
    }

    // 經驗值獎勵 (根據地區難度給予不同經驗)
    const expGain = { castle: 20, forest: 15, mountain: 40, desert: 60, iceisland: 100, dragoncave: 200, abyss: 400 }[currentLocKey] || 10;
    const levelop = addExp(user, expGain);

    fs.writeFileSync(filePath, JSON.stringify(backpack, null, 4));

    // --- 🖼️ 渲染結果 ---
    const embed = new EmbedBuilder()
        .setTitle(`🧭 冒險結果：${config.name}`)
        .setDescription(event.msg)
        .setColor(event.color)
        .addFields(
            { name: '💰 獲得金幣', value: `${event.money}`, inline: true },
            { name: '🎁 獲得物品', value: lootMsg, inline: true },
            { name: '💢 受到傷害', value: `${event.dmg}`, inline: true },
            { name: '⭐ 獲得經驗', value: `${expGain}`, inline: true },
            { name: '❤️ 當前血量', value: `${user.hp}/${user.maxHp || 100}`, inline: true },
            { name: '⚡ 剩餘體力', value: `${user.energy}`, inline: true }
        );

    if (levelop) embed.setFooter({ text: `🎊 恭喜升級！目前等級：Lv.${user.level}` });

    return msg.reply({ embeds: [embed] });
};
