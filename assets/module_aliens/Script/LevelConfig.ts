import { _decorator, Component, Node } from 'cc';
import { SoldierType } from './Enum/GameEnums';
const { ccclass, property } = _decorator;

@ccclass('LevelConfig')
export class LevelConfig {
    private static _instance: LevelConfig;
    public static get instance(): LevelConfig {
        if (!this._instance) {
            this._instance = new LevelConfig();
        }
        return this._instance;
    }

    /**
     * 获取关卡配置
     * @param level 关卡等级
     */
    public getLevelConfig(level: number) {
        return this.levelConfig[level] || this.levelConfig[1];
    }

    castleBaseHp = 110;
    enemyCastleBaseHp = 220;

    // 关卡相关配置
    private levelConfig = {
        1:{
            enginePos:[1,2],            //永动机的位置
            reward:{
                gold:1100,              //金币
                loseGold:110,           //失败时获得金币
            }
        }
    }
}


