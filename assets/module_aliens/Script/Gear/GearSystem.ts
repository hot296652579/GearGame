import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { GearGrids } from './GearGrids';
import { GearComponent } from './GearComponent';
import { GearType, PropType, SoldierType } from '../Enum/GameEnums';
import { GameManager } from '../Manager/GameManager';
import { LevelManager } from '../Manager/LevelMgr';
import { BattleTop } from '../UI/BattleTop';
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
    placedGears: Map<Node, { row: number, col: number }> = new Map();

    private _gridRoot: Node = null!; // 网格根节点
    private _contactFace: Node = null!; // 永动机接触面的世界坐标
    private _contactThreshold: number = 63; // 接触触发阈值
    private _rotatingGears: Set<Node> = new Set(); // 正在旋转的齿轮集合

    initUI() {
        this._gridRoot = AliensGlobalInstance.instance.gameGrids;
        this._contactFace = this._gridRoot.getComponent(GearGrids)!.contactFace;
    }

    //获取发动机位置
    getEnginePos() {
        const config = LevelManager.instance.getCurrentLevelConfig();
        return config.enginePos;
    }

    //设置存放的齿轮
    setPlaceGear(btn: Node, row: number, col: number) {
        // console.log(`Button placed at row: ${row}, col: ${col}`);
        this.placedGears.set(btn, { row, col });
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
            if (distance <= this._contactThreshold + 1) {
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
        const queue: { row: number, col: number }[] = [{ row: startRow, col: startCol }];

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
                            queue.push({ row: adjPos.row, col: adjPos.col });
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
            { row: -1, col: 0 },  // 上
            { row: 1, col: 0 },   // 下
            { row: 0, col: -1 },  // 左
            { row: 0, col: 1 }    // 右
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
    getShopGearTypes(): { type: GearType, subType?: SoldierType, level: number }[] {
        return this.generateGearRules();
    }

    /** 生成齿轮规则 */
    generateGearRules() {
        const pgLevel = AliensGlobalInstance.instance.battleTop.getComponent(BattleTop).currentLevel;
        const gears = [];

        // 第一级特殊处理
        if (pgLevel === 1) {
            gears.push(
                { type: GearType.SpeedUp, level: 1 },
                { type: GearType.SpeedUp, level: 1 },
                // { type: GearType.Prop, subType: PropType.Freeze, level: 1 }
                { type: GearType.Soldier, subType: SoldierType.Melee, level: 1 }
            );
            return gears;
        }

        // 权重配置
        const gearTypeWeights = {
            [GearType.SpeedUp]: 50,
            [GearType.Soldier]: 30,
            [GearType.Prop]: 20
        };

        const soldierTypeWeights = {
            [SoldierType.Melee]: 40,
            [SoldierType.Ranged]: 40,
            [SoldierType.Super]: 20
        };

        // 加速齿轮等级权重计算
        const getSpeedUpLevelWeights = () => {
            const maxLevel = Math.min(8, Math.floor(pgLevel / 3) + 1);
            const weights: Record<number, number> = {}; // 明确类型为数字键值对
            for (let i = 1; i <= maxLevel; i *= 2) {
                weights[i] = 100 / i;
            }
            return weights;
        };

        // 生成3个齿轮
        for (let i = 0; i < 3; i++) {
            // 选择齿轮类型
            const gearType = this.weightedRandom([
                [GearType.SpeedUp, gearTypeWeights[GearType.SpeedUp]],
                [GearType.Soldier, gearTypeWeights[GearType.Soldier]],
                [GearType.Prop, gearTypeWeights[GearType.Prop]]
            ]);

            switch (gearType) {
                case GearType.SpeedUp:
                    const speedUpLevelWeights = getSpeedUpLevelWeights();
                    let level = this.weightedRandom(
                        Object.entries(speedUpLevelWeights).map(([lvl, weight]) => [parseInt(lvl), weight] as [number, number])
                    );
                    gears.push({ type: GearType.SpeedUp, level });
                    break;

                case GearType.Soldier:
                    const soldierType = this.weightedRandom([
                        [SoldierType.Melee, soldierTypeWeights[SoldierType.Melee]],
                        [SoldierType.Ranged, soldierTypeWeights[SoldierType.Ranged]],
                        [SoldierType.Super, soldierTypeWeights[SoldierType.Super]]
                    ]);
                    gears.push({ type: GearType.Soldier, subType: soldierType, level: 1 });
                    break;

                case GearType.Prop:
                    const propTypes = [PropType.Freeze, PropType.Heal];
                    const propType = propTypes[Math.floor(Math.random() * propTypes.length)];
                    gears.push({ type: GearType.Prop, subType: propType, level: 1 });
                    break;
            }
        }

        // 打乱顺序
        return this.shuffleArray(gears);
    }

    // 加权随机选择
    private weightedRandom<T>(items: [T, number][]): T {
        const totalWeight = items.reduce((sum, [_, weight]) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (const [item, weight] of items) {
            if (random < weight) return item;
            random -= weight;
        }

        return items[0][0];
    }

    // 数组打乱
    private shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    //根据等级返回对应速率
    rateByLevel(level: number): number {
        // 检查等级是否是2的倍数
        if ((level & (level - 1)) !== 0) {
            console.warn(`Invalid gear level: ${level}, must be power of 2`);
            level = 1;
        }

        // 基础速率和增长系数
        const baseRate = 0.03;
        const growthFactor = 0.02;

        // 计算速率: 0.03 * (2^(n-1)) + 0.02 * (2^(n-1) - 1)
        // 其中n是等级的对数(以2为底)
        const n = Math.log2(level);
        return baseRate * Math.pow(2, n) + growthFactor * (Math.pow(2, n) - 1);
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

