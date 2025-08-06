import { _decorator, sp } from 'cc';
import { BaseSoldier } from './SoldierBase';
import { AliensAudioMgr } from '../Manager/AliensAudioMgr';
const { ccclass, property } = _decorator;

/**超级兵*/
@ccclass('SoldierSuper')
export class SoldierSuper extends BaseSoldier {
    @property(sp.Skeleton)
    private skeleton: sp.Skeleton = null!;

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

        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('superAttack'), 1.0);
        this.isAttacking = true;
        this.playAnimation('attack', false);
        console.log('super attack');
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
