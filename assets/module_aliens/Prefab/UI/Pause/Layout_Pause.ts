import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Layout_Pause')
export class Layout_Pause extends Component {
    @property(Button)
    btExit: Button;

    @property(Button)
    btContinue: Button;
}