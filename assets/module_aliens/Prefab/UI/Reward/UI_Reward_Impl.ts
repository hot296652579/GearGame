import { isValid, Label, tween, v3, Vec3, Node, Tween, Game } from "cc";
import { tgxModuleContext, tgxUIMgr } from "../../../../core_tgx/tgx";
import { GameUILayers } from "../../../../scripts/GameUILayers";
import { UI_Reward, UI_PowerUp } from "../../../../scripts/UIDef";
import { Layout_Reward } from "./Layout_Reward";
import { LevelManager } from "../../../Script/Manager/LevelMgr";
import { AliensAudioMgr } from "../../../Script/Manager/AliensAudioMgr";
import { UserManager } from "../../../Script/Manager/UserMgr";
import { AliensGlobalInstance } from "../../../Script/AliensGlobalInstance";
import { HomeTop } from "../../../Script/UI/HomeTop";
import { HomeArm } from "../../../Script/UI/HomeArm";

export class UI_Reward_Impl extends UI_Reward {
    rewardBase: number = 0; //基础奖励
    win: boolean = true;

    constructor() {
        super('Prefab/UI/Reward/UI_Reward', GameUILayers.POPUP, Layout_Reward);
    }

    public getRes(): [] {
        return [];
    }

    protected onCreated(): void {
        let layout = this.layout as Layout_Reward;
        this.onButtonEvent(layout.btGet, () => {
            this.onClickReward();
        });
        this.onButtonEvent(layout.btNo, () => {
            this.destoryMyself();
        })

        this.updateRewardBase();
    }

    private updateRewardBase(): void {
        const base = 2000;
        const {level} = LevelManager.instance.levelModel;
        this.rewardBase = Math.floor(base * Math.pow(1.1, level - 1));
        // console.log(`level:${level}, rewardBase:${this.rewardBase}`);
        this.layout.lbGold.string = `${this.rewardBase}`;
    }

    onClickReward(): void {
        const homeTop = AliensGlobalInstance.instance.homeTop;
        const homeArm = AliensGlobalInstance.instance.homeArm;  
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('dianji'), 1.0);
        UserManager.instance.addGold(this.rewardBase);
        homeTop.getComponent(HomeTop).updateGold();
        homeArm.getComponent(HomeArm).showArmUI();
        homeArm.getComponent(HomeArm).showCastleUI();
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

tgxModuleContext.attachImplClass(UI_Reward, UI_Reward_Impl);