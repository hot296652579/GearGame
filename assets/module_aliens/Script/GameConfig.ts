import { _decorator, Component, Node } from 'cc';
import { GearType, PropType, SoldierType } from './Enum/GameEnums';
const { ccclass, property } = _decorator;

/**城池 士兵基础配置*/
@ccclass('GameConfig')
export class GameConfig {
    // 城池基础配置
    static readonly CastleConfig = {
        baseHp: 100,
        upgradeCost: 200
    };

    // 兵种基础配置
    static readonly SoldierConfig = {
        [SoldierType.Melee]: { // 近战(龙骑士)
            attack: 5,
            hp: 10,
            upgradeCost: 220,
            name: '龙骑士',
            deadGold: 1,
        },
        [SoldierType.Super]: { // 超级兵
            attack: 10,
            hp: 18,
            upgradeCost: 2200,
            name: '超级兵',
            deadGold: 6,
        },
        [SoldierType.Ranged]: { // 远程(弓箭手)
            attack: 8,
            hp: 3,
            upgradeCost: 280,
            name: '弓箭手',
            deadGold: 3,
        }
    };

    //齿轮腿价值
    static readonly GearLegValue = {
        [SoldierType.Melee]: 10, // 近战(龙骑士)
        [SoldierType.Super]: 15, // 超级兵
        [SoldierType.Ranged]: 12, // 远程(弓箭手)
        [PropType.Freeze]:15, // 冻结
        [PropType.Heal]:15, // 治疗
        [PropType.Coin]:15, // 金币
        [GearType.SpeedUp]:10 //1级别
    };

    /**
     * 获取城池配置
     */
    static getCastleConfig() {
        return this.CastleConfig;
    }

    /**
     * 获取兵种配置
     * @param type 兵种类型
     */
    static getSoldierConfig(type: SoldierType) {
        return this.SoldierConfig[type];
    }
}


