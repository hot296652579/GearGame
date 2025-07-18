import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_BattleResult')
export class Layout_BattleResult extends Component {
    @property(Button)
    btNext: Button;

    @property(Button)
    btRestart: Button;

    @property(Node)
    winNode: Node;

    @property(Node)
    loseNode: Node;

    @property(Label)
    lbRemain: Label;

    @property(Label)
    lbTime: Label;

    @property(Label)
    lbHeadShot: Label;

    @property(Label)
    lbHitRate: Label;
}