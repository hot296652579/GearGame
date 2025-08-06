import { _decorator, Skeleton, sp } from 'cc';
import { BaseSoldier } from './SoldierBase';
import { AliensAudioMgr } from '../Manager/AliensAudioMgr';
const { ccclass, property } = _decorator;

@ccclass('SoldierMelee')
export class SoldierMelee extends BaseSoldier {
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

        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('meleeAttack'), 1.0);
        this.isAttacking = true;
        this.playAnimation('attack', false);

        this.skeleton.setCompleteListener(() => {
            if (this.currentAnim === 'attack' && !this.isDead) {
                super.attack();
                this.isAttacking = false;
                this.playAnimation('walk');
            }
        });
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
