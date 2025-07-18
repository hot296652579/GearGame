import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import { NodePoolManager } from '../NodePoolManager';
import { BaseSoldier } from '../Soldier/SoldierBase';
import { Camp } from '../Soldier/ISoldierStats';
const { ccclass, property } = _decorator;

@ccclass('BloodBar')
export class BloodBar extends Component {
    @property(Label)
    public label: Label = null;

    private _duration: number = 0.5; // 动画持续时间

    /**
     * 显示血条
     * @param hp 血量
     * @param parent 被攻击节点
     * @param targetCamp 被攻击阵营
     */    
    showBloodBar(hp: number, parent: Node,targetCamp: Camp) {
        this.label.string = `${hp}`;
        this.node.setParent(parent);
        this.node.setPosition(0, 50, 0);

        const scaleX = targetCamp == Camp.Player? 1 : -1; // 根据阵营调整缩放方向
        this.node.setScale(scaleX, 1, 1); // 调整血条的缩放方向
        // 向上漂浮动画
        tween(this.node)
            .to(this._duration, { position: new Vec3(0, 150, 0) }, { easing: 'sineOut' })
            .call(() => {
                // 动画结束后回收血条
                NodePoolManager.instance.putNode('blood', this.node);
            })
            .start();
    }
}


