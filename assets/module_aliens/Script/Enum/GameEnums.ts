export interface IGearBase {
    id: string; // 唯一ID
    legValue: number; // 价格
    sellPrice: number; // 出售价格
    type: GearType; // 类型
    level?: number; // 等级
    growth: number; // 当前增长值（0~1）
    baseGrowthRate: number; // 基础增长速率
    canMove?: boolean;//是否可移动
  }

  // 齿轮类型
  export enum GearType {
    Soldier = 'soldier', //兵种类型
    Prop = 'prop', //道具类型
    SpeedUp = 'speedUp', //加速类型
  }

  // 兵种类型
  export enum SoldierType  {
    Melee = 'melee', //近战
    Ranged = 'ranged', //远程
    Super = 'super', //超级
  }

  // 道具类型
  export enum PropType {
    Freeze = 'freeze', //冻结
    Coin = 'coin', //金币
    Heal = 'heal', //治疗
  }