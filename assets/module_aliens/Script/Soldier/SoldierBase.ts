import { _decorator, Component, Node, sp, UITransform, Vec3 } from 'cc';
import { Camp, ISoldierStats, } from './ISoldierStats';
import { GameManager } from '../Manager/GameManager';
import { SoldierSystem } from './SoldierSystem';
import { NodePoolManager } from '../NodePoolManager';
import { BloodBar } from '../UI/BloodBar';
import { Castle } from '../Castle/Castle';
import { CastleManager } from '../Castle/CastleManager';
import { GameConfig } from '../GameConfig';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { BattleTop } from '../UI/BattleTop';
import { LevelManager } from '../Manager/LevelMgr';
import { UserManager } from '../Manager/UserMgr';
import { AliensAudioMgr } from '../Manager/AliensAudioMgr';
import { SoldierType } from '../Enum/GameEnums';
const { ccclass } = _decorator;

/** 士兵基类*/
@ccclass('BaseSoldier')
export class BaseSoldier extends Component {
    public stats: ISoldierStats;
    public camp: Camp = Camp.Enemy; // 默认敌方
    private _isPaused: boolean = false;
    protected attackCooldown: number = 0; // 攻击冷却时间
    private _targetCastle: Node = null;
    protected isDead: boolean = false;

    protected currentAnim: string = 'none';
    protected isAttacking: boolean = false;

    public init(stats: ISoldierStats, camp: Camp) {
        this.stats = stats;
        this.camp = camp;

        console.log('阵营:', this.camp, ',stats:', stats);

        if (GameManager.instance && GameManager.instance.playerCastle && GameManager.instance.enemyCastle) {
            this._targetCastle = camp === Camp.Player ?
                GameManager.instance.enemyCastle :
                GameManager.instance.playerCastle;
        }
    }

    protected move() {
        // 如果有攻击目标则停止移动
        if (this.findNearestTarget()) {
            return;
        }
        if (!this._targetCastle || !this._targetCastle.isValid) return;

        // 计算与目标城池的距离
        const distance = Vec3.distance(this.node.worldPosition, this._targetCastle.worldPosition);

        // 如果距离小于城市宽度的一半，停止移动
        if (distance < this._targetCastle.getComponent(UITransform).width / 2) {
            return;
        }

        // 计算方向向量（从士兵指向目标城池）
        const direction = new Vec3();
        let targetPos = this._targetCastle.worldPosition.clone();
        const offset = Math.floor(this._targetCastle.getComponent(UITransform).width / 3); // 偏移量
        targetPos.y = targetPos.y - offset; //朝向城池门方向移动

        Vec3.subtract(direction, targetPos, this.node.worldPosition);

        // 确保方向正确
        if (direction.lengthSqr() > 0) {
            direction.normalize();
            const moveDistance = this.stats.moveSpeed * 0.016;
            this.node.worldPosition = this.node.worldPosition.add(direction.multiplyScalar(moveDistance));
        }
    }

    /**
     * 设置暂停状态
     */
    public setPaused(isPaused: boolean) {
        this._isPaused = isPaused;
    }

    update(dt: number) {
        if (this._isPaused) return;

        this.attackCooldown -= dt;
        this.move();
        this.checkAndAttack();
    }

    checkAndAttack() {
        if (this.attackCooldown <= 0 && this.canAttack()) {
            this.attack();
            this.attackCooldown = this.stats.attackInterval;
        }
    }

    protected canAttack(): boolean {
        const target = this.findNearestTarget();
        if (!target) return false;

        // 检查目标是否敌方单位或城池
        if (target instanceof BaseSoldier) {
            return target.camp !== this.camp;
        } else if (target instanceof Castle) {
            // console.log('目标是城池!')
            return target.camp !== this.camp;
        }
        return false;
    }

    protected attack(): void {
        const target = this.findNearestTarget();
        // console.log('攻击目标:',target);
        if (!target) return;
        // 造成伤害
        if (target instanceof BaseSoldier) {
            target.takeDamage(this.stats.attack);
            // 显示血条
            const bloodBar = NodePoolManager.instance.getNode('blood', target.node);
            if (bloodBar) {
                const bloodScript = bloodBar.getComponent(BloodBar);
                if (bloodScript) {
                    bloodScript.showBloodProgress(target.stats.hp, target.stats.maxHp);
                }
            }
        } else if (target instanceof Castle) {
            // console.log('攻击城池!');
            target.takeDamage(this.stats.attack);
        }
    }

    public takeDamage(amount: number) {
        if (this.isDead) return; // 已死亡的士兵不再受伤害

        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('enemyHit'), 1.0);
        this.stats.hp -= amount;
        if (this.stats.hp <= 0) {
            this.die();
            this.isDead = true; // 标记为已死亡
            GameManager.instance.checkEnemySoldiers();
        }
    }

    protected die() {
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('enemyDie'), 1.0);
        // 如果是敌方士兵死亡，增加经验和关卡腿数
        if (this.camp === Camp.Enemy) {
            const exp = GameConfig.getSoldierConfig(this.stats.type).deadExp;
            const leg = GameConfig.getSoldierConfig(this.stats.type).deadLeg;
            const gold = GameConfig.getSoldierConfig(this.stats.type).deadGold;
            const battleTop = AliensGlobalInstance.instance.battleTop.getComponent(BattleTop);
            battleTop.addExp(exp);

            LevelManager.instance.addLevelLegs(leg);
            battleTop.updateLegs();
            LevelManager.instance.addLevelGold(gold);
            battleTop.updateGold();

            UserManager.instance.addGold(gold);
        }
    }

    //findNearestTarget方法
    protected findNearestTarget(): BaseSoldier | Castle | null {
        const enemies = SoldierSystem.instance.getEnemySoldiers(this.camp);
        let nearestEnemy: BaseSoldier | null = null;
        let minDistance = Number.MAX_VALUE;

        enemies.forEach(enemy => {
            // 死亡检查
            if (enemy.isDead) return;

            const distance = Vec3.distance(this.node.worldPosition, enemy.node.worldPosition);
            if (distance < minDistance && distance <= this.stats.attackRange) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        });

        if (nearestEnemy) {
            return nearestEnemy;
        }

        // 2. 如果没有可攻击的士兵，检查敌方城池
        const enemyCastle = CastleManager.instance.getEnemyCastle(this.camp);
        if (enemyCastle) {
            // 计算带偏移的城池位置
            const castlePos = enemyCastle.node.worldPosition.clone();
            const castleWidth = enemyCastle.node.getComponent(UITransform).width;

            // 根据阵营调整偏移方向
            if (this.camp === Camp.Player) {
                castlePos.x -= castleWidth / 2; // 玩家攻击敌方城池，左偏移
            } else {
                castlePos.x += castleWidth / 2; // 敌方攻击玩家城池，右偏移
            }

            const distance = Vec3.distance(this.node.worldPosition, castlePos);
            if (distance <= this.stats.attackRange) {
                // console.log('阵营:',this.camp,',距离',distance,',攻击距离:',this.stats.attackRange);
                return enemyCastle;
            }
        }

        return null;
    }


    protected playAnimation(animName: string, loop: boolean = true): void {
        if (this.currentAnim === animName) return;

        this.currentAnim = animName;
        this.getSkeleton()?.setAnimation(0, animName, loop);
    }

    protected getSkeleton(): sp.Skeleton {
        return null!;
    }
}
