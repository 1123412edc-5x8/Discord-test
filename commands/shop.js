const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = async (msg, args) => {
    const uid = msg.author.id;
    let shopData = JSON.parse(fs.readFileSync('./shop_data.json'));
    if (!shopData[uid]) shopData[uid] = { name: `${msg.author.username} 的商店`, items: {}, status: 'close' };

    const sub = args[0];

    // 1. 下架功能 (remove)：修正無法刪除的 Bug
    if (sub === 'remove') {
        const name = args[1];
        const amount = parseInt(args[2]);

        if (!name) return msg.reply('❓ 用法：`!shop remove [商品名稱] [數量(選填)]`');
        
        // 檢查是否存在該商品
        if (!shopData[uid].items[name]) {
            return msg.reply(`❌ 你的商店裡找不到「${name}」，請確認名稱是否正確！`);
        }

        if (!isNaN(amount) && amount > 0) {
            // 局部下架
            shopData[uid].items[name].stock -= amount;
            if (shopData[uid].items[name].stock <= 0) {
                delete shopData[uid].items[name];
                msg.reply(`✅ 「${name}」庫存已清空並下架。`);
            } else {
                msg.reply(`✅ 「${name}」已下架 ${amount} 個，剩餘 ${shopData[uid].items[name].stock} 個。`);
            }
        } else {
            // 全部下架
            delete shopData[uid].items[name];
            msg.reply(`✅ 已將「${name}」從商店完全下架。`);
        }
        
        // 立即寫入存檔
        fs.writeFileSync('./shop_data.json', JSON.stringify(shopData, null, 4));
        return;
    }

    // 2. 查看商店 (支援 !shop @玩家)
    const targetUser = msg.mentions.users.first();
    if (targetUser || !sub || sub === 'list') {
        const target = targetUser || msg.author;
        const targetShop = shopData[target.id];

        // 打烊提示畫面
        if (target.id !== uid && (!targetShop || targetShop.status === 'close')) {
            const closedEmbed = new EmbedBuilder()
                .setDescription(`🏪 「該商店目前已經打烊了`)
                .setColor('#ED4245');
            return msg.reply({ embeds: [closedEmbed] });
        }

        const status = targetShop?.status === 'open' ? '營業中' : '已打烊';
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${targetShop?.name} (${status})`, iconURL: target.displayAvatarURL() })
            .setColor(targetShop?.status === 'open' ? '#57F287' : '#95A5A6')
            .setTitle('🍞 食物');

        let list = "";
        for (const [n, info] of Object.entries(targetShop?.items || {})) {
            list += `${n} ${info.price.toLocaleString()}$ / 個 (現有 ${info.stock} 個)\n`;
        }
        embed.setDescription(list || "目前貨架上沒有商品。");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`buy_hint`).setLabel('🛒 購買食物').setStyle(ButtonStyle.Primary)
        );
        return msg.reply({ embeds: [embed], components: [row] });
    }

    // 3. 上架功能 (add)
    if (sub === 'add') {
        const [_, name, num, price] = args;
        if (!name || isNaN(num) || isNaN(price)) return msg.reply('❓ 用法：`!shop add [名稱] [數量] [單價]`');
        
        shopData[uid].items[name] = { 
            price: parseInt(price), 
            stock: (shopData[uid].items[name]?.stock || 0) + parseInt(num) 
        };
        
        fs.writeFileSync('./shop_data.json', JSON.stringify(shopData, null, 4));
        return msg.reply(`✅ 成功上架 **${name}** x${num}，單價 $${price}`);
    }

    // 4. 開關店
    if (sub === 'open' || sub === 'close') {
        shopData[uid].status = sub;
        fs.writeFileSync('./shop_data.json', JSON.stringify(shopData, null, 4));
        return msg.reply(`📢 商店狀態已更新為：**${sub === 'open' ? '營業中' : '已打烊'}**`);
    }
};
