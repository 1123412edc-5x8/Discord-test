const { EmbedBuilder } = require('discord.js');

// 詳細指令資料，可按需擴充
const helpData = {
    newplayer: {
        title: '🧾 !newplayer',
        desc: '`!newplayer` - 註冊新帳號並獲得初始資金 $1,000。',
        usage: '`!newplayer`',
        example: '`!newplayer`'
    },
    player: {
        title: '🧑‍🎮 !player / !me / !ls',
        desc: '`!player`、`!me`、`!ls` - 查看你的玩家資訊與背包。',
        usage: '`!player`',
        example: '`!player`'
    },
    shop: {
        title: '🏪 !shop',
        desc: '管理與檢視個人商店。',
        usage: '`!shop [list|add|remove|open|close]`',
        example: '`!shop add 番茄炒蛋 5 120` (上架)\n`!shop remove 番茄炒蛋 2` (下架)\n`!shop` (查看自己的商店)\n`!shop @玩家` (查看別人商店)',
        output: '```✅ 已上架：番茄炒蛋 x5，單價 $120\n商店列表：\n番茄炒蛋 $120 / 個 (現有 5 個)```'
    },
    buy: {
        title: '🛒 !buy',
        desc: '`!buy @賣家 [商品名稱] [數量]` - 從玩家商店購買物品。',
        usage: '`!buy @賣家 [商品名稱] [數量]`',
        example: '`!buy @賣家 番茄炒蛋 2`',
        output: '```✅ 購買成功！已花費 $240 購買 番茄炒蛋 x2\n（賣家剩餘庫存：3）```'
    },
    sell: {
        title: '💰 !sell',
        desc: '`!sell [物品] [數量/all]` - 將背包內物品賣給系統或商店。',
        usage: '`!sell [物品] [數量|all]`',
        example: '`!sell 番茄炒蛋 3` 或 `!sell 番茄炒蛋 all`',
        output: '```💰 全額收購成功！\n賣出：番茄炒蛋 x3\n獲得：$360\n（背包剩餘：2）```'
    },
    eat: {
        title: '🍽️ !eat',
        desc: '`!eat` - 顯示可吃的食物清單並回復體力。',
        usage: '`!eat [物品名] [數量]`',
        example: '`!eat 馬鈴薯 1`',
        output: '```🍴 你吃了 馬鈴薯 x1，回復了 5 點體力！(目前：15/20)```'
    },
    adv: {
        title: '⚔️ !adv',
        desc: '`!adv` - 使用冒險入場券參加冒險（會消耗票與體力）。',
        usage: '`!adv`',
        example: '`!adv`',
        output: '```🏹 冒險結果：\n描述：你在森林發現物資箱\n🎁 獲得：橡木 x3、$50\n🩸 血量變化：-5（剩餘：95）\n📈 獲得 EXP：40```'
    },
    open: {
        title: '📦 !open',
        desc: '`!open` - 打開寶箱或箱子（視物品而定）。',
        usage: '`!open [箱子名稱]`',
        example: '`!open mystic_chest`',
        output: '```📦 你打開了 mystic_chest，獲得：稀有零件 x1（稀有）```'
    },
    craft: {
        title: '🔨 !craft',
        desc: '`!craft` - 製作物品（RPG 模組）。',
        usage: '`!craft [配方名稱]`',
        example: '`!craft 鐵劍`',
        output: '```🔨 製作成功！你獲得：鐵劍 x1（耐久 100%）```'
    },
    heal: {
        title: '💊 !heal',
        desc: '`!heal` - 恢復血量（RPG 模組）。',
        usage: '`!heal [物品名稱|編號] [數量]`',
        example: '`!heal 簡易繃帶 2` 或 `!heal 2 3`（2 = 編號，3 = 數量）\n`!heal list`（查看可用醫療物資與編號）'
    },
    work: {
        title: '💼 !work / mine / fish / herd / fell',
        desc: '多種工作指令以取得資源或金錢。',
        usage: '`!work` 或 `!mine` / `!fish` / `!herd` / `!fell`',
        example: '`!mine`'
    },
    job: {
        title: '🛠️ !job',
        desc: '`!job` - 切換或設定職業（有時會用按鈕互動）。',
        usage: '`!job`',
        example: '`!job`'
    },
    equip: {
        title: '🧰 !equip',
        desc: '`!equip` - 裝備或查看裝備。',
        usage: '`!equip [裝備名稱]`',
        example: '`!equip 木劍`'
    },
    top: {
        title: '🏆 !top',
        desc: '`!top` - 顯示排行榜。',
        usage: '`!top`',
        example: '`!top`'
    },
    sign: {
        title: '📝 !sign',
        desc: '`!sign` - 每日簽到取得獎勵（如果支援）。',
        usage: '`!sign`',
        example: '`!sign`'
    },
    wiki: {
        title: '📚 !wiki',
        desc: '`!wiki` - 查詢物品資訊。',
        usage: '`!wiki [物品名稱]`',
        example: '`!wiki 木頭`'
    },
    admin: {
        title: '🔧 !admin',
        desc: '管理員專用指令（需要權限）。',
        usage: '`!admin [subcommand]`',
        example: '`!admin give @user item 1`'
    }
};

module.exports = async (msg, args) => {
    const cmd = args && args[0] ? args[0].toLowerCase() : null;

    // 若使用 !help [command]
    if (cmd) {
        // 支援別名
        const aliasMap = { me: 'player', ls: 'player', mine: 'work', fish: 'work', herd: 'work', fell: 'work' };
        const key = aliasMap[cmd] || cmd;
        const info = helpData[key];

        if (!info) return msg.reply('❌ 找不到指令 `' + cmd + '`，請輸入 `!help` 查看可用指令。');

        const embed = new EmbedBuilder()
            .setTitle(info.title)
            .setColor('#57F287')
            .setDescription(info.desc)
            .addFields(
                { name: '用法', value: info.usage, inline: false },
                { name: '範例', value: info.example, inline: false }
            );

        // 若有提供範例輸出則顯示
        if (info.output) embed.addFields({ name: '範例輸出', value: info.output, inline: false });

        embed.setFooter({ text: '需要新增或更正說明請開 PR 或聯絡開發者' }).setTimestamp();

        return msg.reply({ embeds: [embed] });
    }

    // 沒帶參數，顯示總覽（維持簡潔）
    const embed = new EmbedBuilder()
        .setTitle('❓ 指令總覽')
        .setColor('#57F287')
        .setDescription('輸入 `!help [指令]` 查看該指令的詳細用法與範例。')
        .addFields(
            { name: '🧾 註冊 / 帳號', value: '`!newplayer` - 註冊新帳號', inline: false },
            { name: '🧑‍🎮 玩家資訊', value: '`!player` / `!me` / `!ls` - 顯示你的資訊與背包', inline: false },
            { name: '🏪 商店', value: '`!shop` - 管理你的商店（`!help shop` 查看更多）', inline: false },
            { name: '🛒 購買 / 出售', value: '`!buy` / `!sell`', inline: false },
            { name: '🍽️ 吃東西', value: '`!eat` - 查看可吃物品 (使用 `!help eat` 查看範例)', inline: false },
            { name: '⚔️ 冒險 / RPG', value: '`!adv` / `!open` / `!craft` / `!heal`', inline: false },
            { name: '💼 工作 / 職業', value: '`!work` / `!job`', inline: false },
            { name: '🧰 其他', value: '`!equip` / `!top` / `!sign` / `!wiki`', inline: false },
            { name: '🔧 管理員', value: '`!admin`（需權限）', inline: false },
            { name: 'ℹ️ 注意', value: '某些功能已移轉為斜線指令（例如 `/make`, `/bake`）。', inline: false }
        )
        .setFooter({ text: '輸入 `!help [指令]` 以取得更多資訊' })
        .setTimestamp();

    return msg.reply({ embeds: [embed] });
};
