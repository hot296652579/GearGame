import { _decorator, Component, Prefab, sp, Vec3 } from 'cc';
import { BaseSoldier } from './SoldierBase';
import { Bullet } from './Bullet';
import { GameManager } from '../Manager/GameManager';
import { NodePoolManager } from '../NodePoolManager';
import { Castle } from '../Castle/Castle';
import { Bow } from './Bow';
import { AliensAudioMgr } from '../Manager/AliensAudioMgr';
const { ccclass, property } = _decorator;

@ccclass('SoldierRemote')
export class SoldierRemote extends BaseSoldier {
    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null!;

    protected getSkeleton(): sp.Skeleton {
        return this.skeleton;
    }

    protected move(): void {
        if (this.isDead || this.isAttacking) return;
        super.move();
        this.playAnimation('walk');
    }

    protected attack(): void {
        if (this.isDead || this.isAttacking) return;
        
        const target = this.findNearestTarget();
        if (target) {
            this.isAttacking = true;
            this.playAnimation('attack', false);
            this.shootBow(target);
            
            this.skeleton.setCompleteListener(() => {
                if (this.currentAnim === 'attack' && !this.isDead) {
                    super.attack();
                    this.isAttacking = false;
                    this.playAnimation('walk');
                }
            });
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
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('bullet'), 1.0);
        // 从对象池获取弓箭
        const bulletNode = NodePoolManager.instance.getNode('bow', this.node);
        bulletNode.setParent(this.node)
        bulletNode.setPosition(Vec3.ZERO);
        
        const bulletScript = bulletNode.getComponent(Bow);
        bulletScript.init(target, this.stats.attack);
        bulletScript.ownerCamp = this.camp;
    }

    protected die(): void {
        if (this.isDead) return;
        
        this.playAnimation('dead', false);
        this.skeleton.setCompleteListener(() => {
            super.die();
            this.node.destroy();
        });
    }
}
