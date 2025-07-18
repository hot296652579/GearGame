import { _decorator, Component, Prefab, Node, Vec3, instantiate } from 'cc';
import { SoldierSystem } from '../Soldier/SoldierSystem';
import { NodePoolManager } from '../NodePoolManager';
import { SoldierType } from '../Enum/GameEnums';
import { Castle } from '../Castle/Castle';
import { Camp } from '../Soldier/ISoldierStats';
import { CastleManager } from '../Castle/CastleManager';
import { BaseSoldier } from '../Soldier/SoldierBase';
import { BottomShop } from '../UI/BottomShop';
import { IWaveConfig, LevelModel } from '../Model/LevelModel';
import { LevelManager } from './LevelMgr';
import { PropSystem } from '../Prop/PropSystem';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // 暂停状态
    private _isPaused: boolean = false;
    public get isPaused(): boolean {
        return this._isPaused;
    }
    public set isPaused(value: boolean) {
        this._isPaused = value;
    }
    
    @property(Prefab) bulletPrefab: Prefab;
    @property(Prefab) bowPrefab: Prefab;
    @property(Prefab) meleePrefab: Prefab;
    @property(Prefab) rangedPrefab: Prefab;
    @property(Prefab) superPrefab: Prefab;
    @property(Prefab) bloodPrefab: Prefab;
    @property(Prefab) freezePrefab: Prefab;
    @property(Prefab) healPrefab: Prefab;

    @property(Node) playerCastle: Node;
    @property(Node) enemyCastle: Node;
    @property(Node) bottomShop: Node;  //齿轮商店

    private static _instance: GameManager;
    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    onLoad() {
        this.initPools();
        this.registerCastles();
        SoldierSystem.instance.init(); // 💡 初始化 SoldierSystem
    }

    // 确保在场景加载时设置实例
    start() {
        GameManager._instance = this;
    }

    initPools() {
        NodePoolManager.instance.initPool('bullet', this.bulletPrefab, 20);
        NodePoolManager.instance.initPool('bow', this.bowPrefab, 20);
        NodePoolManager.instance.initPool(SoldierType.Melee, this.meleePrefab, 10);
        NodePoolManager.instance.initPool(SoldierType.Ranged, this.rangedPrefab, 10);
        NodePoolManager.instance.initPool(SoldierType.Super, this.superPrefab, 10);
        NodePoolManager.instance.initPool('blood', this.bloodPrefab, 10);
        NodePoolManager.instance.initPool('freeze_effect', this.freezePrefab, 10);
        NodePoolManager.instance.initPool('heal_effect', this.healPrefab, 10);
    }

    registerCastles() {
        const playerCastleComp = this.playerCastle.getComponent(Castle);
        playerCastleComp.camp = Camp.Player;
        CastleManager.instance.registerCastle(Camp.Player, playerCastleComp);

        const enemyCastleComp = this.enemyCastle.getComponent(Castle);
        enemyCastleComp.camp = Camp.Enemy;
        CastleManager.instance.registerCastle(Camp.Enemy, enemyCastleComp);
    }

    clearBattlefield() {
        SoldierSystem.instance.clearAllSoldiers();
    }

    /**
     * 暂停游戏
     */
    public pauseGame() {
        this._isPaused = true;
        this.updateSoldiersPauseState();
    }

    /**
     * 恢复游戏
     */
    public resumeGame() {
        this._isPaused = false;
        this.updateSoldiersPauseState();
    }

    /**
     * 更新所有士兵的暂停状态
     */
    private updateSoldiersPauseState() {
        // 处理我方士兵
        this.updateCampSoldiersPauseState(SoldierSystem.instance.soldierParentSelf);
        // 处理敌方士兵
        this.updateCampSoldiersPauseState(SoldierSystem.instance.soldierParentEnemy);
    }

    /**
     * 更新指定阵营士兵的暂停状态
     */
    private updateCampSoldiersPauseState(parentNode: Node) {
        parentNode.children.forEach(child => {
            const soldier = child.getComponent(BaseSoldier);
            if (soldier) {
                soldier.setPaused(this._isPaused);
            }
        });
    }

    /**
     * 开始游戏
     */
    public startGame() {
        const bottomShop = this.bottomShop.getComponent(BottomShop) ;
        if (bottomShop) {
            bottomShop.riseUp();
        }
        this.pauseGame();
        CastleManager.instance.setLevelCastleHp();
    }

    /** 检测敌方剩余士兵*/
    public checkEnemySoldiers() {
       const zero = SoldierSystem.instance.checkEnemySoldiers(); 
       if(zero) {
            this.pauseGame();
            const bottomShop = this.bottomShop.getComponent(BottomShop);
            if (bottomShop) {
                bottomShop.riseUp();
            } 
       }
    }

    // 敌人波次相关属性和方法
    private _totalWaves: number = 0; // 总波次数
    private _waveTimer: number = 0;
    private _isWaveRunning: boolean = false;

    /**
     * 开始敌人波次生成
     */
    public startEnemyWaves() {
        this._isWaveRunning = true;
        this.scheduleAllWaves();
    }

    /**
     * 调度所有波次敌人
     */
    private scheduleAllWaves() {
        const levelModel = LevelManager.instance.levelModel;
        const waveConfig = levelModel.getCurrentWaveConfig();
        
        // 清除之前的定时器
        if (this._waveTimer) {
            clearTimeout(this._waveTimer);
        }

        // 调度所有波次
        waveConfig.waves.forEach((wave, index) => {
            this._waveTimer = setTimeout(() => {
                this.spawnWaveEnemies(wave);
                // console.log(`第${index + 1}波敌人已生成`);
            }, wave.delay * 1000);
        });

        this._totalWaves = waveConfig.waves.length;
    }

    /**
     * 生成一波敌人
     */
    private spawnWaveEnemies(wave: IWaveConfig['waves'][0]) {
        wave.enemies.forEach(enemy => {
            for (let i = 0; i < enemy.count; i++) {
                setTimeout(() => {
                    const soldier = SoldierSystem.instance.spawnSoldier(enemy.type, Camp.Enemy);
                    const soldierComp = soldier.getComponent(BaseSoldier);
                    if (soldierComp) {
                        soldierComp.stats.level = enemy.level;
                    }
                }, i * 500); // 每个敌人生成间隔0.5秒
            }
        });
    }

    // 在update中检查波次状态
    update(deltaTime: number) {
        if (this._isWaveRunning) {
            // 可以在这里添加波次状态检查逻辑
        }

        PropSystem.instance.update(deltaTime);
    }

    /**游戏结束*/
    public gameOver() {
        this.pauseGame(); 
    }

    //测试接口直接生成士兵
    public testSpawnSoldier() {
        const soldierTypes = [SoldierType.Melee, SoldierType.Super, SoldierType.Ranged];
        const randomType = soldierTypes[0];
        SoldierSystem.instance.spawnSoldier(randomType, Camp.Enemy);
        SoldierSystem.instance.spawnSoldier(randomType, Camp.Player);
    }
}
