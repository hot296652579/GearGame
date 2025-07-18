import { Node, Prefab, _decorator, assetManager, find, instantiate, sys } from 'cc';
import { UserModel } from '../Model/UserModel';
import { SoldierType } from '../Enum/GameEnums';
import { GlobalConfig } from 'db://assets/start/Config/GlobalConfig';
const { ccclass, property } = _decorator;

@ccclass('UserManager')
export class UserManager {
    private static _instance: UserManager | null = null;
    public static get instance(): UserManager {
        if (!this._instance) this._instance = new UserManager();
        return this._instance;
    }

    public userModel: UserModel = null;

    initilizeModel(): void {
        this.userModel = new UserModel();
        this.userModel.initialize();
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

    /**
     * 增加玩家金币
     * @param amount 增加数量
     */
    addGold(amount: number): void {
        if (amount > 0) {
            this.userModel.glod += amount;
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
        return true;
    }
}
