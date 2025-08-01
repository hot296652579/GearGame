import { _decorator, Component, Node, Vec3, Tween, tween } from 'cc';
import { BaseSoldier } from './SoldierBase';
import { Camp } from './ISoldierStats';
import { NodePoolManager } from '../NodePoolManager';
import { BloodBar } from '../UI/BloodBar';
import { Castle } from '../Castle/Castle';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    private target: Node = null;
    private damage: number = 0;
    private speed: number = 200; // 每秒像素速度
    private targetSoldier: BaseSoldier | Castle = null;
    ownerCamp: Camp = Camp.Enemy; // 子弹所属阵营

    public init(target: BaseSoldier | Castle, damage: number) {
        this.target = target.node;
        this.targetSoldier = target;
        this.damage = damage;
    }

    update(deltaTime: number) {
        if (!this.target || !this.target.isValid) {
            this.node.destroy();
            return;
        }

        const dir = new Vec3();
        Vec3.subtract(dir, this.target.worldPosition, this.node.worldPosition);
        const distance = dir.length();

        if (distance < 1) {
            this.hitTarget();
            return;
        }

        dir.normalize();
        const move = Vec3.multiplyScalar(new Vec3(), dir, this.speed * deltaTime);
        this.node.setWorldPosition(this.node.worldPosition.add(move));
    }

    private hitTarget() {
        if (this.targetSoldier && this.targetSoldier.isValid) {
            if (this.targetSoldier.camp !== this.ownerCamp) {
                this.targetSoldier.takeDamage(this.damage);
                
                // 显示血条
                const bloodBar = NodePoolManager.instance.getNode('blood', this.targetSoldier.node);
                if (bloodBar) {
                    const bloodScript = bloodBar.getComponent(BloodBar);

                    if (bloodScript) {
                        const targetSoldier = this.targetSoldier.getComponent(BaseSoldier)!;
                        bloodScript.showBloodProgress(targetSoldier.stats.hp, targetSoldier.stats.maxHp);
                    }
                }
            }
        }
        this.playHitEffect();
        this.node.destroy();
    }
    

    private playHitEffect() {
        // 加粒子或特效逻辑
        // console.log('Hit effect triggered');
    }
}
