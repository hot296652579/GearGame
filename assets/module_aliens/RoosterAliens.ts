import { _decorator, Component, ERaycast2DType, EventTouch, find, Label, Node, NodeEventType, PhysicsSystem2D, Toggle, ToggleContainer, Tween, tween, v2, v3, Vec2, Vec3 } from 'cc';
import { GameEvent } from './Script/Enum/GameEvent';
import { LevelManager } from './Script/Manager/LevelMgr';
import { GameUtil } from './Script/GameUtil';
import { AliensAudioMgr } from './Script/Manager/AliensAudioMgr';
import { AliensGlobalInstance } from './Script/AliensGlobalInstance';
import { UI_PowerUp, UI_Setting } from '../scripts/UIDef';
import { tgxUIMgr } from '../core_tgx/tgx';
import { EventDispatcher } from '../core_tgx/easy_ui_framework/EventDispatcher';
import { UserManager } from './Script/Manager/UserMgr';
const { ccclass, property } = _decorator;

@ccclass('RoosterAliens')
export class RoosterAliens extends Component {

    @property(ToggleContainer)
    toggleContainer: ToggleContainer = null;

    @property(Node)
    homeArm: Node = null; //主界面兵种UI

    @property(Node)
    homeBattle: Node = null; //主界面战斗UI

    onLoad() {
        AliensAudioMgr.initilize();
        UserManager.instance.initilizeModel();
        LevelManager.instance.initilizeModel();
        AliensGlobalInstance.instance.initUI();
        this.registerListener();
        this.resetMgr();
        
        // 默认显示战斗UI
        AliensGlobalInstance.instance.homeBattle.active = true;
        AliensGlobalInstance.instance.homeArm.active = false;
        AliensGlobalInstance.instance.gameBattle.active = false;
    }

    onToggleContainerClick (toggle: Toggle) {
        this.homeBattle.active = (toggle.node.name === 'ToggleBattle');
        this.homeArm.active = (toggle.node.name === 'ToggleArm');
    }

    private resetMgr() {
    }

    protected start(): void {

    }

    registerListener() {
        //UI监听
        const btnSet = find('Canvas/TopLeft/BtnSet')!;
        btnSet.on(NodeEventType.TOUCH_END, () => this.onClickSet(), this);
    }

    private onClickSet(): void {
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicIdName(2), 1.0);
        const show = tgxUIMgr.inst.isShowing(UI_Setting);
        if (!show) {
            tgxUIMgr.inst.showUI(UI_Setting);
        }
    }

}




