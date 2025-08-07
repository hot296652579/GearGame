import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WalledCity')
export class WalledCity extends Component {

    @property(Node)
    city1: Node = null!;

    @property(Node)
    city2: Node = null!;

    protected onEnable(): void {
        
    }

}


