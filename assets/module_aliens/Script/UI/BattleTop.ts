import { _decorator, Component, Label, Node } from 'cc';
import { UserManager } from '../Manager/UserMgr';
import { LevelManager } from '../Manager/LevelMgr';
const { ccclass, property } = _decorator;

@ccclass('BattleTop')
export class BattleTop extends Component {

    @property(Label)
    lbLegs: Label = null;

    start() {
        this.updateLegs();
    }

    //更新大腿
    public updateLegs() {
        const gold = LevelManager.instance.getLevelBaseLegs();
        this.lbLegs.string = gold.toString();
    }
}


