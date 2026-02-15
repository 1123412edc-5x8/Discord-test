// items.js
module.exports = {
    // ==========================================
        // ⚔️ 物理武器 (Melee/Ranged)
            // ==========================================
                "W01": { name: "鏽鐵劍", type: "weapon", subtype: "sword", atk: 10, req: { "goblin_iron": 3 } },
                    "W02": { name: "獵人弓", type: "weapon", subtype: "bow", atk: 12, req: { "dried_root": 10 } },
                        "W03": { name: "伐木斧", type: "weapon", subtype: "axe", atk: 15, req: { "goblin_iron": 2, "dried_root": 5 } },
                            "W04": { name: "精鋼長劍", type: "weapon", subtype: "sword", atk: 28, req: { "iron_ore": 10, "goblin_iron": 5 } },
                                "W05": { name: "刺客短弓", type: "weapon", subtype: "bow", atk: 32, req: { "wild_fur": 15, "sturdy_wood": 5 } },

                                    // ==========================================
                                        // 🔮 魔法媒介 (Magic)
                                            // ==========================================
                                                "M01": { name: "烈焰法杖", type: "weapon", subtype: "fire", atk: 22, req: { "magic_shard": 5 } },
                                                    "M02": { name: "潮汐符文", type: "weapon", subtype: "water", atk: 20, req: { "echo_stone": 5 } },
                                                        "M03": { name: "大地之息", type: "weapon", subtype: "earth", atk: 25, req: { "dried_root": 20 } },
                                                            "M04": { name: "冥府提燈", type: "weapon", subtype: "dark", atk: 45, req: { "magic_shard": 12, "dark_crystal": 3 } },

                                                                // ==========================================
                                                                    // 🛡️ 防具套件 (Armor) - type 設為 armor, subtype 區分部位
                                                                        // ==========================================
                                                                            "A01": { name: "冒險頭盔", type: "armor", subtype: "head", def: 5, req: { "wild_fur": 5 } },
                                                                                "A02": { name: "旅行皮甲", type: "armor", subtype: "body", def: 12, req: { "wild_fur": 10, "leather": 2 } },
                                                                                    "A03": { name: "輕便長褲", type: "armor", subtype: "pants", def: 8, req: { "wild_fur": 8 } },
                                                                                        "A04": { name: "獸皮靴", type: "armor", subtype: "boots", def: 4, req: { "wild_fur": 5 } },
                                                                                            "A05": { name: "鋼鐵胸甲", type: "armor", subtype: "body", def: 28, req: { "iron_ore": 15, "goblin_iron": 8 } },

                                                                                                // ==========================================
                                                                                                    // 📿 飾品配件 (Accessory)
                                                                                                        // ==========================================
                                                                                                            "J01": { name: "靈魂耳環", type: "accessory", subtype: "earring", atk: 3, def: 3, req: { "echo_stone": 5 } },
                                                                                                                "J02": { name: "鋼鐵戒指", type: "accessory", subtype: "ring", atk: 5, def: 2, req: { "goblin_iron": 10 } },
                                                                                                                    "J03": { name: "勇者徽章", type: "accessory", subtype: "pendant", atk: 12, def: 12, req: { "goblin_medal": 3, "hero_soul": 1 } },

                                                                                                                        // ==========================================
                                                                                                                            // 📦 素材定義 (不具備合成表，用於查詢)
                                                                                                                                // ==========================================
                                                                                                                                    "materials": {
                                                                                                                                            "dried_root": { name: "🌿 乾燥樹根" },
                                                                                                                                                    "wild_fur": { name: "🦊 野生毛皮" },
                                                                                                                                                            "goblin_iron": { name: "👺 哥布林鐵" },
                                                                                                                                                                    "echo_stone": { name: "🐚 回聲石" },
                                                                                                                                                                            "iron_ore": { name: "⛓️ 鐵礦石" },
                                                                                                                                                                                    "magic_shard": { name: "💎 魔力碎片" },
                                                                                                                                                                                            "dark_crystal": { name: "🌑 暗影水晶" },
                                                                                                                                                                                                    "sturdy_wood": { name: "🪵 堅韌木材" },
                                                                                                                                                                                                            "leather": { name: "🧵 皮革" },
                                                                                                                                                                                                                    "goblin_medal": { name: "🏅 哥布林勳章" },
                                                                                                                                                                                                                            "hero_soul": { name: "👻 英雄殘魂" }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                };