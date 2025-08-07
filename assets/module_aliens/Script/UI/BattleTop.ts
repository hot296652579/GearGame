import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { LevelManager } from '../Manager/LevelMgr';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { WavesConfig } from '../WavesConfig';
import { GameManager } from '../Manager/GameManager';
import { BottomShop } from './BottomShop';
import { tgxUIMgr } from 'db://assets/core_tgx/tgx';
import { UI_Pause } from 'db://assets/scripts/UIDef';
const { ccclass, property } = _decorator;

@ccclass('BattleTop')
export class BattleTop extends Component {

    @property(Node)
    btPause: Node = null;

    @property(Label)
    lbLegs: Label = null;

    @property(Label)
    lbGold: Label = null;

    @property(ProgressBar)
    pbLevel: ProgressBar = null; //关卡进度条

    @property(Label)
    lbLevelExp: Label = null;  //关卡经验等级

    bottomShop: Node = null;  //齿轮商店

    private _currentExp: number = 0; // 当前经验值
    private _currentLevel: number = 1; // 当前经验等级
    public get currentLevel(): number {
        return this._currentLevel;
    }

    private _expThresholds: number[] = []; // 经验阈值数组

    start() {
        this.refreshExp();

        this.btPause.on(Node.EventType.TOUCH_END, this.onPauseButtonClick, this);
    }

    private onPauseButtonClick() {
        GameManager.instance.pauseGame();
        const result = tgxUIMgr.inst.isShowing(UI_Pause);
        if (!result) {
            tgxUIMgr.inst.showUI(UI_Pause);
        }
    }

    //刷新经验
    public refreshExp() {
        const gameLevel = LevelManager.instance.levelModel.gameLevel;
        this.bottomShop = AliensGlobalInstance.instance.bottomShop;
        this._expThresholds = WavesConfig.instance.getWaveConfig(gameLevel).exp;
        this.updateLegs();
        this.updateExpDisplay();
    }

    // 增加经验
    public addExp(amount: number) {
        this._currentExp += amount;
        // console.log("增加经验值: " + amount);
        // 检查是否升级
        if (this._currentLevel <= this._expThresholds.length &&
            this._currentExp >= this._expThresholds[this._currentLevel - 1]) {
            this.levelUp();
        }

        this.updateExpDisplay();
    }

    // 升级逻辑
    private levelUp() {
        GameManager.instance.pauseGame();
        this.bottomShop.getComponent(BottomShop).riseUp();
        this._currentLevel++;
        this._currentExp = 0;

        this.updateExpDisplay();
    }

    // 更新经验显示
    private updateExpDisplay() {
        this.lbLevelExp.string = `${this._currentLevel}`;

        // 计算进度条百分比
        if (this._currentLevel <= this._expThresholds.length) {
            const threshold = this._expThresholds[this._currentLevel - 1];
            const progress = this._currentExp / threshold;
            this.pbLevel.progress = progress;
        } else {
            this.pbLevel.progress = 1;
        }
    }

    // 更新大腿显示
    public updateLegs() {
        const legs = LevelManager.instance.getLevelBaseLegs();
        this.lbLegs.string = legs.toString();
    }

    //更新金币显示
    public updateGold() {
        const gold = LevelManager.instance.getLevelGold();
        this.lbGold.string = gold.toString();
    }

    // 重置经验
    public resetExp() {
        this._currentExp = 0;
        this._currentLevel = 1;
        this.refreshExp();
    }
}


