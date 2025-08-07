import { _decorator, UITransform } from 'cc';
import { PropType } from '../Enum/GameEnums';
import { AliensAudioMgr } from '../Manager/AliensAudioMgr';
import { GameManager } from '../Manager/GameManager';
import { NodePoolManager } from '../NodePoolManager';
import { Camp } from '../Soldier/ISoldierStats';
import { BaseSoldier } from '../Soldier/SoldierBase';
import { SoldierSystem } from '../Soldier/SoldierSystem';

const { ccclass, property } = _decorator;

/**道具系统*/
@ccclass('PropSystem')
export class PropSystem {
    private static _instance: PropSystem | null = null;
    public static get instance(): PropSystem {
        if (!this._instance) this._instance = new PropSystem();
        return this._instance;
    }

    // 冰冻效果持续时间(秒)
    private FREEZE_DURATION = 2;
    // 记录被冰冻的士兵及其解冻时间
    private frozenSoldiers: Map<BaseSoldier, number> = new Map();

    //生成道具
    async takeProp(type: PropType) {
        switch (type) {
            case PropType.Freeze:
                this.freezeProp();
                break;
            case PropType.Heal:
                this.healProp();
                break;
            case PropType.Coin:
                this.coinProp();
                break;
        }
    }

    //冰冻道具
    freezeProp() {
        // console.log('冰冻士兵');
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('ice'), 1.0);
        const enemies = SoldierSystem.instance.getEnemySoldiers(Camp.Player);

        enemies.forEach(soldier => {
            // 如果士兵已被冰冻，刷新持续时间
            if (this.frozenSoldiers.has(soldier)) {
                this.frozenSoldiers.set(soldier, Date.now() + this.FREEZE_DURATION * 1000);
                return;
            }

            // 冰冻士兵
            soldier.setPaused(true);
            this.frozenSoldiers.set(soldier, Date.now() + this.FREEZE_DURATION * 1000);

            // 添加冰冻特效
            const freezeEffect = NodePoolManager.instance.getNode('freeze_effect', soldier.node);
            if (freezeEffect) {
                freezeEffect.setPosition(0, 0, 0);
                soldier.node.addChild(freezeEffect);

                // 记录特效节点，解冻时销毁
                soldier['_freezeEffect'] = freezeEffect;
            }
        });
    }

    update(dt: number) {
        if (GameManager.instance.isPaused) return;
        // 清理已解冻的士兵
        const currentTime = Date.now();
        for (const [soldier, unfreezeTime] of this.frozenSoldiers) {
            if (currentTime >= unfreezeTime) {
                soldier.setPaused(false);

                // 销毁冰冻特效
                if (soldier['_freezeEffect']) {
                    NodePoolManager.instance.putNode('freeze_effect', soldier['_freezeEffect']);
                    delete soldier['_freezeEffect'];
                }

                this.frozenSoldiers.delete(soldier);
            }
        }
    }

    //恢复生命道具
    healProp() {
        const allies = SoldierSystem.instance.getEnemySoldiers(Camp.Enemy); // 获取我方士兵
        AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('barrier'), 1.0);
        allies.forEach(soldier => {
            // 恢复50%血量
            const healAmount = Math.ceil(soldier.stats.hp * 0.5);
            soldier.stats.hp = Math.min(soldier.stats.hp + healAmount, soldier.stats.hp * 2);

            // 显示治疗效果
            const healEffect = NodePoolManager.instance.getNode('heal_effect', soldier.node);
            if (healEffect) {
                healEffect.setPosition(0, 0, 0);
                setTimeout(() => {
                    NodePoolManager.instance.putNode('heal_effect', healEffect);
                }, 1000);
            }
        });
    }

    //金币道具
    coinProp() {
        //TODO: 实现金币道具效果
    }

    //清除
    clearRecord() {
        this.frozenSoldiers.clear();
    }
}


