import { isValid, Label, tween, v3, Vec3, Node, Tween, Game } from "cc";
import { tgxModuleContext, tgxUIMgr } from "../../../../core_tgx/tgx";
import { GameUILayers } from "../../../../scripts/GameUILayers";
import { UI_Pause, UI_PowerUp } from "../../../../scripts/UIDef";
import { Layout_Pause } from "./Layout_Pause";
import { AliensAudioMgr } from "../../../Script/Manager/AliensAudioMgr";
import { GameManager } from "../../../Script/Manager/GameManager";

export class UI_Pause_Impl extends UI_Pause {

    constructor() {
        super('Prefab/UI/Pause/UI_Pause', GameUILayers.POPUP, Layout_Pause);
    }

    public getRes(): [] {
        return [];
    }

    protected onCreated(): void {
        let layout = this.layout as Layout_Pause;
        this.onButtonEvent(layout.btExit, () => {
            GameManager.instance.exitGame();
            AliensAudioMgr.playOneShot(AliensAudioMgr.getMusicPathByName('dianji'), 1.0);
            this.hide();
        });

        this.onButtonEvent(layout.btContinue, () => {
            GameManager.instance.resumeGame();
            this.hide();
        });
    }
}

tgxModuleContext.attachImplClass(UI_Pause, UI_Pause_Impl);