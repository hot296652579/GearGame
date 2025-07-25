// SoldierSystem.ts
import { Vec3, Node, find } from 'cc';
import { SoldierType } from '../Enum/GameEnums';
import { Camp } from './ISoldierStats';
import { NodePoolManager } from '../NodePoolManager';
import { BaseSoldier } from './SoldierBase';
import { GameConfig } from '../GameConfig';

//士兵升级公式:基础值*1.1^（n-1)
//金币消耗公式:基础值*1.2^（n-1）
//士兵死亡获得金币:小兵价值*关卡数 (小兵价值:1 远程兵值:3 超级兵价值:6)
export class SoldierSystem {
    private static _instance: SoldierSystem;
    public static get instance(): SoldierSystem {
        if (!this._instance) {
            this._instance = new SoldierSystem();
        }
        return this._instance;
    }

    //自家士兵父类节点
    soldierParentSelf: Node;
    //敌方士兵父类节点
    soldierParentEnemy: Node;

    public init() {
        this.soldierParentSelf = find('Canvas/BattleUI/WalledCity/City1/Soldiers');
        this.soldierParentEnemy = find('Canvas/BattleUI/WalledCity/City2/Soldiers');
    }

    public spawnSoldier(type: SoldierType, camp: Camp) {
        let parent:Node = camp === Camp.Player ? this.soldierParentSelf : this.soldierParentEnemy;
        const node = NodePoolManager.instance.getNode(type,parent);
        node.setPosition(0,0,0);

        const script = node.getComponent(BaseSoldier);
        //先暂给假数据
        const stats = {
            type: type,
            moveSpeed: type == SoldierType.Ranged ? 80 : 100, // 移动速度
            attackRange: type == SoldierType.Ranged ? 250 : 110, // 攻击范围 
            attackInterval:  type == SoldierType.Ranged ? 1 : 1, // 攻击间隔（秒）
            attack: 10, // 攻击力
            level: 1, // 等级
            hp: 100, // 生命值
            soldiderExp: 10, // 经验
            deadGold: 10, // 死亡获得金币
        }
        script.init(stats, camp);
        return node;
    }

    /**
     * 获取敌方士兵列表
     * @param camp 当前阵营
     */
    public getEnemySoldiers(camp: Camp): BaseSoldier[] {
        const enemyParent = camp === Camp.Player ? this.soldierParentEnemy : this.soldierParentSelf;
        const enemies: BaseSoldier[] = [];
        
        enemyParent.children.forEach(child => {
            const soldier = child.getComponent(BaseSoldier);
            if (soldier) {
                enemies.push(soldier);
            }
        });
        
        return enemies;
    }

    /** 检查敌方士兵是否全部阵亡*/
    public checkEnemySoldiers():boolean {
        const enemySoldiers = this.getEnemySoldiers(Camp.Enemy);
        return enemySoldiers.length === 0
    }

    /**计算当前兵的当前攻击血量以及升级所需金额 
     * @param type 兵的类型
     * @param level 兵的等级
    */
    public getSoldierStats(type: SoldierType, level: number): {name:string, attack: number,upgradeAttack:number, hp: number,upgradeHp:number, upgradeCost: number } {
        const baseConfig = GameConfig.getSoldierConfig(type);

        // 计算当前攻击力: 基础攻击 * 1.1^(当前等级-1)
        const attack = parseFloat((baseConfig.attack * Math.pow(1.1, level - 1)).toFixed(2));
        // 计算下一级攻击力
        const nextLevelAttack = parseFloat((baseConfig.attack * Math.pow(1.1, level)).toFixed(2));
        const upgradeAttack = parseFloat((nextLevelAttack - attack).toFixed(2));

        // 计算当前血量: 基础血量 * 1.1^(当前等级-1)
        const hp = parseFloat((baseConfig.hp * Math.pow(1.1, level - 1)).toFixed(2));
        // 计算下一级血量
        const nextLevelHp = parseFloat((baseConfig.hp * Math.pow(1.1, level)).toFixed(2));
        const upgradeHp = parseFloat((nextLevelHp - hp).toFixed(2));

        // 计算升级消耗: 基础消耗 * 1.2^(当前等级-1) (保持整数)
        const upgradeCost = Math.floor(baseConfig.upgradeCost * Math.pow(1.2, level - 1));

        return { 
            name:baseConfig.name,
            attack, 
            upgradeAttack,
            hp, 
            upgradeHp,
            upgradeCost 
        };
    }

    public clearAllSoldiers() {
        this.soldierParentSelf.children.forEach(child => {
            NodePoolManager.instance.putNode(child.name, child);
        });
        this.soldierParentEnemy.children.forEach(child => {
            NodePoolManager.instance.putNode(child.name, child);
        });
    }
}
