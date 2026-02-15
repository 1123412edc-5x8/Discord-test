const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const combat = require('./combat.js'); // 引入剛才的戰鬥模組

module.exports = async (msg, args) => {
    const uid = msg.author.id;
        let backpackData = JSON.parse(fs.readFileSync('./backpack.json', 'utf8'));
            const user = backpackData[uid];

                if (!user) return msg.reply('❌ 請先使用 `!newplayer` 註冊！');

                    // 1. 調用 combat.js 的 calculateStats 算總分
                        const stats = combat.calculateStats(user);

                            // 2. 找出目前穿在身上的裝備清單
                                const equippedItems = (user.backpack || []).filter(i => i.isEquipped);
                                    const equipList = equippedItems.length > 0 
                                            ? equippedItems.map(i => `• [${i.subtype}] **${i.name}**`).join('\n')
                                                    : '無裝備';

                                                        // 3. 製作 Embed 面板
                                                            const embed = new EmbedBuilder()
                                                                    .setTitle(`👤 | ${msg.author.username} 的冒險者面板`)
                                                                            .setThumbnail(msg.author.displayAvatarURL())
                                                                                    .setColor('#0099ff')
                                                                                            .addFields(
                                                                                                        { name: '📍 當前位置', value: `\`${user.location || '遺忘荒野'}\``, inline: false },
                                                                                                                    { name: '❤️ 體力 (HP)', value: `\`${user.hp || 100} / 100\``, inline: true },
                                                                                                                                { name: '職業', value: `\`${user.job || '冒險者'}\``, inline: true },
                                                                                                                                            { name: '\u200B', value: '\u200B', inline: false }, // 空行
                                                                                                                                                        { name: '⚔️ 總攻擊力 (ATK)', value: `**${stats.totalAtk}** \n(基礎: ${user.atk || 5} + 裝備: ${stats.totalAtk - (user.atk || 5)})`, inline: true },
                                                                                                                                                                    { name: '🛡️ 總防禦力 (DEF)', value: `**${stats.totalDef}** \n(基礎: ${user.def || 0} + 裝備: ${stats.totalDef - (user.def || 0)})`, inline: true },
                                                                                                                                                                                { name: '👕 當前裝備', value: equipList, inline: false }
                                                                                                                                                                                        )
                                                                                                                                                                                                .setFooter({ text: '使用 !equip <UUID> 來穿脫裝備' });

                                                                                                                                                                                                    await msg.reply({ embeds: [embed] });
                                                                                                                                                                                                    };