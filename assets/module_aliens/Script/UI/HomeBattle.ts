import { _decorator, Component, Node } from 'cc';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

/**主界面战斗*/
@ccclass('HomeBattle')
export class HomeBattle extends Component {

    @property(Node)
    btnStart: Node = null!; //开始按钮

    start() {
        this.btnStart.on(Node.EventType.TOUCH_END, this.onClickStart, this);
    }

    onClickStart() {
        AliensGlobalInstance.instance.gameBattle.active = true;
        GameManager.instance.startGame();
    }
}


