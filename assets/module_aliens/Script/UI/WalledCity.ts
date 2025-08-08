import { _decorator, CCFloat, Component, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { LevelManager } from '../Manager/LevelMgr';
import { UserManager } from '../Manager/UserMgr';
const { ccclass, property } = _decorator;

@ccclass('WalledCity')
export class WalledCity extends Component {

    @property(Sprite)
    city1: Sprite = null!;
    @property(Sprite)
    city1Left: Sprite = null!;

    @property(SpriteFrame)
    city1Frames: SpriteFrame[] = [];
    @property(SpriteFrame)
    cityLeftFrames: SpriteFrame[] = [];

    @property(Sprite)
    city2: Sprite = null!;
    @property(Sprite)
    city2Left: Sprite = null!;

    protected onEnable(): void {
        let castleLevel = UserManager.instance.userModel.getCastleLevel();
        // castleLevel = 3;

        if(castleLevel < 3){
            this.city1.spriteFrame = this.city1Frames[0];
            this.city1Left.spriteFrame = this.cityLeftFrames[0];

            this.city1.node.setPosition(-330,-450,0);
            const soldiers = this.city1.node.getChildByName("Soldiers");
            const bar = this.city1.node.getChildByName("ProgressBar");
            const castleLeft = this.city1.node.getChildByName("CastleLeft");
            soldiers.setPosition(-50,-35,0);
            bar.setPosition(35,160,0);
            castleLeft.setPosition(-85,-5,0);
        }
        else if(castleLevel >= 3 && castleLevel < 7){
            this.city1.spriteFrame = this.city1Frames[1];
            this.city1Left.spriteFrame = this.cityLeftFrames[1];

            this.city1.node.setPosition(-270,-420,0);
            const soldiers = this.city1.node.getChildByName("Soldiers");
            const bar = this.city1.node.getChildByName("ProgressBar");
            const castleLeft = this.city1.node.getChildByName("CastleLeft");
            soldiers.setPosition(-100,-60,0);
            bar.setPosition(-30,160,0);
            castleLeft.setPosition(-109,-5,0);
        }else if(castleLevel >= 7){
            this.city1.spriteFrame = this.city1Frames[2];
            this.city1Left.spriteFrame = this.cityLeftFrames[2];

            this.city1.node.getComponent(UITransform).setContentSize(180,322);
            this.city1Left.node.getComponent(UITransform).setContentSize(266,369);

            this.city1.node.setPosition(-240,-420,0);
            const soldiers = this.city1.node.getChildByName("Soldiers");
            const bar = this.city1.node.getChildByName("ProgressBar");
            const castleLeft = this.city1.node.getChildByName("CastleLeft");
            soldiers.setPosition(-100,-60,0);
            bar.setPosition(-50,220,0);
            castleLeft.setPosition(-135,23,0);
        }

        let gameLevel = LevelManager.instance.levelModel.gameLevel;
        // gameLevel = 3;

        if(gameLevel < 3){
            this.city2.spriteFrame = this.city1Frames[0];
            this.city2Left.spriteFrame = this.cityLeftFrames[0];

            this.city2.node.setPosition(350,-450,0);
            const soldiers = this.city2.node.getChildByName("Soldiers");
            const bar = this.city2.node.getChildByName("ProgressBar");
            const castleLeft = this.city2.node.getChildByName("CastleLeft");
            soldiers.setPosition(-50,-35,0);
            bar.setPosition(50,160,0);
            castleLeft.setPosition(-80,0,0);
        }else if(gameLevel >= 3 && gameLevel < 7){
            this.city2.spriteFrame = this.city1Frames[1];
            this.city2Left.spriteFrame = this.cityLeftFrames[1];

            this.city2.node.setPosition(300,-420,0);
            const soldiers = this.city2.node.getChildByName("Soldiers");
            const bar = this.city2.node.getChildByName("ProgressBar");
            const castleLeft = this.city2.node.getChildByName("CastleLeft");
            soldiers.setPosition(-100,-60,0);
            bar.setPosition(-30,160,0);
            castleLeft.setPosition(-109,-5,0);
        }else if(gameLevel >= 7){
            this.city2.spriteFrame = this.city1Frames[2];
            this.city2Left.spriteFrame = this.cityLeftFrames[2];

            this.city2.node.getComponent(UITransform).setContentSize(180,322);
            this.city2Left.node.getComponent(UITransform).setContentSize(266,369);

            this.city2.node.setPosition(270,-420,0);
            const soldiers = this.city2.node.getChildByName("Soldiers");
            const bar = this.city2.node.getChildByName("ProgressBar");
            const castleLeft = this.city2.node.getChildByName("CastleLeft");
            soldiers.setPosition(-100,-60,0);
            bar.setPosition(-50,220,0);
            castleLeft.setPosition(-135,23,0);
        }
    }

}


