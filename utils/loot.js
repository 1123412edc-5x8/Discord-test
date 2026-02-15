const fs = require('fs');
const ITEMS = require('../items.js');

module.exports = (msg) => {
    const uid = msg.author.id;
        const workCmds = ['!fish', '!mine', '!herd', '!fell'];
            if (!workCmds.includes(msg.content)) return false;

                let backpack = JSON.parse(fs.readFileSync('./backpack.json'));
                    let u = backpack[uid];

                        if (u.hunger <= 0) { 
                                msg.reply('❌ 體力耗盡！請吃東西恢復。'); 
                                        return true; 
                                            }
                                                
                                                    u.hunger -= 1;
                                                        const type = msg.content === '!fell' ? 'other' : msg.content.slice(1);

                                                            // --- 基礎權重設定 ---
                                                                let weights = {
                                                                        'fish_tilapia': 50, 'fish_salmon': 30, 'fish_tuna': 15, 'fish_squid': 5,
                                                                                'coal': 50, 'iron_ore': 30, 'gold_ore': 15, 'diamond_ore': 5,
                                                                                        'raw_chicken': 40, 'raw_pork': 30, 'raw_beef': 20, 'raw_mutton': 10,
                                                                                                'wood': 50, 'oak_wood': 30, 'dark_oak': 15, 'cherry_wood': 5
                                                                                                    };

                                                                                                        // ✨ 藥水核心改動：如果身上有幸運效果，稀有度機率翻倍
                                                                                                            let isLuckyActive = u.lucky > 0;
                                                                                                                if (isLuckyActive) {
                                                                                                                        // 將 15(高階) 變 30，將 5(稀有) 變 20，並相對減少普通物的機率
                                                                                                                                Object.keys(weights).forEach(k => {
                                                                                                                                            if (weights[k] <= 5) weights[k] = 20;       // 稀有物機率大幅提升 (5% -> 20%)
                                                                                                                                                        else if (weights[k] <= 15) weights[k] = 30; // 高階物機率提升 (15% -> 30%)
                                                                                                                                                                    else weights[k] = Math.max(10, weights[k] - 20); // 普通物機率大幅下降
                                                                                                                                                                            });
                                                                                                                                                                                    u.lucky--; // 消耗一次藥水效果
                                                                                                                                                                                        }

                                                                                                                                                                                            const keys = Object.keys(ITEMS).filter(k => ITEMS[k].type === type);
                                                                                                                                                                                                
                                                                                                                                                                                                    // 抽選邏輯
                                                                                                                                                                                                        let pool = [];
                                                                                                                                                                                                            keys.forEach(key => {
                                                                                                                                                                                                                    for (let i = 0; i < (weights[key] || 10); i++) pool.push(key);
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                            const key = pool[Math.floor(Math.random() * pool.length)];
                                                                                                                                                                                                                                
                                                                                                                                                                                                                                    // 產量計算 (5-8個)
                                                                                                                                                                                                                                        let amt = Math.floor(Math.random() * (8 - 5 + 1)) + 5; 

                                                                                                                                                                                                                                            // 職業加成 (+2個)
                                                                                                                                                                                                                                                if ((u.job === '漁夫' && type === 'fish') || 
                                                                                                                                                                                                                                                        (u.job === '礦工' && type === 'mine') || 
                                                                                                                                                                                                                                                                (u.job === '牧農' && type === 'herd')) {
                                                                                                                                                                                                                                                                        amt += 2; 
                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                // 藥水產量加成 (如果有喝藥水，產量額外 +3，變得更爽)
                                                                                                                                                                                                                                                                                    if (isLuckyActive) amt += 3;
                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                            u[key] = (u[key] || 0) + amt;
                                                                                                                                                                                                                                                                                                fs.writeFileSync('./backpack.json', JSON.stringify(backpack, null, 4));
                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                        let statusMsg = isLuckyActive ? '🌟 [強運發動中!] ' : '';
                                                                                                                                                                                                                                                                                                            msg.reply(`${statusMsg}${ITEMS[key].name} x${amt} 入袋！ (等級: ${weights[key] >= 20 && isLuckyActive ? '💎超稀有' : (weights[key] <= 10 ? '💎稀有' : '⚪普通')})`);
                                                                                                                                                                                                                                                                                                                return true;
                                                                                                                                                                                                                                                                                                                };