import { _decorator, Color, Component, Label, Node } from 'cc';
import { SoldierType } from '../Enum/GameEnums';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { UserManager } from '../Manager/UserMgr';
import { SoldierSystem } from '../Soldier/SoldierSystem';
import { HomeArm } from './HomeArm';
import { HomeTop } from './HomeTop';
const { ccclass, property } = _decorator;

/** 兵种属性Item*/
@ccclass('ArmItem')
export class ArmItem extends Component {

    //兵种类型
    armType: SoldierType = SoldierType.Melee;

    //兵种名称
    @property(Label)
    armName: Label = null;
    //兵种攻击力
    @property(Label)
    armAtk: Label = null;
    //攻击力增长值
    @property(Label)
    armAtkUp: Label = null;

    //兵种血量
    @property(Label)
    armCurHp: Label = null;
    //血量增长值
    @property(Label)
    armHpUp: Label = null;

    //兵种升级按钮
    @property(Node)
    armUpgradeBtn: Node = null;
    //兵种升级价格
    @property(Label)
    armUpgradePrice: Label = null;

    //主界面兵种UI
    homeArm: Node = null;
    //主界面顶部
    homeTop: Node = null;
    
    start() {
        this.homeArm  = AliensGlobalInstance.instance.homeArm;
        this.homeTop = AliensGlobalInstance.instance.homeTop;
        this.armUpgradeBtn.on(Node.EventType.TOUCH_END, this.onUpgradeClick, this);
    }

    private onUpgradeClick() {
        // 获取当前兵种升级所需金额
        const currentLevel = UserManager.instance.userModel.getSoldierLevel(this.armType);
        const stats = SoldierSystem.instance.getSoldierStats(this.armType, currentLevel);
        
        // 检查金币是否足够
        const canUpgrade = UserManager.instance.userModel.glod >= stats.upgradeCost;
        this.updatePriceColor(canUpgrade);
        
        if (!canUpgrade) {
            console.log('金币不足，无法升级');
            return;
        }

        // 扣除金币
        UserManager.instance.deductGold(stats.upgradeCost);

        // 升级兵种
        const newLevel = currentLevel + 1;
        UserManager.instance.userModel.setSoldierLevel(this.armType, newLevel);
        UserManager.instance.saveSoldierLevel(this.armType, newLevel); 

        // 刷新UI显示
        const homeArm = AliensGlobalInstance.instance.homeArm;
        homeArm.getComponent(HomeArm).showArmUI(); 
        homeArm.getComponent(HomeArm).showCastleUI(); 

        // 通知主界面刷新金币显示
        if (this.homeTop) {
            this.homeTop.getComponent(HomeTop).updateGold();
        }
    }

    /**
     * 更新价格文本颜色
     * @param canUpgrade 是否可以升级
     */
    private updatePriceColor(canUpgrade: boolean) {
        if (this.armUpgradePrice) {
            this.armUpgradePrice.color = canUpgrade ? new Color(255, 255, 255) : new Color(255, 0, 0);
        }
    }

    /**
     * 更新兵种属性显示
     * @param name 兵种名称
     * @param attack 当前攻击力
     * @param attackUp 攻击力增加值
     * @param hp 当前血量
     * @param hpUp 血量增加值
     * @param upgradeCost 升级消耗
     */
    updateArmStats(name: string, attack: number, attackUp: number, hp: number, hpUp: number, upgradeCost: number) {
        this.armName.string = name;
        this.armAtk.string = `${attack.toFixed(2)}`;
        // this.armAtk.string = '199.33';
        this.armAtkUp.string = `+${attackUp.toFixed(2)}`;
        this.armCurHp.string = `${hp.toFixed(2)}`;
        this.armHpUp.string = `+${hpUp.toFixed(2)}`;
        this.armUpgradePrice.string = `${upgradeCost}`;
        // 更新价格颜色
        // console.log('用户剩余金币:',UserManager.instance.userModel.glod, ',升级所需:',upgradeCost);
        const canUpgrade = UserManager.instance.userModel.glod >= upgradeCost;
        this.updatePriceColor(canUpgrade);
    }
}


