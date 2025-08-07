import { isValid, Label, tween, v3, Vec3, Node, Tween, Game } from "cc";
import { tgxModuleContext, tgxUIMgr } from "../../../../core_tgx/tgx";
import { GameUILayers } from "../../../../scripts/GameUILayers";
import { UI_BattleResult, UI_PowerUp } from "../../../../scripts/UIDef";
import { Layout_BattleResult } from "./Layout_BattleResult";
import { GameEvent } from "../../../Script/Enum/GameEvent";
import { LevelManager } from "../../../Script/Manager/LevelMgr";
import { AliensAudioMgr } from "../../../Script/Manager/AliensAudioMgr";
import { UserManager } from "../../../Script/Manager/UserMgr";
import { TimerMgr } from "../../../Script/Manager/TimerMgr";
import { EventDispatcher } from "db://assets/core_tgx/easy_ui_framework/EventDispatcher";
import { AliensGlobalInstance } from "../../../Script/AliensGlobalInstance";
import { GameUtil } from "../../../Script/GameUtil";
import { GameManager } from "../../../Script/Manager/GameManager";
import { LevelConfig } from "../../../Script/LevelConfig";
import { HomeTop } from "../../../Script/UI/HomeTop";
import { HomeArm } from "../../../Script/UI/HomeArm";

export class UI_BattleResult_Impl extends UI_BattleResult {
    rewardBase: number = 0; //基础奖励
    loseGold: number = 0; //失败时获得的金币
    win: boolean = true;

    constructor() {
        super('Prefab/UI/Result/UI_BattleResult', GameUILayers.POPUP, Layout_BattleResult);
    }

    public getRes(): [] {
        return [];
    }

    protected onCreated(): void {
        this.win = LevelManager.instance.levelModel.isWin;
        const sound = this.win ? 'shengli' : 'fail';
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName(sound), 1.0);

        let layout = this.layout as Layout_BattleResult;
        this.onButtonEvent(layout.btGet, () => {
            this.onClickReward(1);
        });
        this.onButtonEvent(layout.btDouble, () => {
            this.onClickReward(2);
        });

        layout.winNode.active = this.win;
        layout.loseNode.active = !this.win;

        this.updateRewardBase();
        if (this.win) {
            LevelManager.instance.upgradeLevel();
        }
    }

    private updateRewardBase(): void {
        const { reward } = LevelManager.instance.getCurrentLevelConfig();
        let layout = this.layout as Layout_BattleResult;

        this.rewardBase = reward.gold;
        this.loseGold = reward.loseGold;
        this.rewardBase = this.win ? this.rewardBase : this.loseGold;
        layout.lbGold.string = `x${this.rewardBase}`;
    }

    onClickReward(rate: number = 1): void {
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('dianji'), 1.0);
        this.rewardBase = rate == 1 ? this.rewardBase : this.rewardBase * 2;
        UserManager.instance.addGold(this.rewardBase);
        GameManager.instance.exitGame();

        this.destoryMyself();
    }

    private destoryMyself(): void {
        Tween.stopAllByTarget(this.node)
        if (isValid(this.node)) {
            this.node.removeFromParent();
            this.hide();
        }
    }
}

tgxModuleContext.attachImplClass(UI_BattleResult, UI_BattleResult_Impl);