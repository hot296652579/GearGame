/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2025-08-06 21:48:36
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2025-08-06 22:31:28
 * @FilePath: /GearGame/assets/module_aliens/RoosterAliens.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node, Toggle, ToggleContainer } from 'cc';
import { AliensGlobalInstance } from './Script/AliensGlobalInstance';
import { LevelManager } from './Script/Manager/LevelMgr';
import { UserManager } from './Script/Manager/UserMgr';
const { ccclass, property } = _decorator;

@ccclass('RoosterAliens')
export class RoosterAliens extends Component {

    @property(ToggleContainer)
    toggleContainer: ToggleContainer = null;

    @property(Node)
    homeArm: Node = null; //主界面兵种UI

    @property(Node)
    homeBattle: Node = null; //主界面战斗UI

    onLoad() {
        // AliensAudioMgr.play(AliensAudioMgr.getMusicPathByName('bgm'), 1.0);
        UserManager.instance.initilizeModel();
        LevelManager.instance.initilizeModel();
        AliensGlobalInstance.instance.initUI();
        this.registerListener();
        this.resetMgr();

        // 默认显示战斗UI
        AliensGlobalInstance.instance.homeBattle.active = true;
        AliensGlobalInstance.instance.homeArm.active = false;
        AliensGlobalInstance.instance.gameBattle.active = false;
    }

    onToggleContainerClick(toggle: Toggle) {
        this.homeBattle.active = (toggle.node.name === 'ToggleBattle');
        this.homeArm.active = (toggle.node.name === 'ToggleArm');
    }

    private resetMgr() {
    }

    protected start(): void {

    }

    registerListener() {

    }



}




