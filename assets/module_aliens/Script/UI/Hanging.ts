import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Hanging')
export class Hanging extends Component {

    @property(CCFloat)
    //当前格子的行数
    row: number = 0;
    //当前格子的列数
    @property(CCFloat)
    col: number = 0;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


