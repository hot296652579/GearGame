import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { GearGrids } from './GearGrids';
import { GearComponent } from './GearComponent';
import { GearType, PropType, SoldierType } from '../Enum/GameEnums';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

//动画时长
export const ANIM_TIME = 0.1; // 0.3 se

/**齿轮系统*/
@ccclass('GearSystem')
export class GearSystem {
    private static _instance: GearSystem | null = null;
    public static get instance(): GearSystem {
        if (!this._instance) this._instance = new GearSystem();
        return this._instance;
    }

    // 定义网格的行数和列数
    rows = 4;  // 4行
    cols = 6;  // 6列
    //发动机位置
    private enginePos = [1, 2];

    //记录存放的齿轮
    placedGears: Map<Node, {row: number, col: number}> = new Map();
    
    private _gridRoot: Node = null!; // 网格根节点
    private _contactFace: Node = null!; // 永动机接触面的世界坐标
    private _contactThreshold: number = 61; // 接触触发阈值
    private _rotatingGears: Set<Node> = new Set(); // 正在旋转的齿轮集合

    initUI(){
        this._gridRoot = AliensGlobalInstance.instance.gameGrids;
        this._contactFace = this._gridRoot.getComponent(GearGrids)!.contactFace;
    }

    //获取发动机位置
    getEnginePos() {
        return this.enginePos;  
    }

    //设置存放的齿轮
    setPlaceGear(btn: Node, row: number, col: number) {
        // console.log(`Button placed at row: ${row}, col: ${col}`);
        this.placedGears.set(btn, {row, col});
    }

    //获取存放的齿轮
    getPlaceGear(btn: Node) {
        return this.placedGears.get(btn); 
    }

    //检查接触关联的齿轮
    checkGearContact() {
        // 先重置所有齿轮的速率显示
        this.placedGears.forEach((pos, gear) => {
            // 检查节点是否有效
            if (!gear.isValid) {
                this.placedGears.delete(gear);
                return;
            }
            
            const gearComp = gear.getComponent(GearComponent);
            if (gearComp) {
                gearComp.resetRate();
            }
        });

        const contactWorldPos = this._contactFace.worldPosition;
        
        this.placedGears.forEach((pos, gear) => {
            const gearPos = gear.worldPosition;
            const contactToGear = new Vec3(
                gearPos.x - contactWorldPos.x,
                gearPos.y - contactWorldPos.y,
                0
            );
    
            const distance = contactToGear.length();
            if (distance <= this._contactThreshold) {
                if (!this._rotatingGears.has(gear)) {
                    // 获取所有相连的齿轮
                    const connectedGears = this.getConnectedGears(pos.row, pos.col);
                    
                    // 记录每个齿轮的旋转方向
                    const rotationDirections = new Map<Node, number>();
                    
                    // 基础齿轮方向为逆时针
                    if (pos.row === 0 && pos.col === 1) {
                        rotationDirections.set(gear, -30);
                    }
                    
                    // 旋转所有相连的齿轮
                    connectedGears.forEach(connectedGear => {
                        if (!this._rotatingGears.has(connectedGear)) {
                            this._rotatingGears.add(connectedGear);
                            const gearPos = this.placedGears.get(connectedGear);
                            
                            // 获取旋转方向
                            let rotationAngle = -30; // 默认值
                            if (gearPos) {
                                // 查找父齿轮方向
                                const parentGear = this.findParentGear(connectedGear, connectedGears);
                                if (parentGear && rotationDirections.has(parentGear)) {
                                    // 与父齿轮方向相反
                                    rotationAngle = -rotationDirections.get(parentGear)!;
                                }
                                rotationDirections.set(connectedGear, rotationAngle);
                            }
                            
                            // 添加增长逻辑
                            const gearComp = connectedGear.getComponent(GearComponent);
                            if (gearComp && (gearComp.type === GearType.Soldier || gearComp.type === GearType.Prop)) {
                                if (!GameManager.instance.isPaused) {
                                    gearComp.addGrowth(); 
                                }
                            }

                            const gear = connectedGear.getChildByName('Gear')!;
                            tween(gear)
                                .by(ANIM_TIME, { eulerAngles: new Vec3(0, 0, rotationAngle) })
                                .call(() => {
                                    this._rotatingGears.delete(connectedGear);
                                })
                                .start();
                        }
                    });
                }
            }

            // 找出所有加速齿轮并应用速率加成
            const gearComp = gear.getComponent(GearComponent);
            if (gearComp && gearComp.type === GearType.SpeedUp) {
                this.applySpeedUpEffect(gearComp);
            }
        });
    }

    /**
     * 应用加速齿轮效果
     */
    private applySpeedUpEffect(speedUpGear: GearComponent) {
        // 获取加速齿轮的位置
        const gearPos = this.placedGears.get(speedUpGear.node);
        if (!gearPos) return;
        
        // 获取相连的所有齿轮
        const connectedGears = this.getConnectedGears(gearPos.row, gearPos.col);
        
        // 计算所有相连加速齿轮的总加成
        let totalSpeedUp = 0;
        connectedGears.forEach(gear => {
            const gearComp = gear.getComponent(GearComponent);
            if (gearComp && gearComp.type === GearType.SpeedUp) {
                totalSpeedUp += gearComp.growth;
            }
        });
        
        // 应用总加速效果到所有兵种/道具齿轮
        connectedGears.forEach(gear => {
            const gearComp = gear.getComponent(GearComponent);
            if (gearComp && (gearComp.type === GearType.Soldier || gearComp.type === GearType.Prop)) {
                gearComp.addSpeedUpEffect(totalSpeedUp);
            }
        });
    }

    //查找父齿轮
    private findParentGear(gear: Node, connectedGears: Node[]): Node | null {
        const currentPos = this.placedGears.get(gear);
        if (!currentPos) return null;
        
        // 查找相邻齿轮中已确定方向的齿轮作为父齿轮
        const adjacentGears = this.getAdjacentGears(currentPos.row, currentPos.col);
        for (const adjGear of adjacentGears) {
            if (connectedGears.includes(adjGear)) {
                return adjGear;
            }
        }
        
        return null;
    }

    //获取所有相连的齿轮
    private getConnectedGears(startRow: number, startCol: number): Node[] {
        const connectedGears: Node[] = [];
        const visited = new Set<string>();
        const queue: {row: number, col: number}[] = [{row: startRow, col: startCol}];
        
        while (queue.length > 0) {
            const current = queue.shift()!;
            const key = `${current.row},${current.col}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            // 查找当前齿轮
            this.placedGears.forEach((pos, gear) => {
                if (pos.row === current.row && pos.col === current.col) {
                    connectedGears.push(gear);
                    
                    // 获取相邻齿轮加入队列
                    const adjacent = this.getAdjacentGears(current.row, current.col);
                    adjacent.forEach(adjGear => {
                        const adjPos = this.placedGears.get(adjGear);
                        if (adjPos && !visited.has(`${adjPos.row},${adjPos.col}`)) {
                            queue.push({row: adjPos.row, col: adjPos.col});
                        }
                    });
                }
            });
        }
        
        return connectedGears;
    }

    //检查相邻齿轮
    private getAdjacentGears(row: number, col: number): Node[] {
        const adjacentGears: Node[] = [];
        
        // 检查上下左右四个方向的相邻齿轮
        const directions = [
            {row: -1, col: 0},  // 上
            {row: 1, col: 0},   // 下
            {row: 0, col: -1},  // 左
            {row: 0, col: 1}    // 右
        ];
        
        directions.forEach(dir => {
            const targetRow = row + dir.row;
            const targetCol = col + dir.col;
            
            // 检查边界
            if (targetRow >= 0 && targetRow < 4 && targetCol >= 0 && targetCol < 6) {
                this.placedGears.forEach((pos, gear) => {
                    if (pos.row === targetRow && pos.col === targetCol) {
                        adjacentGears.push(gear);
                    }
                });
            }
        });
        
        return adjacentGears;
    }

    /**
     * 获取生成的商店齿轮类型
     */
    getShopGearTypes(): {type: GearType, subType?: SoldierType, level: number}[] {
        return this.generateGearRules(); 
    }

    /** 生成齿轮规则 - 随机生成3个齿轮(士兵或加速道具) */
    generateGearRules() {
        const gears = [];
        const soldierTypes = [SoldierType.Melee, SoldierType.Ranged, SoldierType.Super];
        
        // 随机选择一种兵种类型
        const randomSoldierType = soldierTypes[Math.floor(Math.random() * soldierTypes.length)];
        gears.push({
            type: GearType.Soldier,
            subType: randomSoldierType,
            level: 1
        });

        // 生成加速齿轮
        gears.push({
            type: GearType.SpeedUp,
            level: Math.floor(Math.random() * 2) + 1
        });

        const propTypes = [PropType.Freeze, PropType.Heal];
        //取0或则1
        const randomPropType = propTypes[Math.floor(Math.random() * propTypes.length)];
        // 生成道具
        gears.push({
            type: GearType.Prop,
            subType: randomPropType,
            level: Math.floor(Math.random() * 2) + 1
        });

        console.log('生成的齿轮规则:', gears);
        
        return gears;
    }

    /**
     * 移除齿轮
     */
    removeGear(gear: Node) {
        this.placedGears.delete(gear);
    }

    reset() {
        this.placedGears.clear();
    }

}

