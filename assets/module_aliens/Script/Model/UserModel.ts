import { Tablemain_config } from "db://assets/module_basic/table/Tablemain_config";
import { SoldierType } from '../Enum/GameEnums';

export class UserModel {
    glod: number = 0; //金币
    nickName: string = 'player'; //昵称
    soldierLevels: Record<SoldierType, number> = {
        [SoldierType.Melee]: 1,
        [SoldierType.Super]: 1,
        [SoldierType.Ranged]: 1
    };
    castleLevel: number = 1;

    constructor() {}

    getSoldierLevel(type: SoldierType): number {
        return this.soldierLevels[type] || 1;
    }

    setSoldierLevel(type: SoldierType, level: number): void {
        this.soldierLevels[type] = level;
        console.log(`设置兵种 ${type} 等级为 ${level}`);
    }

    getCastleLevel(): number {
        return this.castleLevel;
    }

    setCastleLevel(level: number): void {
        this.castleLevel = level;
    }
}
