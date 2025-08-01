import { GameConfig } from "../GameConfig";
import { LevelConfig } from "../LevelConfig";
import { LevelManager } from "../Manager/LevelMgr";
import { UserManager } from "../Manager/UserMgr";
import { Camp } from "../Soldier/ISoldierStats";
import { Castle } from "./Castle";

export class CastleManager {
    private static _instance: CastleManager;
    public static get instance(): CastleManager {
        if (!this._instance) {
            this._instance = new CastleManager();
        }
        return this._instance;
    }

    private castles: Map<Camp, Castle> = new Map();

    registerCastle(camp: Camp, castle: Castle) {
        if (this.castles.has(camp)) {
            console.warn(`阵营 ${Camp[camp]} 的城池已存在，禁止重复注册`);
            return;
        }
        this.castles.set(camp, castle);
    }

    /** 设置关卡城池血量*/
    public setLevelCastleHp() {
        //玩家城池等级
        const castleLevel = UserManager.instance.userModel.getCastleLevel();
        const castleStats = CastleManager.instance.getLevelCastleHpUpCost(castleLevel);

        const lvLevel = LevelManager.instance.levelModel.level;
        const enemyCastleBaseHp = LevelConfig.instance.enemyCastleBaseHp;
        const enemyCastleHp = Math.floor(enemyCastleBaseHp * Math.pow(1.1, lvLevel));
        
        // 设置玩家城池血量
        const playerCastle = this.getCastle(Camp.Player);
        if (playerCastle) {
            playerCastle.setCastleHp(castleStats.castleHp);
        }
        
        // 设置敌方城池血量
        const enemyCastle = this.getCastle(Camp.Enemy);
        if (enemyCastle) {
            enemyCastle.setCastleHp(enemyCastleHp);
        }
    }

    /**计算当前等级 城池血量 升级消耗
     * @param level 玩家城池当前等级
    */
    public getLevelCastleHpUpCost(level: number) {
        const baseConfig = GameConfig.getCastleConfig();
        
        // 计算当前血量: 基础血量 * 1.1^(等级-1)
        const castleHp = Math.round(baseConfig.baseHp * Math.pow(1.4, level - 1));

        //计算下一等级血量: 基础血量 * 1.1^(等级)
        const nextLevelHp = Math.round(baseConfig.baseHp * Math.pow(1.4, level));
        
        // 计算升级消耗: 基础消耗 * 1.2^(等级-1)
        const upgradeCost = Math.round(baseConfig.upgradeCost * Math.pow(1.2, level - 1));
        
        return {
            castleLevel: level,
            castleHp,
            nextLevelHp,
            upgradeCost,
        };
    }

    public unregisterCastle(camp: Camp) {
        this.castles.delete(camp);
    }

    public getEnemyCastle(myCamp: Camp): Castle | null {
        for (const [camp, castle] of this.castles) {
            if (camp !== myCamp) return castle;
        }
        return null;
    }

    public getCastle(camp: Camp): Castle | null {
        return this.castles.get(camp) || null;
    }
}
