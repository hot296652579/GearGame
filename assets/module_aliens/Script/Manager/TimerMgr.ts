import { assetManager, instantiate, Prefab, Node, UITransform, Vec3, Vec2, view, game, director, Scheduler, Label } from "cc";

import { GameUtil } from "../GameUtil";
import { AliensGlobalInstance } from "../AliensGlobalInstance";
import { tgxUIMgr } from "db://assets/core_tgx/tgx";
import { UI_TimeExpan, UI_BattleResult } from "db://assets/scripts/UIDef";
import { UserManager } from "./UserMgr";
import { LevelManager } from "./LevelMgr";
import { GlobalConfig } from "db://assets/start/Config/GlobalConfig";

/** 时间管理器*/
export class TimerMgr {
    private static _instance: TimerMgr;
    public static get Instance(): TimerMgr {
        if (this._instance == null) {
            this._instance = new TimerMgr();
        }
        return this._instance;
    }

    public static get inst(): TimerMgr {
        return this.Instance;
    }


    constructor() {
    }
}