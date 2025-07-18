import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import { resLoader } from 'db://assets/core_tgx/base/ResLoader';
import { ModuleDef } from 'db://assets/scripts/ModuleDef';
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { GearSystem } from './GearSystem';
const { ccclass, property } = _decorator;

@ccclass('GearGrids')
export class GearGrids extends Component {

    /**永动机接触面*/
    contactFace: Node = null;

    start() {
        this.setEnginePos();
    }

    //设置永动机位置
    async setEnginePos() {
        let gridRow = GearSystem.instance.rows; 
        let gridCol = GearSystem.instance.cols; 
        const enginePos = GearSystem.instance.getEnginePos(); 

        //4行6列的排列 根据enginePos位置 给对应的子节点添加齿轮永动机
        for (let i = 0; i < this.node.children.length; i++) {
            const gridCell = this.node.children[i];
            const row = Math.floor(i / (gridRow + 2)); // 计算行索引
            const col = i % gridCol; // 计算列索引

            // console.log(`第${i}个格子的位置是：row=${row}, col=${col}`);
            if (row === enginePos[0] && col === enginePos[1]) {
                let engine = await resLoader.loadAsync(ModuleDef.MODULE_ALIENS,'Prefab/Gear/GearEngine', Prefab)!;
                let engineNode = instantiate(engine);
                gridCell.addChild(engineNode);

                const face = engineNode.getChildByName('ContactFace'); // 永动机的face节点
                this.contactFace = face;
                GearSystem.instance.initUI();
            } 
        }
    }

    checkGridSelection(btn: Node) {
        let closestCell: Node | null = null;
        let minDistance = Number.MAX_VALUE;

        // 检测与grids子节点的碰撞
        for (let i = 0; i < this.node.children.length; i++) {
            const gridCell = this.node.children[i];
            
            // 检查是否有GearEngine节点
            const hasEngine = gridCell.children.some(child => child.name === 'GearEngine');
            if (hasEngine) continue;
            
            const gridRect = gridCell.getComponent(UITransform)!.getBoundingBoxToWorld();
            const btnRect = btn.getComponent(UITransform)!.getBoundingBoxToWorld();

            if (gridRect.intersects(btnRect)) {
                // 计算中心点距离
                const gridCenter = new Vec3(
                    gridRect.center.x,
                    gridRect.center.y,
                    0
                );
                const btnCenter = new Vec3(
                    btnRect.center.x,
                    btnRect.center.y,
                    0
                );
                const distance = Vec3.distance(gridCenter, btnCenter);
                
                // 找到距离最近的格子
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCell = gridCell;
                }
            }
        }

        if (closestCell) {
            // console.log(`选中格子: ${closestCell.name}, 距离: ${minDistance}`);
            const selectedNode = closestCell.getChildByName('Selected');
            if (selectedNode) {
                selectedNode.active = true;
            }
            return closestCell;
        }
        return null;
    }
}


