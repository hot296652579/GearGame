import { _decorator, Color, Component, Label, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { IGearBase, GearType, PropType, SoldierType } from '../Enum/GameEnums';
import { SoldierSystem } from '../Soldier/SoldierSystem';
import { PropSystem } from '../Prop/PropSystem';
import { Camp } from '../Soldier/ISoldierStats';
import { GearSystem } from './GearSystem';
import { resLoader, ResLoader } from 'db://assets/core_tgx/base/ResLoader';
import { GameConfig } from '../GameConfig';
import { LevelManager } from '../Manager/LevelMgr';
const { ccclass, property } = _decorator;

@ccclass('GearComponent')
export class GearComponent extends Component implements IGearBase {
    // 实现IGearBase接口
    id: string = '';
    sellPrice: number = 0;
    type: GearType = GearType.Soldier;
    level: number = 1;
    growth: number = 0;
    baseGrowthRate: number = 0;
    canMove: boolean = true;
    //大腿价值
    legValue: number = 0;

    // 兵种/道具特定属性
    private _soldierType: SoldierType = SoldierType.Melee;
    private _propType: PropType = PropType.Coin;

    @property(Node)
    rate: Node = null!;
    //最终速率属性
    private _finalGrowthRate: number = 0;
    private _accumulatedGrowth: number = 0; // 累积的增长值

    @property(SpriteFrame)
    soldierFrames: SpriteFrame[] = [];

    @property(SpriteFrame)
    propFrames: SpriteFrame[] = [];

    @property(Sprite)
    spGear: Sprite = null!;

    @property(Node)
    used: Node = null!; //消耗节点

    @property(Node)
    mask: Node = null!; //遮罩

    @property(Label)
    lbGear: Label = null!;

    @property(Label)
    lbLegs: Label = null!;

    /**
     * 根据ID初始化齿轮数据
     */
    initWithId(gearId: string) {
        this.id = gearId;

        // 根据ID前缀判断类型
        if (gearId.startsWith('Soldier')) {
            this.type = GearType.Soldier;
            const parts = gearId.split('_');
            const soldierType = parts[1] as SoldierType;

            // 设置兵种显示文本
            switch (soldierType) {
                case SoldierType.Melee:
                    this.spGear.spriteFrame = this.soldierFrames[0];
                    break;
                case SoldierType.Ranged:
                    this.spGear.spriteFrame = this.soldierFrames[2];
                    break;
                case SoldierType.Super:
                    this.spGear.spriteFrame = this.soldierFrames[1];
                    break;
            }

            this.legValue = GameConfig.GearLegValue[soldierType] || 999;

            this.baseGrowthRate = 0.2;
            this._soldierType = soldierType;
        } else if (gearId.startsWith('Prop')) {
            this.type = GearType.Prop;
            const parts = gearId.split('_');
            const propType = parts[1] as PropType;

            this.legValue = GameConfig.GearLegValue[propType] || 999;
            this.baseGrowthRate = 0.3;
            this._propType = propType;

            switch (propType) {
                case PropType.Coin:
                    this.spGear.spriteFrame = this.propFrames[0];
                    break;
                case PropType.Heal:
                    this.spGear.spriteFrame = this.propFrames[1];
                    break;
            }
        } else if (gearId.startsWith('SpeedUp')) {
            this.type = GearType.SpeedUp;
            const level = parseInt(gearId.split('_')[1]) || 1;
            this.legValue = GameConfig.GearLegValue[this.type] * level || 999;
            this.level = level;
            this.growth = GearSystem.instance.rateByLevel(level);;
            this.lbGear.string = `${level}`;
        }

        this.sellPrice = Math.floor(this.legValue / 2);
        this.showLegs();
    }

    start() {
        this.defaultStyle();
    }

    //显示价值
    showLegs() {
        this.lbLegs.string = `${this.legValue}`;
        this.updatePriceColor(LevelManager.instance.canAfford(this.legValue));
    }

    private updatePriceColor(canBuy: boolean) {
        if (this.lbLegs) {
            this.lbLegs.color = canBuy ? new Color(255, 255, 255) : new Color(255, 0, 0);
        }
    }

    /**显示冷却效果*/
    showCoolDownEffect() {
        if (this.mask) {
            // 计算冷却进度 (0-1)
            const progress = this._accumulatedGrowth % 1;
            // 根据进度设置mask高度 (0-80)
            const height = Math.floor(80 * (1 - progress));
            this.mask.getComponent(UITransform)!.height = height;
        }
    }

    //默认状态样式
    private defaultStyle() {
        this.hideRateText();
        this.used.active = true;
        if (this.mask) {
            this.mask.active = false;
            this.mask.getComponent(UITransform)!.height = 80; // 重置为最大高度
        }
    }

    //格子内样式
    gridStyle() {
        this.showRateText();
        this.used.active = false;
        if (this.mask) {
            this.mask.active = true;
            this.mask.getComponent(UITransform)!.height = 80;
        }
    }

    /*** 获取最终速率*/
    get finalGrowthRate(): number {
        return this._finalGrowthRate;
    }

    /*** 设置最终速率*/
    set finalGrowthRate(value: number) {
        this._finalGrowthRate = value;
        this.updateRateText(value);
    }

    /*** 更新速率显示文本*/
    updateRateText(rate: number) {
        if (this.rate) {
            const label = this.rate.getComponentInChildren(Label);
            if (label) {
                label.string = `${rate.toFixed(2)}/s`;
            }
        }
    }

    /*** 重置速率为基础速率*/
    resetRate() {
        this._finalGrowthRate = this.baseGrowthRate;
        this.updateRateText(this._finalGrowthRate);
    }

    /*** 添加加速效果*/
    addSpeedUpEffect(speedUpValue: number) {
        // 计算总速率 = 基础速率 + 加速齿轮的加成
        this._finalGrowthRate = this.baseGrowthRate + speedUpValue;
        this.updateRateText(this._finalGrowthRate);
    }

    showRateText() {
        if (this.rate) {
            this.rate.active = true;
        }
    }

    hideRateText() {
        if (this.rate) {
            this.rate.active = false;
        }
    }

    /*** 增加增长值*/
    addGrowth() {
        if (this.type === GearType.SpeedUp) return;

        this._accumulatedGrowth += this.finalGrowthRate;
        this.showCoolDownEffect();

        // 当累积值大于1时触发创建
        if (this._accumulatedGrowth >= 1) {
            const count = Math.floor(this._accumulatedGrowth);
            this._accumulatedGrowth -= count;

            for (let i = 0; i < count; i++) {
                if (this.type === GearType.Soldier) {
                    SoldierSystem.instance.spawnSoldier(this._soldierType, Camp.Player);
                } else if (this.type === GearType.Prop) {
                    PropSystem.instance.takeProp(this._propType);
                }
            }
        }
    }

    /*** 合并齿轮*/
    public mergeWith(other: GearComponent): boolean {
        // 检查是否可以合并
        if (this.type !== other.type || this.level !== other.level) {
            return false;
        }
        // 升级当前齿轮
        this.level = this.level * 2;

        // 根据齿轮类型更新属性
        switch (this.type) {
            case GearType.SpeedUp:
                this.growth = GearSystem.instance.rateByLevel(this.level);
                this.sellPrice = 100 + (this.level - 1) * 25;
                this.lbGear.string = `${this.level}`;
                break;

            case GearType.Soldier:
            case GearType.Prop:
                this.baseGrowthRate += 0.1;
                this.sellPrice += 25;
                break;
        }

        // 更新速率显示
        this.resetRate();
        // 从系统中移除被合并的齿轮
        GearSystem.instance.removeGear(other.node);
        // 销毁被合并的齿轮节点
        other.node.destroy();

        return true;
    }
}


