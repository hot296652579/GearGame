import { _decorator, Component, find, Label, Node, NodeEventType } from 'cc';
import { UserManager } from '../Manager/UserMgr';
import { AliensAudioMgr } from '../Manager/AliensAudioMgr';
import { tgxUIMgr } from 'db://assets/core_tgx/tgx';
import { UI_Reward, UI_Setting } from 'db://assets/scripts/UIDef';
const { ccclass, property } = _decorator;

@ccclass('HomeTop')
export class HomeTop extends Component {

    @property(Label)
    lbGold: Label = null;

    protected start(): void {
        this.registerListener();
    }

    onEnable() {
        this.updateGold();
    }

    registerListener() {
        //UI监听
        const btnSet = find('Canvas/TopLeft/BtnSet')!;
        const btnUserGold = find('Canvas/TopLeft/UserGold')!;
        const btnAdd = find('Canvas/TopLeft/UserGold/BtAdd')!;
        btnSet.on(NodeEventType.TOUCH_END, () => this.onClickSet(), this);
        btnUserGold.on(NodeEventType.TOUCH_END, () => this.onClickUserGold(), this);
        btnAdd.on(NodeEventType.TOUCH_END, () => this.onClickUserGold(), this);
    }

    private onClickSet(): void {
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('dianji'), 1.0);
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('dianji'), 1.0);
        const show = tgxUIMgr.inst.isShowing(UI_Setting);
        if (!show) {
            tgxUIMgr.inst.showUI(UI_Setting);
        }
    }

    private onClickUserGold(): void {
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('dianji'), 1.0);
        const show = tgxUIMgr.inst.isShowing(UI_Reward);
        if (!show) {
            tgxUIMgr.inst.showUI(UI_Reward);
        }
    }

    //更新金币
    public updateGold() {
        const gold = UserManager.instance.userModel.glod;
        console.log(`玩家剩余金币: ${UserManager.instance.userModel.glod}`)
        this.lbGold.string = gold.toString();
    }
}


