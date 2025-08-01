import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_Reward')
export class Layout_Reward extends Component {
    @property(Button)
    btGet: Button;

    @property(Label)
    lbGold: Label;

    @property(Button)
    btNo: Button;
}