const items = require('../items2.js');

module.exports = {
    // 計算玩家的總屬性
        calculateStats: (user) => {
                let stats = {
                            atk: user.atk || 5, // 基礎攻擊
                                        def: user.def || 0, // 基礎防禦
                                                    bonusAtk: 0,
                                                                bonusDef: 0
                                                                        };

                                                                                // 檢查身上穿的裝備 (假設 user.equips 存放目前穿戴的裝備 UUID)
                                                                                        // 這裡我們直接從玩家的背包 backpack 裡找出已裝備的物品
                                                                                                if (user.backpack) {
                                                                                                            const equippedItems = user.backpack.filter(i => i.isEquipped === true);
                                                                                                                        equippedItems.forEach(item => {
                                                                                                                                        stats.bonusAtk += item.atk || 0;
                                                                                                                                                        stats.bonusDef += item.def || 0;
                                                                                                                                                                    });
                                                                                                                                                                            }

                                                                                                                                                                                    return {
                                                                                                                                                                                                totalAtk: stats.atk + stats.bonusAtk,
                                                                                                                                                                                                            totalDef: stats.def + stats.bonusDef
                                                                                                                                                                                                                    };
                                                                                                                                                                                                                        },

                                                                                                                                                                                                                            // 戰鬥傷害判定公式
                                                                                                                                                                                                                                dealDamage: (attackerAtk, defenderDef) => {
                                                                                                                                                                                                                                        // 經典減法公式：(攻擊 - 防禦) 
                                                                                                                                                                                                                                                // 加入 0.9 ~ 1.1 的隨機浮動，讓傷害不會每次都一樣
                                                                                                                                                                                                                                                        const float = 0.9 + (Math.random() * 0.2);
                                                                                                                                                                                                                                                                let dmg = Math.floor((attackerAtk - defenderDef) * float);
                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                // 保底傷害 1，防止防禦太高變補血
                                                                                                                                                                                                                                                                                        return dmg > 0 ? dmg : 1;
                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                            };