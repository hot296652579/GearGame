import { _decorator, Component, Label, Node } from 'cc';
import { UserManager } from '../Manager/UserMgr';
const { ccclass, property } = _decorator;

@ccclass('HomeTop')
export class HomeTop extends Component {

    @property(Label)
    lbGold: Label = null;

    start() {

        this.updateGold();
    }

    //更新金币
    public updateGold() {
        const gold = UserManager.instance.userModel.glod;
        console.log(`玩家剩余金币: ${UserManager.instance.userModel.glod}`)
        this.lbGold.string = gold.toString();
    }
}


