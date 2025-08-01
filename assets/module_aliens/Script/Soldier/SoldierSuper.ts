import { _decorator } from 'cc';
import { BaseSoldier } from './SoldierBase';
import { AliensAudioMgr } from '../Manager/AliensAudioMgr';
const { ccclass } = _decorator;

/**超级兵*/
@ccclass('SoldierSuper')
export class SoldierSuper extends BaseSoldier {
    protected attack(): void {
        super.attack(); // 调用父类的攻击方法，实现基本攻击逻辑。

        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('superAttack'), 1.0);
    }
}
