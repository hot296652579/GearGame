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
     * 获取关卡波次配置
     * @param level 关卡等级
     */
    public getLevelConfig(level: number) {
        return this.levelConfig[level] || this.levelConfig[1];
    }

    // 关卡波次配置
    private levelConfig = {
        1:{
            playerCastle: 110,
            enemyCastle: 120,
        },
        2:{
            playerCastle: 150,
            enemyCastle: 150,
        },
    }
}


