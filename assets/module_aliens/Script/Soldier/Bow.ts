import { _decorator, Component, Node, Vec3, Tween, tween } from 'cc';
import { BaseSoldier } from './SoldierBase';
import { Camp } from './ISoldierStats';
import { NodePoolManager } from '../NodePoolManager';
import { BloodBar } from '../UI/BloodBar';
import { Castle } from '../Castle/Castle';
const { ccclass, property } = _decorator;

/**弓箭*/
@ccclass('Bow')
export class Bow extends Component {

    private target: Node = null;
    private damage: number = 0;
    private speed: number = 200; // 每秒像素速度
    private targetSoldier: BaseSoldier | Castle = null;
    ownerCamp: Camp = Camp.Enemy; // 子弹所属阵营

    private startPos: Vec3 = new Vec3();
        private controlPoint: Vec3 = new Vec3();
        private totalDistance: number = 0;
        private elapsedTime: number = 0;
        private duration: number = 0;
    
        public init(target: BaseSoldier | Castle, damage: number) {
            this.target = target.node;
            this.targetSoldier = target;
            this.damage = damage;
            
            // 初始化贝塞尔曲线参数
            this.startPos = this.node.worldPosition.clone();
            this.totalDistance = Vec3.distance(this.startPos, this.target.worldPosition);
            this.duration = this.totalDistance / this.speed;
            
            // 计算控制点（在起点和终点之间上方）
            Vec3.lerp(this.controlPoint, this.startPos, this.target.worldPosition, 0.5);
            this.controlPoint.y += 100; // 控制点高度
        }
    
        update(deltaTime: number) {
            if (!this.target || !this.target.isValid) {
                this.node.destroy();
                return;
            }
    
            this.elapsedTime += deltaTime;
            const t = Math.min(this.elapsedTime / this.duration, 1);
    
            // 二次贝塞尔曲线计算
            const pos = new Vec3();
            Vec3.lerp(pos, this.startPos, this.controlPoint, t);
            const temp = new Vec3();
            Vec3.lerp(temp, this.controlPoint, this.target.worldPosition, t);
            Vec3.lerp(pos, pos, temp, t);
    
            // 平滑角度过渡
            const targetAngle = t < 0.5 ? 45 : -45; // 目标角度
            const currentAngle = this.node.eulerAngles.z;
            const smoothAngle = currentAngle + (targetAngle - currentAngle) * 0.1; // 平滑过渡系数
            this.node.eulerAngles = new Vec3(0, 0, smoothAngle);
    
            this.node.setWorldPosition(pos);
    
            if (t >= 1) {
                this.hitTarget();
            }
        }

    private hitTarget() {
        if (this.targetSoldier && this.targetSoldier.isValid) {
            if (this.targetSoldier.camp !== this.ownerCamp) {
                this.targetSoldier.takeDamage(this.damage);
                
                // 显示血条
                const bloodBar = NodePoolManager.instance.getNode('blood', this.targetSoldier.node);
                if (bloodBar) {
                    const bloodScript = bloodBar.getComponent(BloodBar);
                    if (bloodScript && bloodScript.showBloodBar) {
                        bloodScript.showBloodBar(this.damage,this.target,this.targetSoldier.camp);
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
