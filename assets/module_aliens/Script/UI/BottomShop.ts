import { _decorator, Component, EventTouch, Input, instantiate, Label, Node, Prefab, tween, UITransform, Vec2, Vec3 } from 'cc';
import { resLoader, ResLoader } from 'db://assets/core_tgx/base/ResLoader';
import { ModuleDef } from 'db://assets/scripts/ModuleDef';
import { ANIM_TIME, GearSystem } from '../Gear/GearSystem';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { GearGrids } from '../Gear/GearGrids';
import { GearComponent } from '../Gear/GearComponent';
import { GearType } from '../Enum/GameEnums';
import { GameManager } from '../Manager/GameManager';
import { BattleTop } from './BattleTop';
import { LevelManager } from '../Manager/LevelMgr';
import { GameUtil } from '../GameUtil';
const { ccclass, property } = _decorator;

@ccclass('BottomShop')
export class BottomShop extends Component {

    @property(Node)
    btnRefProp: Node = null!; 
    @property(Node)
    btnBattle: Node = null!;
    @property(Node)
    btnAddLegs: Node = null!;
    @property(Node)
    btnSell: Node = null!;

    @property(Label) //出售价格文本
    lbSellPrice: Label = null!;

    private gridRoot: Node = null!; // 网格根节点

    private btnOriginalPositions: Map<Node, Vec3> = new Map();
    private _touchOffset: Vec3 = new Vec3(); // 记录触摸点与按钮中心的偏移量
    private _currentSelectedNode: Node = null!;

    private girdsRow:number = 4; 
    private girdsCol:number = 6; 

    protected onLoad(): void {
        this.btnRefProp.on(Input.EventType.TOUCH_END, this.onTouchEndRef, this);
        this.btnBattle.on(Input.EventType.TOUCH_END, this.onTouchEndBattle, this);
        this.btnAddLegs.on(Input.EventType.TOUCH_END, this.onTouchEndAddLegs, this);
    }

    private _originalY: number = 0; // 记录初始Y坐标

    start() {
        this.girdsRow = GearSystem.instance.rows; 
        this.girdsCol = GearSystem.instance.cols; 
        this.gridRoot = AliensGlobalInstance.instance.gameGrids;
        this._originalY = this.node.position.y; // 保存初始Y坐标
    }

    /**
     * 上升动画
     */
    public riseUp() {
        tween(this.node)
            .to(ANIM_TIME, { position: new Vec3(this.node.position.x, -400, 0) })
            .call(() => { 
                this.createGear(); 
            })
            .start();
    }

    /**
     * 回到初始位置
     */
    public returnToOriginal() {
        tween(this.node)
            .to(ANIM_TIME, { position: new Vec3(this.node.position.x, this._originalY, 0) })
            .start();
    }

    //创建齿轮
    async createGear() {
        const gearConfigs = GearSystem.instance.getShopGearTypes();

        const props = this.node.getChildByName('Props').children;
        const propsCount = props.length;
        
        for (let i = 0; i < propsCount; i++) {
            let gearNode: Node;
            const config = gearConfigs[i % gearConfigs.length]; // 循环使用配置
            
            // 根据齿轮类型加载不同预制体
            switch(config.type) {
                case GearType.Soldier:
                    const gearArm = await resLoader.loadAsync(ModuleDef.MODULE_ALIENS,'Prefab/Gear/GearArm', Prefab)!;
                    gearNode = instantiate(gearArm);
                    break;
                case GearType.Prop:
                    const gearProp = await resLoader.loadAsync(ModuleDef.MODULE_ALIENS,'Prefab/Gear/GearProp', Prefab)!;
                    gearNode = instantiate(gearProp);
                    break;
                case GearType.SpeedUp:
                    const gearSpeedUp = await resLoader.loadAsync(ModuleDef.MODULE_ALIENS,'Prefab/Gear/GearSpeedUp', Prefab)!;
                    gearNode = instantiate(gearSpeedUp);
                    break;
                default:
                    continue;
            }
            
            let gearId = '';
            if (config.type === GearType.Soldier) {
                gearId = `Soldier_${config.subType}_${config.level}`;
            } else if (config.type === GearType.SpeedUp) {
                gearId = `SpeedUp_${config.level}`;
            } else {
                gearId = `Prop_${config.subType}_${config.level}`;
            }

            // 初始化齿轮数据
            const gearComponent = gearNode.getComponent(GearComponent);
            gearComponent.initWithId(gearId);
            
            props[i].removeAllChildren();
            props[i].addChild(gearNode);
            this.btnOriginalPositions.set(gearNode, gearNode.position.clone());
            this.addDragEvent(gearNode);
        }
    }

    //刷新齿轮
    private onTouchEndRef(event: EventTouch) {
        if(LevelManager.instance.tryDeductLegs(10)){
            this.createGear();
            this.updateBattleTopLegs();
            this.updateBottomShopGearPrices();
        }
    }

    //继续战斗
    private onTouchEndBattle(event: EventTouch) {
        this.returnToOriginal();
        GameManager.instance.resumeGame();
        GameManager.instance.startEnemyWaves();
    }

    //增加关卡腿数
    private onTouchEndAddLegs(event: EventTouch) {
        const levelLegsAdd = LevelManager.instance.getLevelLegsAdd();
        LevelManager.instance.addLevelLegs(levelLegsAdd);
        this.updateBattleTopLegs();
        this.updateBottomShopGearPrices();
        this.addLegEffect(); 
    }

    private addLegEffect(){
        const from = this.btnAddLegs;
        const to = AliensGlobalInstance.instance.battleTop.getChildByName('UserLegs')!;
        GameUtil.flyToPosition(from, to, 5, 'leg');
    }

    private addDragEvent(btn: Node) {
        btn.setPosition(btn.position); // 重置位置确保触摸区域正确
        btn.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        btn.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        btn.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        btn.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        const btn = event.target as Node;
        // 记录触摸点与按钮中心的偏移量
        const touchPos = event.getUILocation();
        const btnWorldPos = btn.position;
        this._touchOffset = new Vec3(
            btnWorldPos.x - touchPos.x,
            btnWorldPos.y - touchPos.y,
            0
        );
    }

    private onTouchMove(event: EventTouch) {
        const btn = event.target as Node;
        const touchPos = event.getUILocation();
        btn.setPosition(
            new Vec3(
                touchPos.x + this._touchOffset.x,
                touchPos.y + this._touchOffset.y,
                0
            )
        );

        // 检测是否在grids范围内
        this.checkGridSelection(btn);
    }

    private checkGridSelection(btn: Node) {
        // 清除之前的选择
        if (this._currentSelectedNode) {
            const selectedNode = this._currentSelectedNode.getChildByName('Selected');
            if (selectedNode) selectedNode.active = false;
            this._currentSelectedNode = null!;
        }

        const selectedNode = this.gridRoot.getComponent(GearGrids).checkGridSelection(btn);
        this._currentSelectedNode = selectedNode;
    }

    private onTouchEnd(event: EventTouch) {
        const btn = event.target as Node;
        const gearComp = btn.getComponent(GearComponent);
        let placedRow = -1;
        let placedCol = -1;
        
        // 检查是否拖动到出售按钮
        const touchPos = event.getUILocation();
        const sellBtnRect = this.btnSell.getComponent(UITransform)!.getBoundingBoxToWorld();
        
        if (sellBtnRect.contains(new Vec2(touchPos.x, touchPos.y))) {
            if (btn && btn.parent.parent !== this.node.getChildByName('Props')) {
                // 出售齿轮，增加腿数
                LevelManager.instance.addLevelLegs(gearComp.sellPrice);
                GearSystem.instance.removeGear(btn);
                btn.destroy();
                
                // 更新UI
                this.updateBattleTopLegs();
                this.updateBottomShopGearPrices();
                return;
            }
        }

        if (this._currentSelectedNode) {
            const childrenCount = this._currentSelectedNode.children.length;
            const hasSelected = this._currentSelectedNode.children.some(child => child.name === 'Selected');
            
            // 只有Selected节点或没有子节点时表示可放置
            if (childrenCount === 0 || (childrenCount === 1 && hasSelected)) {
                const gearComp = btn.getComponent(GearComponent);
                
                if(btn.parent.parent == this.node.getChildByName('Props')){
                    if (!LevelManager.instance.tryDeductLegs(gearComp.legValue)) {
                        // 大腿价值不足，回到原位置
                        const originalPos = this.btnOriginalPositions.get(btn);
                        if (originalPos) {
                            tween(btn)
                                .to(ANIM_TIME, { position: originalPos })
                                .start();
                        }
                        return;
                    }
                }
                
                const selectedNode = this._currentSelectedNode.getChildByName('Selected');
                if (selectedNode) selectedNode.active = false;
                
                btn.parent = this._currentSelectedNode;
                btn.setPosition(Vec3.ZERO);
                
                const index = this.gridRoot.children.indexOf(this._currentSelectedNode);
                placedRow = Math.floor(index / (this.girdsRow + 2));
                placedCol = index % this.girdsCol;

                if (gearComp) {
                    gearComp.gridStyle();
                }
            } 
            // 有齿轮时处理
            else if (childrenCount > 1) {
                // 获取目标齿轮
                const targetGear = this._currentSelectedNode.children.find(
                    child => child.getComponent(GearComponent) && child.name !== 'Selected'
                );
                
                if (targetGear && gearComp) {
                    // 检查是否是自身
                    if (targetGear === btn) {
                        const originalPos = this.btnOriginalPositions.get(btn);
                        if (originalPos) {
                            tween(btn)
                                .to(ANIM_TIME, { position: originalPos })
                                .start();
                        }
                        return;
                    }
                    
                    const targetGearComp = targetGear.getComponent(GearComponent);
                    const levelLegs = LevelManager.instance.getLevelBaseLegs();
                    
                    // 检查是否可以合并
                    if (gearComp.type === targetGearComp?.type && 
                        gearComp.level === targetGearComp?.level && gearComp.legValue <= levelLegs) {
                        // 执行合并
                        if (gearComp.mergeWith(targetGearComp)) {
                            // 合并成功，更新当前齿轮位置
                            btn.parent = this._currentSelectedNode;
                            btn.setPosition(Vec3.ZERO);
                            
                            const index = this.gridRoot.children.indexOf(this._currentSelectedNode);
                            placedRow = Math.floor(index / (this.girdsRow + 2));
                            placedCol = index % this.girdsCol;
                        }

                        if (gearComp) {
                            gearComp.gridStyle();
                        }
                    } else {
                        // 不能合并，回到原位置
                        const originalPos = this.btnOriginalPositions.get(btn);
                        if (originalPos) {
                            tween(btn)
                                .to(ANIM_TIME, { position: originalPos })
                                .start();
                        }
                    }
                }
            }
        } else {
            // 不在网格范围内，回到原始位置
            const originalPos = this.btnOriginalPositions.get(btn);
            if (originalPos) {
                tween(btn)
                    .to(ANIM_TIME, { position: originalPos })
                    .start();
            }
        }
        
        this._currentSelectedNode = null!;
        
        // 如果有有效放置，记录位置
        if (placedRow !== -1 && placedCol !== -1) {
            GearSystem.instance.setPlaceGear(btn, placedRow, placedCol);
            
            this.updateBattleTopLegs();
            this.updateBottomShopGearPrices();
        }
    }

    //更新战斗顶部腿数
    private updateBattleTopLegs() {
        const battleTop = AliensGlobalInstance.instance.battleTop.getComponent(BattleTop)!;
        if (battleTop) {
            battleTop.updateLegs();
        }
    }

    //更新底部商店齿轮价格
    private updateBottomShopGearPrices() {
        const props = this.node.getChildByName('Props').children;
        for (const prop of props) {
            const gearNode = prop.children[0];
            if (gearNode) {
                const gearComp = gearNode.getComponent(GearComponent);
                if (gearComp) {
                    gearComp.showLegs();
                }
            }
        }
    }

}


