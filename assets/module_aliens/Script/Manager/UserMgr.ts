import { Node, Prefab, _decorator, assetManager, find, instantiate, sys } from 'cc';
import { UserModel } from '../Model/UserModel';
import { SoldierType } from '../Enum/GameEnums';
import { GlobalConfig } from 'db://assets/start/Config/GlobalConfig';
import { LevelManager } from './LevelMgr';
const { ccclass, property } = _decorator;

@ccclass('UserManager')
export class UserManager {
    private static _instance: UserManager | null = null;
    public static get instance(): UserManager {
        if (!this._instance) this._instance = new UserManager();
        return this._instance;
    }

    public userModel: UserModel = null;

    // 本地存储键名
    private readonly SOLDIER_LEVEL_KEY = 'soldier_levels';
    private readonly CASTLE_LEVEL_KEY = 'castle_level';
    private readonly LEVEL_GAME_KEY = 'level_game';


    // 金币存储键名
    private readonly GOLD_KEY = 'user_gold';

    initilizeModel(): void {
        this.userModel = new UserModel();

        if (!GlobalConfig.isDebug) {
            this.loadFromLocalStorage();
        }
    }

    private loadFromLocalStorage(): void {
        // 加载金币
        const gold = sys.localStorage.getItem(this.GOLD_KEY);
        if (gold) {
            const goldAmount = parseInt(gold);
            if (!isNaN(goldAmount)) {
                this.userModel.glod = goldAmount;
            }
        } else {
            this.userModel.glod = 500;
        }

        // 加载兵种等级
        const soldierLevels = this.getSoldierLevelsFromStorage();
        if (soldierLevels) {
            // 遍历所有兵种类型
            [SoldierType.Melee, SoldierType.Ranged, SoldierType.Super].forEach(type => {
                if (soldierLevels[type] !== undefined) {
                    this.userModel.setSoldierLevel(type, soldierLevels[type]);
                } else {
                    // 如果本地存储中没有该兵种记录，使用默认等级1
                    this.userModel.setSoldierLevel(type, 1);
                }
            });
        }

        // 加载城池等级
        const castleLevel = sys.localStorage.getItem(this.CASTLE_LEVEL_KEY);
        if (castleLevel) {
            const level = parseInt(castleLevel);
            if (!isNaN(level)) {
                this.userModel.setCastleLevel(level);
            }
        }
    }

    // 保存城池等级到本地存储
    saveCastleLevel(level: number): void {
        if (GlobalConfig.isDebug) return;
        sys.localStorage.setItem(this.CASTLE_LEVEL_KEY, level.toString());
    }

    //保存关卡等级到本地存储
    saveLevel(level: number): void {
        if (GlobalConfig.isDebug) return;
        sys.localStorage.setItem(this.LEVEL_GAME_KEY, level.toString());
    }

    //获取当前关卡
    getCurrentGameLevel(): number {
        const level = sys.localStorage.getItem(this.LEVEL_GAME_KEY);
        if (level) {
            const levelNum = parseInt(level);
            if (!isNaN(levelNum)) {
                return levelNum;
            }
        }
        return 1;
    }

    // 从本地存储获取兵种等级
    private getSoldierLevelsFromStorage(): Record<SoldierType, number> | null {
        const data = sys.localStorage.getItem(this.SOLDIER_LEVEL_KEY);
        return data ? JSON.parse(data) : null;
    }

    // 测试模式下的快捷方法
    debugSetSoldierLevel(type: SoldierType, level: number): void {
        if (GlobalConfig.isDebug) {
            this.userModel.setSoldierLevel(type, level);
        }
    }

    debugSetCastleLevel(level: number): void {
        if (GlobalConfig.isDebug) {
            this.userModel.setCastleLevel(level);
        }
    }

    // 保存兵种等级到本地存储
    saveSoldierLevel(type: SoldierType, level: number): void {
        if (GlobalConfig.isDebug) return;

        const levels = this.getSoldierLevelsFromStorage() || {};
        // 确保保存所有兵种类型
        levels[type] = level;
        sys.localStorage.setItem(this.SOLDIER_LEVEL_KEY, JSON.stringify(levels));
    }

    /**
     * 增加玩家金币
     * @param amount 增加数量
     */
    addGold(amount: number): void {
        if (amount > 0) {
            this.userModel.glod += amount;
            this.saveGoldToStorage();
        }
    }

    /**
     * 扣除玩家金币
     * @param amount 扣除数量
     * @returns 是否扣除成功
     */
    deductGold(amount: number): boolean {
        if (amount <= 0 || this.userModel.glod < amount) {
            return false;
        }
        this.userModel.glod -= amount;
        this.saveGoldToStorage();
        return true;
    }

    // 金币存储方法
    private saveGoldToStorage(): void {
        if (GlobalConfig.isDebug) return;
        sys.localStorage.setItem(this.GOLD_KEY, this.userModel.glod.toString());
    }
}
