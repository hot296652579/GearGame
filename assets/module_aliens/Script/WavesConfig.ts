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
            level: number;
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
            exp: [6, 11, 18, 25],
            waves: [
                {
                    delay: 5,
                    enemies: [
                        { type: SoldierType.Melee, count: 1, level: 1 },
                        // {type: SoldierType.Ranged, count: 1, level: 1}
                    ]
                },
                {
                    delay: 10,
                    enemies: [
                        { type: SoldierType.Melee, count: 1, level: 1 },
                        // {type: SoldierType.Ranged, count: 1, level: 1}
                    ]
                },
                {
                    delay: 15,
                    enemies: [
                        { type: SoldierType.Melee, count: 1, level: 1 },
                        { type: SoldierType.Super, count: 1, level: 1 },
                        { type: SoldierType.Ranged, count: 1, level: 1 },
                    ]
                }
            ]
        }
    };
}


