import { _decorator, Component, Node } from 'cc';
import { SoldierType } from './Enum/GameEnums';
const { ccclass, property } = _decorator;

// 波次配置接口
export interface IWaveConfig {
    exp: number[];  //每波次的经验值  
    waves: {
        delay: number;
        enemies: {
            type: SoldierType;
            count: number;
        }[];
    }[];
}

@ccclass('WavesConfig')
export class WavesConfig {
    private static _instance: WavesConfig;
    public static get instance(): WavesConfig {
        if (!this._instance) {
            this._instance = new WavesConfig();
        }
        return this._instance;
    }

    /**
     * 获取关卡波次配置
     * @param level 关卡等级
     */
    public getWaveConfig(level: number): IWaveConfig {
        return this._waveConfigs[level] || this._waveConfigs[1];
    }

    // 关卡波次配置
    private _waveConfigs: Record<number, IWaveConfig> = {
        1: {
            exp: [5, 10, 13],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 1 }] },
                { delay: 10, enemies: [{ type: SoldierType.Melee, count: 1 }] },
                { delay: 15, enemies: [{ type: SoldierType.Melee, count: 1 }] }
            ]
        },
        2: {
            exp: [5, 10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 2 }] },
                { delay: 10, enemies: [{ type: SoldierType.Melee, count: 2 }] },
                { delay: 15, enemies: [{ type: SoldierType.Ranged, count: 1 }] },
            ]
        },
        3: {
            exp: [5, 10, 13, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 2 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 2 }] },
                { delay: 15, enemies: [{ type: SoldierType.Melee, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 1 }, { type: SoldierType.Melee, count: 1 }] }
            ]
        },
        4: {
            exp: [5, 10, 13, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 2 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 2 }] },
                { delay: 15, enemies: [{ type: SoldierType.Melee, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 1 }, { type: SoldierType.Melee, count: 1 }] }
            ]
        },
        5: {
            exp: [5, 10, 13, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 1 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 2 }] },
                { delay: 25, enemies: [{ type: SoldierType.Ranged, count: 1 }, { type: SoldierType.Melee, count: 2 }] }
            ]
        },
        6: {
            exp: [5, 10, 13, 16, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 1 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 2 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 1 }, { type: SoldierType.Ranged, count: 1 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] }
            ]
        },
        7: {
            exp: [5, 10, 13, 16, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 1 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 2 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 1 }, { type: SoldierType.Ranged, count: 1 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] }
            ]
        },
        8: {
            exp: [5, 10, 13, 16, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 2 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 2 }, { type: SoldierType.Ranged, count: 2 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] }
            ]
        },
        9: {
            exp: [5, 10, 13, 16, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 2 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 2 }, { type: SoldierType.Ranged, count: 2 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] }
            ]
        },
        10: {
            exp: [5, 10, 13, 16, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 2 }, { type: SoldierType.Ranged, count: 3 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] }
            ]
        },
        11: {
            exp: [5, 10, 13, 16, 20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 2 }, { type: SoldierType.Ranged, count: 3 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 1 }] },
                { delay: 35, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 1 }] }
            ]
        },
        12: {
            exp: [5, 10, 13, 16, 20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 2 }, { type: SoldierType.Ranged, count: 3 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 1 }] },
                { delay: 35, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 1 }] }
            ]
        },
        13: {
            exp: [5, 10, 13, 16, 20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 2 }, { type: SoldierType.Ranged, count: 3 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 1 }] },
                { delay: 35, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 1 }] }
            ]
        },
        14: {
            exp: [5, 10, 13, 16, 20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 3 }, { type: SoldierType.Ranged, count: 3 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 1 }] },
                { delay: 35, enemies: [{ type: SoldierType.Ranged, count: 3 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 1 }] }
            ]
        },
        15: {
            exp: [5, 10, 13, 16, 20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            waves: [
                { delay: 5, enemies: [{ type: SoldierType.Melee, count: 3 }] },
                { delay: 10, enemies: [{ type: SoldierType.Ranged, count: 3 }] },
                { delay: 15, enemies: [{ type: SoldierType.Super, count: 2 }] },
                { delay: 20, enemies: [{ type: SoldierType.Ranged, count: 2 }, { type: SoldierType.Melee, count: 3 }] },
                { delay: 25, enemies: [{ type: SoldierType.Super, count: 2 }, { type: SoldierType.Ranged, count: 3 }] },
                { delay: 30, enemies: [{ type: SoldierType.Ranged, count: 3 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 2 }] },
                { delay: 35, enemies: [{ type: SoldierType.Ranged, count: 3 }, { type: SoldierType.Melee, count: 3 }, { type: SoldierType.Super, count: 2 }] }
            ]
        }
    };
}


