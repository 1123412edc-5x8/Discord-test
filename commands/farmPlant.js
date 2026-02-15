const fs = require('fs');

module.exports = async (interaction) => {
    const uid = interaction.user.id;
    let backpack = JSON.parse(fs.readFileSync('./backpack.json'));
    const user = backpack[uid];

    const amount = interaction.options.getInteger('amount');
    const tool = interaction.options.getString('tool');

    // 1. 為了支援一次種 100 格，我們把每格消耗降到非常低 (例如 0.1)
    // 這樣種 100 格才扣 10 點體力，完全在 20 點上限內
    const perCost = 0.1; 
    const totalCost = Math.ceil(amount * perCost); // 使用 Math.ceil 無條件進位成整數

    // 2. 檢查輸入數量是否超過 100
    if (amount > 100) {
        return interaction.reply({ 
            content: `❌ 單次種植數量最多為 100 格！`, 
            ephemeral: true 
        });
    }

    // 3. 檢查體力
    if (user.hunger < totalCost) {
        return interaction.reply({ 
            content: `❌ 體力不足！種植 ${amount} 格需要 ${totalCost} 飽食度，你目前僅有 ${user.hunger}。`, 
            ephemeral: true 
        });
    }

    // 4. 檢查工具
    if (!user.inventory[tool] || user.inventory[tool] <= 0) {
        return interaction.reply({ content: `❌ 你身上沒有指定的工具！`, ephemeral: true });
    }

    // 5. 扣除體力並給予隨機作物
    user.hunger -= totalCost;
    const items = ['wheat', 'potato', 'tomato'];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    user.inventory[randomItem] = (user.inventory[randomItem] || 0) + amount;

    fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));
    await interaction.reply({ 
        content: `✅ 成功種植了 ${amount} 格！消耗了 ${totalCost} 點體力，獲得了 ${amount} 個相關作物。(目前體力: ${user.hunger}/20)` 
    });
};
