import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { GearSystem } from './GearSystem';
const { ccclass, property } = _decorator;

@ccclass('GearEngine')
export class GearEngine extends Component {
    start() {
        this.rotateGear();
    }

    private rotateGear() {
        // 逆时针旋转360度
        tween(this.node)
            .by(.1, { eulerAngles: new Vec3(0, 0, 30) }) // 每次旋转30度
            .call(() => {
                GearSystem.instance.checkGearContact();
                this.rotateGear();
            })
            .start();
    }
}


