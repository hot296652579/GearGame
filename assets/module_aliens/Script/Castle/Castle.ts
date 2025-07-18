import { _decorator, Component, Enum, Game, Node, ProgressBar } from 'cc';
import { Camp } from '../Soldier/ISoldierStats';
import { CastleManager } from './CastleManager';
import { GameManager } from '../Manager/GameManager';
import { UI_BattleResult } from 'db://assets/scripts/UIDef';
import { tgxUIMgr } from 'db://assets/core_tgx/tgx';
import { LevelManager } from '../Manager/LevelMgr';
const { ccclass, property } = _decorator;

@ccclass('Castle')
export class Castle extends Component {

    public maxHp: number = 100;

    @property({type: Enum(Camp)})
    public camp: Camp = Camp.Enemy;

    @property(ProgressBar)
    public hpBar: ProgressBar = null;

    private hp: number = 0;

    onLoad() {
    }

    setCastleHp(hp: number) {
        this.maxHp = hp;
        this.hp = hp;
        this.updateHpBar();
        console.log(`${Camp[this.camp]}城池初始HP设置为：${this.hp}`);
    }

    onDestroy() {
        CastleManager.instance.unregisterCastle(this.camp);
    }

    public takeDamage(amount: number) {
        if (GameManager.instance.isPaused) {
            return;
        }

        if (this.hp <= 0) {
            return; 
        }

        this.hp -= amount;
        // console.log(`${Camp[this.camp]}城池受到${amount}点伤害，剩余HP：${this.hp}`);
        this.updateHpBar();
        if (this.hp <= 0) {
            this.hp = 0;
            this.cityDestruction();
        }
    }

    updateHpBar() {
        const percent = this.hp / this.maxHp;
        this.hpBar.progress = percent;
    }

    private cityDestruction(){
        this.onDestroyed();

        GameManager.instance.gameOver();
        // 显示胜利或失败界面
        LevelManager.instance.levelModel.isWin = this.camp === Camp.Enemy ? true : false;

        const result = tgxUIMgr.inst.isShowing(UI_BattleResult);
        if (!result) {
            tgxUIMgr.inst.showUI(UI_BattleResult);
        }
    }

    private onDestroyed() {
        console.log(`${Camp[this.camp]}城池被摧毁！游戏结束`);
    }
}
