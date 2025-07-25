import { _decorator, assetManager, Component, director, game, Label, Prefab, Node, AssetManager, Asset, PhysicsSystem, PhysicsSystem2D, EPhysics2DDrawFlags, AudioClip, ProgressBar, SpriteFrame } from 'cc';
import { tgxModuleContext, tgxUIMgr, tgxUITips, tgxUIWaiting } from '../core_tgx/tgx';
import { GameUILayers, GameUILayerNames } from '../scripts/GameUILayers';

import { ModuleDef } from '../scripts/ModuleDef';
import { SceneDef } from '../scripts/SceneDef';
import { JsonUtil } from '../core_tgx/base/utils/JsonUtil';
import { GtagMgr, GtagType } from '../core_tgx/base/GtagMgr';
import { AdvertMgr } from '../core_tgx/base/ad/AdvertMgr';
import { GlobalConfig } from './Config/GlobalConfig';
import { GlobalMgr } from '../scripts/GlobalMgr';
const { ccclass, property } = _decorator;

const _preloadBundles = [ModuleDef.BASIC, ModuleDef.MODULE_ALIENS];

const _preloadRes = [
    { bundle: ModuleDef.BASIC, url: 'ui_alert/UI_Alert', type: 'prefab' },
    { bundle: ModuleDef.BASIC, url: 'ui_tips/UI_Tips', type: 'prefab' },
    { bundle: ModuleDef.BASIC, url: 'ui_waiting/UI_Waiting', type: 'prefab' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Prefabs/UI/Result/UI_BattleResult', type: 'prefab' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Prefabs/UI/Gambit/UI_BattleGambit', type: 'prefab' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Prefabs/UI/PowerUp/UI_PowerUp', type: 'prefab' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Prefabs/UI/TimeExpan/UI_TimeExpan', type: 'prefab' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Prefabs/Levels/level', type: 'prefab' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/bgm1.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/dianji.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/shengli.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/shibai.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/kaiqiang.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/miaozhun.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/qiangbao.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/tance.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/jibi.mp3', type: 'audio' },
    { bundle: ModuleDef.MODULE_ALIENS, url: 'Audio/chaofeng.mp3', type: 'audio' },
];

const _loadingText = ['Loading.', 'Loading..', 'Loading...'];
const _totalNum = _preloadBundles.length + _preloadRes.length + 1;

@ccclass('Start')
export class Start extends Component {
    @property(Label)
    txtLoading: Label;

    @property(Prefab)
    uiCanvasPrefab: Prefab;

    // @property(Node)
    // loadingBar: Node;

    @property(ProgressBar)
    loadingBar: ProgressBar = null!;

    private _percent: string = '';
    private _numCurrentLoaded = 0;

    protected onLoad(): void {
        GlobalMgr.instance.initilize();
        // GlobalMgr.instance.timeTest();

        AdvertMgr.instance.initilize();
        try {
            window["__woso"]?.["TopCallback"]?.();
        } catch (error) {

        }

        if (!GlobalConfig.isDebug) {
            AdvertMgr.instance.showInterstitial();
        }

        window.addEventListener("beforeunload", () => {
            const timestamp = Date.now(); // 获取当前时间戳（毫秒）
            localStorage.setItem("lastLeaveTime", timestamp.toString());
        });
    }

    start() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;

        PhysicsSystem2D.instance.debugDrawFlags = 1; // 启用调试绘制

        tgxModuleContext.setDefaultModule(ModuleDef.BASIC);

        game.frameRate = 60;
        tgxUIMgr.inst.setup(this.uiCanvasPrefab, GameUILayers.NUM, GameUILayerNames);

        this.preloadBundle(0);
        GtagMgr.inst.init();
        this.loadConfig();
        GtagMgr.inst.doGameDot(GtagType.game_start);
    }

    async loadConfig() {
        await this.loadCustom();
    }

    loadCustom() {
        return new Promise(async (resolve, reject) => {
            await JsonUtil.loadDirAsync();
            resolve(null);
        });
    }

    onResLoaded() {
        this._numCurrentLoaded++;
        this._percent = ~~(this._numCurrentLoaded / _totalNum * 100) + '%';
    }

    preloadBundle(idx: number) {
        assetManager.loadBundle(_preloadBundles[idx], null, (err, bundle) => {
            console.log('module:<' + _preloadBundles[idx] + '>loaded.');
            idx++;
            this.onResLoaded();
            if (idx < _preloadBundles.length) {
                this.preloadBundle(idx);
            }
            else {
                this.preloadRes(0);
            }
        });
    }

    preloadRes(idx: number) {
        let res = _preloadRes[idx];
        // console.log('预加载资源：' + res.url);
        let bundle = assetManager.getBundle(res.bundle);

        let onComplete = () => {
            idx++;
            this.onResLoaded();
            if (idx < _preloadRes.length) {
                this.preloadRes(idx);
            }
            else {
                this.onPreloadingComplete();
            }
        }
        if (bundle) {
            if (res.type == 'prefab') {
                bundle.preload(res.url, Prefab, onComplete);
            } else if (res.type == 'audio') {
                bundle.preload(res.url, AudioClip, onComplete);
            } else if (res.type == 'sprite') {
                bundle.preload(res.url, SpriteFrame, onComplete);
            }
        }
    }

    onPreloadingComplete() {
        let bundle = assetManager.getBundle(ModuleDef.MODULE_ALIENS);
        bundle.preloadScene(SceneDef.ROOSTER_HOLE, () => {
            this.onResLoaded();
            // director.loadScene(SceneDef.MAIN_MENU);

            const info = {
                bundle: 'module_aliens',
                entryScene: 'rooster_aliens'
            }
            tgxUIWaiting.show();
            assetManager.loadBundle(info.bundle, (err, bundle: AssetManager.Bundle) => {
                if (bundle) {
                    director.loadScene(info.entryScene, () => {
                        tgxUIMgr.inst.hideAll();
                    });
                }
            });
        });
    }

    update(deltaTime: number) {
        if (this._percent) {
            this.txtLoading.string = 'Loading...' + this._percent;
        }
        else {
            let idx = Math.floor(game.totalTime / 1000) % 3;
            this.txtLoading.string = _loadingText[idx];
        }
        // this.loadingBar.setScale(this._numCurrentLoaded / _totalNum, 1, 1);
        this.loadingBar.progress = this._numCurrentLoaded / _totalNum;
    }
}


