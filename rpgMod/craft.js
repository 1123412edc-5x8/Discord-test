const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = async (msg, args) => {
    const embed = new EmbedBuilder()
            .setTitle('💍 | 合成一覽')
                    .setDescription(
                                '➡️ 點擊下方選單選擇查看合成分類\n' +
                                            '➡️ 請確保背包有足夠空間再進行合成\n' +
                                                        '➡️ 合成請使用 `!make <物品代號>`'
                                                                )
                                                                        .setColor('#7cfc00') 
                                                                                .setFooter({ text: '鵝鵝的RPG | 合成系統' });

                                                                                    const menu = new ActionRowBuilder().addComponents(
                                                                                            new StringSelectMenuBuilder()
                                                                                                        .setCustomId('craft_category_select')
                                                                                                                    .setPlaceholder('--- 選擇你要查看的分類 ---')
                                                                                                                                .addOptions([
                                                                                                                                                { label: '近戰/遠程武器 (劍/弓/斧)', value: 'craft_melee', emoji: '⚔️' },
                                                                                                                                                                { label: '魔法媒介 (火/水/大地)', value: 'craft_magic', emoji: '🔮' },
                                                                                                                                                                                { label: '防具套件 (頭/甲/褲/鞋)', value: 'craft_armor', emoji: '🛡️' },
                                                                                                                                                                                                { label: '飾品配件 (耳環/戒指/鏈墜/護符)', value: 'craft_accessory', emoji: '📿' }
                                                                                                                                                                                                            ])
                                                                                                                                                                                                                );

                                                                                                                                                                                                                    await msg.reply({ embeds: [embed], components: [menu] });
                                                                                                                                                                                                                    };