
import { _decorator, assetManager, Camera, Component, find, Label, Node, Prefab } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AliensGlobalInstance')
export class AliensGlobalInstance extends Component {
    private static _instance: AliensGlobalInstance;
    public static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new AliensGlobalInstance();
        return this._instance;
    }

    public async initUI() {
        this.camera = find("Canvas/Camera").getComponent(Camera)!;
        this.homeUI = find("Canvas/HomeUI")!; //主界面UI
        this.homeArm = find("Canvas/HomeUI/HomeArm")!; //主界面兵种UI
        this.homeBattle = find("Canvas/HomeUI/HomeBattle")!; //主界面战斗UI
        this.gameBattle = find("Canvas/BattleUI")!; //游戏界面战斗UI
        this.gameGrids = find("Canvas/BattleUI/Gears/Grids")!; //游戏战斗格子UI
        this.homeTop = find("Canvas/TopLeft")!;
        this.battleTop = find("Canvas/BattleUI/BattleTop")!; 
        this.bottomShop = find("Canvas/BattleUI/BottomShop")!; //齿轮商店
    }

    public camera: Camera = null!; //相机
    public homeUI: Node = null!;   //主界面UI   
    public homeArm: Node = null!;   //主界面兵种UI
    public homeBattle: Node = null!;  //主界面战斗UI
    public gameBattle: Node = null!;  //游戏界面战斗UI
    public gameGrids: Node = null!;    //游戏战斗格子UI
    public homeTop: Node = null!;   //主界面顶部UI
    public battleTop: Node = null!;   //战斗面顶部UI
    public bottomShop: Node = null!;   //齿轮商店
}


