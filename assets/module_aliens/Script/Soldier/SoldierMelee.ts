import { _decorator } from 'cc';
import { BaseSoldier } from './SoldierBase';
import { AliensAudioMgr } from '../Manager/AliensAudioMgr';
const { ccclass } = _decorator;

@ccclass('SoldierMelee')
export class SoldierMelee extends BaseSoldier {
    protected attack(): void {
        super.attack(); // 调用基类攻击逻辑
        // 可以在这里添加近战特有的攻击效果，如动画等

        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('meleeAttack'), 1.0);
    }
}
