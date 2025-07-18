import { Node, Prefab, _decorator, assetManager, find, instantiate, sys } from 'cc';
import { resLoader } from 'db://assets/core_tgx/base/ResLoader';
import { EventDispatcher } from 'db://assets/core_tgx/easy_ui_framework/EventDispatcher';
import { GlobalConfig } from '../../../start/Config/GlobalConfig';
import { GameEvent } from '../Enum/GameEvent';
import { LevelModel } from '../Model/LevelModel';
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
    private _levelBaseLegs: number = 25;//关卡初始基础腿数
    private _levelGetGold: number = 0;

    initilizeModel(): void {
        this.levelModel = new LevelModel();
        this.registerEvent();
    }

    private registerEvent(): void {

    }

    /** 清除关卡数据*/
    clearLevelData(): void {
        this._levelGetGold = 0;
        this._levelBaseLegs = 25;
        this.levelModel.clearLevel();
    }

    upgradeLevel(up: number = 1): void {
        this.levelModel.level += up;
        EventDispatcher.instance.emit(GameEvent.EVENT_BATTLE_SUCCESS_LEVEL_UP);
    }

    /**
     * 增加基础关卡腿数
     * @param amount 增加数量
     */
    addLevelBaseLegs(amount: number): void {
        if (amount > 0) {
            this._levelBaseLegs += amount;
        }
    }

    /**
     * 扣除基础关卡腿数
     * @param amount 扣除数量
     * @returns 是否扣除成功
     */
    deductLevelBaseLegs(amount: number): boolean {
        if (amount <= 0 || this._levelBaseLegs < amount) {
            return false;
        }
        this._levelBaseLegs -= amount;
        return true;
    }

    /**
     * 获取当前基础关卡腿数
     */
    getLevelBaseLegs(): number {
        return this._levelBaseLegs;
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
     * 获取当前关卡金币
     */
    getLevelGold(): number {
        return this._levelGetGold;
    }
}
