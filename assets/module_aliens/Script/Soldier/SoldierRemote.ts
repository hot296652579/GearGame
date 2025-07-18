import { _decorator, Component, Prefab, Vec3 } from 'cc';
import { BaseSoldier } from './SoldierBase';
import { Bullet } from './Bullet';
import { GameManager } from '../Manager/GameManager';
import { NodePoolManager } from '../NodePoolManager';
import { Castle } from '../Castle/Castle';
import { Bow } from './Bow';
const { ccclass, property } = _decorator;

@ccclass('SoldierRemote')
export class SoldierRemote extends BaseSoldier {
    protected attack(): void {
        const target = this.findNearestTarget();
        if (target) {
            // this.shootBullet(target);
            this.shootBow(target);
        }
    }

    private shootBullet(target: BaseSoldier | Castle) {
        // 从对象池获取子弹
        const bulletNode = NodePoolManager.instance.getNode('bullet', this.node);
        bulletNode.setParent(this.node)
        bulletNode.setPosition(Vec3.ZERO);
        
        const bulletScript = bulletNode.getComponent(Bullet);
        bulletScript.init(target, this.stats.attack);
        bulletScript.ownerCamp = this.camp;
    }

    private shootBow(target: BaseSoldier | Castle) {
        // 从对象池获取弓箭
        const bulletNode = NodePoolManager.instance.getNode('bow', this.node);
        bulletNode.setParent(this.node)
        bulletNode.setPosition(Vec3.ZERO);
        
        const bulletScript = bulletNode.getComponent(Bow);
        bulletScript.init(target, this.stats.attack);
        bulletScript.ownerCamp = this.camp;
    }
}
