let isSystemOnline = true;
const {
    Client, GatewayIntentBits, Partials,
    ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');
const fs = require('fs');

// 引入互動處理模組
const handleInteraction = require('./rpgMod/handleInteraction.js');
// ✨ 引入採集系統模組
const collect = require('./commands/work.js'); 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const logChannelId = '1469990225529929728';

// --- 指令載入 ---
const commands = {
    admin: require('./commands/admin.js'),
    buy: require('./commands/buy.js'),
    eat: require('./commands/eat.js'),
    farmGet: require('./commands/farmGet.js'),
    farmInfo: require('./commands/farmInfo.js'),
    farmPlant: require('./commands/farmPlant.js'),
    player: require('./commands/player.js'),
    shop: require('./commands/shop.js'),
    wiki: require('./commands/wiki.js'),
    work: require('./commands/work.js'),
    job: require('./commands/job.js'),
    top: require('./commands/top.js'),
    bake: require('./commands/bake.js'),
    newplayer: require('./commands/newplayer.js'),
    help: require('./commands/help.js'),
    sell: require('./commands/sell.js'),
    market: require('./commands/market.js'),
    sign: require('./commands/sign.js'),
    open: require('./commands/open.js'),
    me: require('./commands/me.js'),
    ls: require('./commands/ls.js')
};

const rpgMod = {
    craft: require('./rpgMod/craft.js'),
    heal: require('./rpgMod/heal.js'),
    adv: require('./rpgMod/adv.js'),
    upgrade: require('./rpgMod/upgrade.js'),
    make: require('./rpgMod/make.js'),
    equip: require('./rpgMod/equip.js'),
    map: require('./rpgMod/map.js'),
    check_work: require('./rpgMod/check_work.js'),
    inv: require('./rpgMod/inv.js')
};

const getTime = () => new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

// --- 事件：Ready ---
client.on('ready', async () => {
    console.log(`✅ 機器人已上線：${client.user.tag}`);
    const channel = await client.channels.fetch(logChannelId).catch(() => null);
    if (channel) {
        const startupEmbed = new EmbedBuilder()
            .setTitle('🟢 系統核心啟動成功')
            .setDescription('所有模組已重載。')
            .setColor('#0099ff')
            .addFields({ name: '⏰ 啟動時間', value: `\`${getTime()}\`` });
        await channel.send({ embeds: [startupEmbed] });
    }
});

// --- 事件：Message ---
client.on('messageCreate', async (msg) => {
    if (msg.author.bot || !msg.content.startsWith('!')) return;

    const ownerId = '1292424394957918248';
    const args = msg.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // 系統開關檢查
    if (msg.author.id === ownerId) {
        if (commandName === 'off') { isSystemOnline = false; return msg.reply('🔴 系統關閉'); }
        if (commandName === 'on') { isSystemOnline = true; return msg.reply('🟢 系統啟動'); }
    }

    if (!isSystemOnline && msg.author.id !== ownerId) return;

    // 統一指令變數定義
    let cmd = commandName;
    if (cmd === 'cw' || cmd === 'checkwork') cmd = 'check_work';

    try {
        if (commands[cmd]) {
            await commands[cmd](msg, args);
        } else if (rpgMod[cmd]) {
            await rpgMod[cmd](msg, args);
        } 
        // ✨ 專屬採集指令分流 (!mine, !fish, !ranch, !chop, !farm)
        else if (['mine', 'fish', 'ranch', 'chop', 'farm'].includes(cmd)) {
            await work(msg, cmd);
        }
        else if (cmd.startsWith('buy_')) {
            args.unshift(cmd.replace('buy_', ''));
            await commands.buy(msg, args);
        }
    } catch (err) {
        console.error(`指令錯誤 [${cmd}]:`, err);
        msg.reply('❌ 執行出錯。');
    }
});

// --- 事件：Interaction ---
client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'craft_category_select') {
                return await handleInteraction(interaction);
            }
        }

        if (interaction.isButton()) {
            const uid = interaction.user.id;
            console.log(`[按鈕觸發] ID: ${interaction.customId} | 來自: ${interaction.user.username}`);

            let backpackData = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
            if (!backpackData[uid]) {
                return await interaction.reply({ content: '❌ 請先使用 `!newplayer` 註冊帳號！', ephemeral: true });
            }

            const jobMap = {
                'job_miner': '礦工',
                'job_fisher': '漁夫',
                'job_rancher': '牧農',
                'job_woodcutter': '伐木工',
                'job_farmer': '農夫'
            };

            const selectedJob = jobMap[interaction.customId];

            if (selectedJob) {
                backpackData[uid].job = selectedJob;
                fs.writeFileSync('./backpack.json', JSON.stringify(backpackData, null, 4));

                return await interaction.reply({ 
                    content: `✅ 恭喜！你已正式轉職為 **【${selectedJob}】**！`, 
                    ephemeral: true 
                });
            } else {
                console.log(`⚠️ 未定義的按鈕 ID: ${interaction.customId}`);
            }
        }
    } catch (err) {
        console.error('❌ 互動出錯:', err);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: '❌ 處理交互時發生錯誤。', ephemeral: true });
        }
    }
});

process.env.DISCORD_TOKEN