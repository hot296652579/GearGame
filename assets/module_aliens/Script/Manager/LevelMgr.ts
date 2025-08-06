import { Node, _decorator } from 'cc';
import { EventDispatcher } from 'db://assets/core_tgx/easy_ui_framework/EventDispatcher';
import { GameEvent } from '../Enum/GameEvent';
import { LevelConfig } from '../LevelConfig';
import { ILevelConfig, LevelModel } from '../Model/LevelModel';
import { PropSystem } from '../Prop/PropSystem';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager {
    private static _instance: LevelManager | null = null;
    public static get instance(): LevelManager {
        if (!this._instance) this._instance = new LevelManager();
        return this._instance;
    }

    public levelModel: LevelModel = null;
    currentLevel: Node = null!;
    randomLevel: number = 0;
    private _levelLegs: number = 25;//关卡大腿数
    //关卡大腿增加数
    private _levelLegsAdd: number = 10;
    private _levelGetGold: number = 0;

    initilizeModel(): void {
        this.levelModel = new LevelModel();
    }

    /** 清除关卡数据*/
    clearLevelData(): void {
        this._levelGetGold = 0;
        this._levelLegs = 25;
        this._levelLegsAdd = 10;
        this.levelModel.clearLevel();
        PropSystem.instance.clearRecord();
    }

    upgradeLevel(up: number = 1): void {
        this.levelModel.level += up;
        EventDispatcher.instance.emit(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP);
    }

    /**
     * 增加关卡腿数
     * @param amount 增加数量
     */
    addLevelLegs(amount: number): void {
        if (amount > 0) {
            this._levelLegs += amount;
        }
    }

    /**
     * 扣除基础关卡腿数
     * @param amount 扣除数量
     * @returns 是否扣除成功
     */
    deductLevelBaseLegs(amount: number): boolean {
        if (amount <= 0 || this._levelLegs < amount) {
            return false;
        }
        this._levelLegs -= amount;
        return true;
    }

    /**
     * 获取当前基础关卡腿数
     */
    getLevelBaseLegs(): number {
        return this._levelLegs;
    }

    /**
     * 获取当前关卡腿数增加数
     */
    getLevelLegsAdd(): number {
        return this._levelLegsAdd;
    }

    /**
     * 增加关卡金币
     * @param amount 增加数量
     */
    addLevelGold(amount: number): void {
        if (amount > 0) {
            this._levelGetGold += amount;
        }
    }

    /**
     * 扣除关卡金币
     * @param amount 扣除数量
     * @returns 是否扣除成功
     */
    deductLevelGold(amount: number): boolean {
        if (amount <= 0 || this._levelGetGold < amount) {
            return false;
        }
        this._levelGetGold -= amount;
        return true;
    }

    /**
     * 检查是否可以购买齿轮
     * @returns 是否可以购买
     */
    public canAfford(legValue): boolean {
        return LevelManager.instance.getLevelBaseLegs() >= legValue;
    }

    /**
     * 尝试扣除大腿价值
     * @returns 是否扣除成功
     */
    public tryDeductLegs(legValue): boolean {
        if (this.canAfford(legValue)) {
            return LevelManager.instance.deductLevelBaseLegs(legValue);
        }
        return false;
    }

    /**
     * 获取当前关卡金币
     */
    getLevelGold(): number {
        return this._levelGetGold;
    }

    /**
     * 获取当前关卡的配置
    */
    public getCurrentLevelConfig(): ILevelConfig {
        return LevelConfig.instance.getLevelConfig(this.levelModel.level);
    }
}
