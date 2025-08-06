import { _decorator, Color, Component, Label, Node } from 'cc';
import { GlobalConfig } from 'db://assets/start/Config/GlobalConfig';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { CastleManager } from '../Castle/CastleManager';
import { SoldierType } from '../Enum/GameEnums';
import { UserManager } from '../Manager/UserMgr';
import { SoldierSystem } from '../Soldier/SoldierSystem';
import { ArmItem } from './ArmItem';
import { HomeTop } from './HomeTop';
const { ccclass, property } = _decorator;

/**主界面兵种UI*/
@ccclass('HomeArm')
export class HomeArm extends Component {

    //基地血量
    @property(Label)
    castleCurHp: Label = null;
    //基地等级
    @property(Label)
    castleLv: Label = null;

    //基地下一等级血量
    @property(Label)
    castleNextHp: Label = null;

    //基地升级按钮
    @property(Node)
    castleUpgradeBtn: Node = null;
    //基地升级价格
    @property(Label)
    castleUpgradePrice: Label = null;

    @property(Node)
    armItem0: Node = null;

    @property(Node)
    armItem1: Node = null;

    @property(Node)
    armItem2: Node = null;

    //主界面顶部
    homeTop: Node = null;

    start() {
        this.homeTop = AliensGlobalInstance.instance.homeTop;
        // 测试模式下设置兵等级
        if (GlobalConfig.isDebug) {
            UserManager.instance.userModel.setSoldierLevel(SoldierType.Melee, 1);
            UserManager.instance.userModel.setSoldierLevel(SoldierType.Super, 1);
            UserManager.instance.userModel.setSoldierLevel(SoldierType.Ranged, 1);
            UserManager.instance.debugSetCastleLevel(1);
        }

        this.showArmUI();
        this.showCastleUI();

        this.castleUpgradeBtn.on(Node.EventType.TOUCH_END, this.onCastleUpgradeBtn, this);
    }

    protected onEnable(): void {
        this.showArmUI();
        this.showCastleUI();
    }

    //显示基地UI
    showCastleUI() {
        const castleLevel = UserManager.instance.userModel.getCastleLevel();
        const castleStats = CastleManager.instance.getLevelCastleHpUpCost(castleLevel);

        this.castleCurHp.string = `${castleStats.castleHp}`;
        this.castleNextHp.string = `${castleStats.nextLevelHp}`;
        this.castleUpgradePrice.string = `${castleStats.upgradeCost}`;

        // 根据金币是否足够设置价格颜色
        const canUpgrade = UserManager.instance.userModel.glod >= castleStats.upgradeCost;
        this.castleUpgradePrice.color = canUpgrade ? new Color(255, 255, 255) : new Color(255, 0, 0);
        this.castleLv.string = `Lv.${castleLevel}`;
    }

    //显示兵种UI
    showArmUI() {
        // 定义兵种配置数组
        const soldierConfigs = [
            { type: SoldierType.Melee, node: this.armItem0 },
            { type: SoldierType.Ranged, node: this.armItem1 },
            { type: SoldierType.Super, node: this.armItem2 }
        ];

        // 统一设置各兵种UI
        soldierConfigs.forEach(config => {
            const level = UserManager.instance.userModel.getSoldierLevel(config.type);
            const params = SoldierSystem.instance.getSoldierStats(config.type, level);

            const item = config.node.getComponent(ArmItem);
            item.armType = config.type;
            item.updateArmStats(
                params.name,
                params.attack,
                params.upgradeAttack,
                params.hp,
                params.upgradeHp,
                params.upgradeCost
            );
        });
    }

    onCastleUpgradeBtn() {
        const currentLevel = UserManager.instance.userModel.getCastleLevel();
        const stats = CastleManager.instance.getLevelCastleHpUpCost(currentLevel);

        // 检查金币是否足够
        if (!UserManager.instance.deductGold(stats.upgradeCost)) {
            console.log('金币不足，无法升级基地');
            return;
        }

        // 升级基地
        const newLevel = currentLevel + 1;
        UserManager.instance.userModel.setCastleLevel(newLevel);
        UserManager.instance.saveCastleLevel(newLevel);

        // 刷新UI显示
        this.showArmUI();
        this.showCastleUI();

        // 通知主界面刷新金币显示
        if (this.homeTop) {
            this.homeTop.getComponent(HomeTop).updateGold();
        }
    }
}


