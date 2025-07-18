import { SoldierType } from "../Enum/GameEnums";

export interface ISoldierStats {
    type: SoldierType;        // 兵种类型
    attack: number;        // 攻击力
    hp: number;           // 生命值
    level: number;        // 等级
    moveSpeed: number;    // 移动速度
    attackRange: number;  // 攻击范围
    attackInterval: number; // 攻击间隔（秒）
    soldiderExp:number; //经验值
    deadGold:number;//死亡金币
}
 // 阵营枚举
export enum Camp {
    Player = 1,
    Enemy = 2,
    Neutral = 3, // 可选，比如NPC、召唤物等
}