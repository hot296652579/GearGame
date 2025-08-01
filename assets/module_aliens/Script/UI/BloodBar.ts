import { _decorator, Component, Label, Node, ProgressBar, tween, Vec3 } from 'cc';
import { NodePoolManager } from '../NodePoolManager';
import { BaseSoldier } from '../Soldier/SoldierBase';
import { Camp } from '../Soldier/ISoldierStats';
const { ccclass, property } = _decorator;

@ccclass('BloodBar')
export class BloodBar extends Component {

    @property(ProgressBar)
    public progressBar: ProgressBar = null; //血量进度条

    private _duration: number = 0.2; // 动画持续时间

    /**显示当前血量进度*/
    showBloodProgress(currentHp: number, maxHp: number) {
        if (!this.progressBar) return;
        // console.log('显示当前血量进度:',currentHp,maxHp);
        //计算当前进度 保留一位小数
        const progress = Math.round((currentHp / maxHp) * 100) / 100;

        // 播放动画
        tween(this.progressBar)
            .to(this._duration, { progress: progress }) 
            .start(); 
        
    }
}


