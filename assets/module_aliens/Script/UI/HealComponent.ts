import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
//加血预设体
@ccclass('HealComponent')
export class HealComponent extends Component {
    start() {
        this.moveUp(); 
    }

    //向上移动动画 完成动画后销毁
    moveUp() {
        tween(this.node)
            .to(1, { position: new Vec3(this.node.position.x, this.node.position.y + 100, this.node.position.z) })
            .call(() => { this.node.destroy(); })
            .start();
    }

    update(deltaTime: number) {
        
    }
}


