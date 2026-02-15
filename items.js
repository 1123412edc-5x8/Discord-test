module.exports = {
    // --- 基礎物資與工具 ---
    'coal': { name: '⚫ 煤炭', price: 25, type: 'mine' },
    'iron_ore': { name: '🔘 鐵礦', price: 60, type: 'mine' },
    'gold_ore': { name: '🟡 金礦', price: 150, type: 'mine' },
    'diamond_ore': { name: '💎 鑽石礦', price: 400, type: 'mine' },
    'iron_ingot': { name: '⛓️ 精煉鐵', price: 500, type: 'material' },
    'iron_hoe': { name: '⚙️ 鐵鋤頭', price: 800, type: 'tool' },
    'wood_hoe': { name: '🪵 木鋤頭', price: 100, type: 'tool' },
    'stick': { name: '🥢 木棒', price: 10, type: 'material' },

    // --- 漁獲 ---
    'fish_tilapia': { name: '🐟 吳郭魚', price: 20, type: 'fish', heal: 2 },
    'fish_squid': { name: '🦑 大王烏賊', price: 300, type: 'fish', heal: 5 },
    'fish_salmon': { name: '🐠 鮭魚', price: 150, type: 'fish', heal: 4 },
    'fish_tuna': { name: '🐡 鮪魚', price: 250, type: 'fish', heal: 5 },

    // --- 樵夫木材 ---
    'log_oak': { name: '🌳 橡木原木', price: 40, type: 'fell' },
    'log_birch': { name: '🌲 樺木原木', price: 45, type: 'fell' },
    'log_spruce': { name: '🌴 雲杉原木', price: 50, type: 'fell' },
    'log_redwood': { name: '🌵 紅木原木', price: 60, type: 'fell' },

    // 回血
    'bandage_1': { name: '🩹 簡易繃帶', price: 30, type: 'heal', hpPercent: 0.15 },  // 回復 15%
    'bandage_2': { name: '🩹 厚實繃帶', price: 70, type: 'heal', hpPercent: 0.35 },  // 回復 35%
    'medkit_1': { name: '🚑 急救箱', price: 150, type: 'heal', hpPercent: 0.60 },   // 回復 60%
    'medkit_2': { name: '💉 高級醫療包', price: 300, type: 'heal', hpPercent: 1.00 }, // 回復 100%

    // --- 農場產物 (補上 heal: 1) ---
    'wheat': { name: '🌾 小麥', price: 50, type: 'farm', heal: 1 },
    'potato': { name: '🥔 馬鈴薯', price: 50, type: 'farm', heal: 1 },
    'tomato': { name: '🍅 番茄', price: 55, type: 'farm', heal: 1 },
    'cabbage': { name: '🥬 高麗菜', price: 50, type: 'farm', heal: 1 },
    'corn': { name: '🌽 玉米', price: 60, type: 'farm', heal: 1 },
    'apple': { name: '🍎 蘋果', price: 70, type: 'farm', heal: 1 },

    // --- 畜牧肉類 (補上 heal: 1) ---
    'raw_chicken': { name: '🍗 生雞肉', price: 30, type: 'herd', heal: 1 },
    'raw_pork': { name: '🥓 生豬肉', price: 70, type: 'herd', heal: 1 },
    'raw_beef': { name: '🥩 生牛肉', price: 110, type: 'herd', heal: 1 },
    'raw_mutton': { name: '🍖 生羊肉', price: 180, type: 'herd', heal: 1 },
    'egg' : { name: '🥚 雞蛋', price: 30, type: 'herd', heal: 1 },

    // --- 廚師專業料理 ---
    'tomato_soup': { name: '🥣 暖心番茄濃湯', price: 250, type: 'food', heal: 6 },
    'pork_rice': { name: '🍚 滷肉飯', price: 600, type: 'food', heal: 12 },
    'beef_stew': { name: '🥘 紅酒燉牛肉', price: 1000, type: 'food', heal: 18 },
    'fish_and_chips': { name: '🐟 炸魚薯條', price: 700, type: 'food', heal: 12 },
    'full_breakfast': { name: '🍳 豪華英式早午餐', price: 1500, type: 'food', heal: 20 },
    //RPG武器
    'sword_1' : { name: '🗡️ 木劍', type: 'weapon', attack: 10, level: 1 },
    'sword_2': { name: '⚔️ 橡木長劍', type: 'weapon', attack: 25, level: 5 },
    'sword_3': { name: '🎋 雲杉重劍', type: 'weapon', attack: 55, level: 15 },
    'sword_4': { name: '🔥 紅木聖劍', type: 'weapon', attack: 120, level: 30 },

    'axe_1':   { name: '🪓 木斧', type: 'weapon', attack: 15, level: 1 },
    'axe_2':   { name: '🪓 橡木戰斧', type: 'weapon', attack: 40, level: 8 },
    'axe_3':   { name: '🪓 雲杉巨斧', type: 'weapon', attack: 85, level: 20 },
    'axe_4':   { name: '🩸 紅木狂斧', type: 'weapon', attack: 180, level: 35 },
    
    'bow_1': { name: '🏹 短弓', type: 'weapon', attack: 5, level: 1 },
    'bow_2': { name: '🏹 橡木長弓', type: 'weapon', attack: 15, level: 5 },
    'bow_3': { name: '🏹 雲杉強弓', type: 'weapon', attack: 45, level: 15 },
    'bow_4': { name: '🏹 紅木神弓', type: 'weapon', attack: 100, level: 35 },

    //寶箱
    'mystic_chest': { name: '📦 神祕寶箱(可使用!open開啟)', price: 1000, sellPrice: 500, description: '充滿未知的箱子，聽說能開出稀有零件。' },
    'wooden_chest': { name: '📦 木製寶箱', price: 200, sellPrice: 100 },
    'golden_chest': { name: '📦 金製寶箱', price: 5000, sellPrice: 2500 },
    'legendary_chest': { name: '📦 傳說寶箱', price: 10000, sellPrice: 5000 },
    
    //冒險
    'adventure_ticket': { name: '🎟️ 冒險入場券', price: 100, type: 'other' },
    'golden_goose_feather': { name: '🪶 黃金鵝毛', price: 2000, type: 'adv' },
    'upgrade_stone': { name: '💎 強化石', price: 500, type: 'adv' },
     

            // === 系統基礎物品 ===
                'adventure_ticket': { name: '🎫 冒險入場券', type: 'utility', description: '進入冒險地圖的必備憑證。' },
                    'golden_goose_feather': { name: '🪶 黃金鵝毛', type: 'rare', description: '【傳說級】全地圖極低機率掉落的神聖羽毛，散發著不可思議的金光。' },

                        // === 🌲 遺忘荒野：荒野與死亡素材 ===
                            'dried_root': { name: '🌿 乾燥老根', type: 'material', description: '荒野深處挖掘出的老樹根，雖然乾枯但異常堅韌。' },
                                'bone_fragment': { name: '🦴 碎骨片', type: 'material', description: '在荒野中被風化的無名骨頭碎片。' },
                                    'wild_fur': { name: '🧶 粗糙獸皮', type: 'material', description: '荒野野獸身上剝下的皮毛，手感很硬。' },
                                        'cursed_soil': { name: '🌑 咒怨之土', type: 'material', description: '長期吸收死氣而變黑的泥土，摸起來冰冷刺骨。' },
                                            'zombie_brain': { name: '🧠 腐爛腦髓', type: 'material', description: '雖然散發惡臭，但似乎是某種黑魔法的媒介。' },

                                                // === 🦇 陰風洞窟：地底與毒素素材 ===
                                                    'cave_moss': { name: '🧪 洞窟苔蘚', type: 'material', description: '在地底發光的苔蘚，是製作藥水的絕佳材料。' },
                                                        'poison_stinger': { name: '🦂 毒刺', type: 'material', description: '來自洞窟巨大毒蟲的尾刺，尖端還掛著毒液。' },
                                                            'echo_stone': { name: '💎 共鳴石', type: 'material', description: '在完全黑暗中會發出微弱低鳴的奇特石頭。' },
                                                                'bat_wing_membrane': { name: '🦇 蝙蝠翼膜', type: 'material', description: '巨大吸血蝙蝠的翼膜，薄如蟬翼卻非常抗拉。' },
                                                                    'spider_silk_gold': { name: '🕸️ 金色蛛絲', type: 'material', description: '人面蛛吐出的極罕見絲線，閃爍著金屬光澤。' },

                                                                        // === 👺 哥布林營地：部落與工藝素材 ===
                                                                            'goblin_iron': { name: '⛓️ 哥布林黑鐵', type: 'material', description: '哥布林拙劣鍛造的鐵塊，雖然粗糙但純度很高。' },
                                                                                'orc_tusk': { name: '🦷 獸人獠牙', type: 'material', description: '從獸人戰士口中拔下的獠牙，是勇氣的象徵。' },
                                                                                    'tribal_totem': { name: '🗿 部落圖騰', type: 'material', description: '哥布林部落祭祀用的木雕，刻滿了詭異符文。' },
                                                                                        'stolen_pendant': { name: '📿 被掠奪的項鍊', type: 'material', description: '原本屬於人類商隊的精緻飾品。' },
                                                                                            'shaman_beads': { name: '📿 薩滿骨珠', type: 'material', description: '哥布林薩滿配戴的珠子，帶有一點邪惡魔力。' },

                                                                                                // === 🏰 廢棄古城：古代與遺物素材 ===
                                                                                                    'ancient_circuit': { name: '⚙️ 古代零件', type: 'material', description: '失傳的古代技術製作的零件，結構極其複雜。' },
                                                                                                        'hero_ribbon': { name: '🎗️ 英雄殘帶', type: 'material', description: '曾經在此戰死的英雄所留下的破碎絲帶。' },
                                                                                                            'magic_crystal_shard': { name: '🔮 魔晶殘渣', type: 'material', description: '古城魔法核心破碎後留下的發光結晶碎片。' },
                                                                                                                'royal_seal': { name: '📜 皇室殘印', type: 'material', description: '古老王朝印章的殘缺部分，象徵著往日的榮耀。' },
                                                                                                                    'damned_steel': { name: '⚔️ 墮落之鋼', type: 'material', description: '受過神聖祝福卻被詛咒侵蝕變黑的鋼鐵。' }
                                                                                                                    };
    