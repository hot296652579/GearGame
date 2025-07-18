import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";
import { Tablelevels_config } from "../../../module_basic/table/Tablelevels_config";
import { GlobalConfig } from "../../../start/Config/GlobalConfig";
import { sys } from "cc";
import { AliensGlobalInstance } from "../AliensGlobalInstance";
import { GameUtil } from "../GameUtil";
import { SoldierType } from "../Enum/GameEnums";
import { WavesConfig } from "../WavesConfig";
import { LevelConfig } from "../LevelConfig";

// 波次配置接口
export interface IWaveConfig {
    waves: {
        delay: number;
        enemies: {
            type: SoldierType;
            count: number;
            level: number;
        }[];
    }[];
}

export class LevelModel {
    public levelConfig: Tablelevels_config;

    /**关卡奖励*/
    public levelReward: number = 0;

    /** 当前关卡等级*/
    public level: number = 1;
    /** 保存可随机的关卡*/
    public randomLevelList: number[] = [];
    /** 输赢*/
    public isWin: boolean = false;
    /** 是否结束*/
    public isEnd: boolean = false;

    constructor() {
        this.levelConfig = new Tablelevels_config();
        this.getRandomLevelList();
    }

    /** 可随机的关卡合集*/
    getRandomLevelList() {
        const table = JsonUtil.get(Tablelevels_config.TableName);
        if (!table) {
            console.warn('Get level table is fail!');
        }
        this.randomLevelList = Object.values(table).filter(item => item['random'] == 1)
            .map(item => item['level']);

        console.log('随机关卡列表:', this.randomLevelList);
    }

    /** 清除关卡数据*/
    clearLevel() {
        this.isWin = false;
        this.isEnd = false;
    }
    
    /**
     * 获取当前关卡的波次配置
     */
    public getCurrentWaveConfig(): IWaveConfig {
        return WavesConfig.instance.getWaveConfig(this.level);
    }

    /**
     * 获取当前关卡的城池血量配置
    */
    public getCurrentCastleHpConfig(): {playerCastle: number, enemyCastle: number} {
        return LevelConfig.instance.getLevelConfig(this.level);
    }
}