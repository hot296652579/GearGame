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
import { AliensGlobalInstance } from '../AliensGlobalInstance';
import { GearGrids } from '../Gear/GearGrids';
import { BattleTop } from '../UI/BattleTop';
import { HomeTop } from '../UI/HomeTop';
import { AliensAudioMgr } from './AliensAudioMgr';

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

    @property(Prefab) glodPrefab: Prefab;
    @property(Prefab) legPrefab: Prefab;
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
        NodePoolManager.instance.initPool('gold', this.glodPrefab, 20);
        NodePoolManager.instance.initPool('leg', this.legPrefab, 20);
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
        const bottomShop = this.bottomShop.getComponent(BottomShop);
        if (bottomShop) {
            bottomShop.riseUp();
        }
        this.pauseGame();
        CastleManager.instance.initLevelCastleHp();
    }

    /**
     * 开始敌人波次生成
     */
    public startEnemyWaves() {
        this._isWaveRunning = true;
        this.scheduleAllWaves();
    }

    /** 检测敌方剩余士兵*/
    public checkEnemySoldiers() {
        const zero = SoldierSystem.instance.checkEnemySoldiers();
        if (zero) {
            this.pauseGame();
            const bottomShop = this.bottomShop.getComponent(BottomShop);
            if (bottomShop) {
                bottomShop.riseUp();
            }
        }
    }

    // 敌人波次相关属性和方法
    private _totalWaves: number = 0;
    private _currentWave: number = 0;
    private _waveTimers: { timer: number, startTime: number, delay: number }[] = []; // 数组存储多个波次计时器
    private _isWaveRunning: boolean = false;
    private _pausedTime: number = 0;

    // 暂停游戏
    public pauseGame() {
        this._isPaused = true;
        this.updateSoldiersPauseState();
        this._pausedTime = Date.now();
        this._waveTimers.forEach(wave => {
            if (wave.timer) {
                clearTimeout(wave.timer);
                wave.delay -= (this._pausedTime - wave.startTime); // 计算剩余延迟时间
            }
        });
    }

    // 恢复游戏
    public resumeGame() {
        this._isPaused = false;
        this.updateSoldiersPauseState();
        const now = Date.now();

        this._waveTimers.forEach(wave => {
            if (wave.delay > 0) {
                wave.startTime = now;
                wave.timer = setTimeout(() => {
                    const levelModel = LevelManager.instance.levelModel;
                    const waveConfig = levelModel.getCurrentWaveConfig();
                    const waveIndex = this._waveTimers.indexOf(wave);
                    this.spawnWaveEnemies(waveConfig.waves[waveIndex]);
                }, wave.delay);
            }
        });
    }

    // 调度所有波次敌人
    private scheduleAllWaves() {
        const levelModel = LevelManager.instance.levelModel;
        const waveConfig = levelModel.getCurrentWaveConfig();

        this.clearAllWaves();
        this._waveTimers = []; // 清空计时器数组

        // 调度所有波次
        waveConfig.waves.forEach((wave, index) => {
            const timer = setTimeout(() => {
                this.spawnWaveEnemies(wave);
                this._currentWave++;
                console.log(`Wave ${this._currentWave} started`);
            }, wave.delay * 1000);

            this._waveTimers.push({
                timer: timer,
                startTime: Date.now(),
                delay: wave.delay * 1000
            });
        });

        this._totalWaves = waveConfig.waves.length;
    }

    //清除所有定时器
    public clearAllWaves() {
        this._waveTimers.forEach(wave => {
            if (wave.timer) {
                clearTimeout(wave.timer);
            }
        });
        this._waveTimers = [];
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
                        const levelModel = LevelManager.instance.levelModel;
                        soldierComp.stats.level = levelModel.gameLevel;
                        console.log(`当前敌人士兵等级:${soldierComp.stats.level}`);
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
        this.clearAllWaves();
        this._currentWave = 0;
    }

    /**游戏重置*/
    public resetGame() {
        this.clearBattlefield();
        LevelManager.instance.clearLevelData();

        const grids = AliensGlobalInstance.instance.gameGrids;
        grids.getComponent(GearGrids).clearAllGrid();

        const battleTop = AliensGlobalInstance.instance.battleTop;
        battleTop.getComponent(BattleTop).resetExp();
    }

    /**退出游戏*/
    public exitGame() {
        AliensAudioMgr.play(AliensAudioMgr.getMusicPathByName('bgm'), 1.0);
        this.gameOver();
        this.resetGame();

        const battleUI = AliensGlobalInstance.instance.gameBattle;
        const homeUI = AliensGlobalInstance.instance.homeUI;
        const homeTop = AliensGlobalInstance.instance.homeTop;
        battleUI.active = false;
        homeUI.active = true;
        homeTop.getComponent(HomeTop).updateGold();
    }
}
