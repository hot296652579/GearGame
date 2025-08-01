import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_BattleResult')
export class Layout_BattleResult extends Component {
    @property(Button)
    btGet: Button;

    @property(Label)
    lbGold: Label;

    @property(Button)
    btDouble: Button;

    @property(Node)
    winNode: Node;

    @property(Node)
    loseNode: Node;
}