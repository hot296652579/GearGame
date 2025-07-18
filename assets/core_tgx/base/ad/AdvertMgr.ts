import { _decorator, Node, Prefab, instantiate, Component, Camera, UITransform, v3, game, view, screen, tween, Vec3 } from 'cc';

import { tgxUITips } from 'db://assets/core_tgx/tgx';
import { GtagMgr, GtagType } from 'db://assets/core_tgx/base/GtagMgr';
const { ccclass, property } = _decorator;

/** 广告管理*/
@ccclass('AdvertMgr')
export class AdvertMgr {
    private static _instance: AdvertMgr | null = null;
    public static get instance(): AdvertMgr {
        if (!this._instance) this._instance = new AdvertMgr();
        return this._instance;
    }

    adInstance: any = null;
    gtag: any = null;
    openAd: boolean = true;

    initilize(): void {
        this.adInstance = (window as any)['adInstance'];
        // console.log('ad sdk初始化');
        // console.log(this.adInstance);
    }

    /** 显示插屏广告*/
    showInterstitial(cb?: () => void): void {

        try {
            window['showAd']('interstitial').then(() => {

            }).catch(() => {
                // GtagMgr.inst.doGameDot(GtagType.ad_error);
            });
        } catch (error) {
            // tgxUITips.show('The ad failed to load')
        }
    }

    /** 显示激励广告*/
    showReawardVideo(cb?: () => void): void {

        try {
            window["showAd"]('rewarded')
                .then(() => {
                    if (cb) cb();
                })
                .catch(() => {
                    tgxUITips.show('The ad failed to load');
                    //上报信息
                    // GtagMgr.inst.doGameDot(GtagType.ad_error);
                    // cb && cb();
                })
            return
        } catch (error) {

        }
        tgxUITips.show('The ads failed to load');
    }
}
