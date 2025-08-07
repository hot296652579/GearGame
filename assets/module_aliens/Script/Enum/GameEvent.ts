export class GameEvent {
    /** 通知UI实例化*/
    static readonly EVENT_UI_INITILIZE = 'EVENT_UI_INITILIZE';
    /** 游戏开始*/
    static readonly EVENT_GAME_START = 'EVENT_GAME_START';
    /** 进入游戏*/
    static readonly EVENT_GAME_ENTER = 'EVENT_GAME_ENTER';
    /** 回到主页HOME*/
    static readonly EVENT_GAME_BACK_HOME = 'EVENT_GAME_BACK_HOME';
    /** 游戏暂停*/
    static readonly EVENT_GAME_PAUSE = 'EVENT_GAME_PAUSE';

    /** 刷新玩家信息*/
    static readonly EVENT_REFRESH_PLAYER_INFO = 'EVENT_REFRESH_PLAYER_INFO';

    /**初始化剩余怪物 */
    static readonly EVENT_INIT_REMAIN_ENEMY = 'EVENT_INIT_REMAIN_ENEMY';

    /** 击杀最后一个怪物*/
    static readonly EVENT_LAST_ENEMY_KILLED = 'EVENT_LAST_ENEMY_KILLED';

    /** 游戏倒计时开始*/
    static readonly EVENT_GAME_COUNTDOWN_START = 'EVENT_GAME_COUNTDOWN_START';

    /** 播放开枪动画*/
    static readonly EVENT_PLAY_GUN_ANIMATION = 'EVENT_PLAY_GUN_ANIMATION';

    /** 瞄准镜头*/
    static readonly EVENT_CAMERA_AIM = 'EVENT_CAMERA_AIM';

    /** 取消瞄准*/
    static readonly EVENT_CAMERA_RESET_AIM = 'EVENT_CAMERA_RESET_AIM';

    /** 隐藏瞄准节点*/
    static readonly EVENT_CAMERA_HIDE_AIM = 'EVENT_CAMERA_HIDE_AIM';

    /** 爆头事件*/
    static readonly EVENT_CAMERA_HEADSHOT = 'EVENT_CAMERA_HEADSHOT';

    /** frame 触摸事件*/
    static readonly EVENT_FRAME_TOUCH_MOVE = 'EVENT_FRAME_TOUCH_MOVE';

    /** 发射射击*/
    static readonly EVENT_CAMERA_SHOOT = 'EVENT_CAMERA_SHOOT';

    /** 镜头切分事件*/
    static readonly EVENT_CAMERA_SPLIT = 'EVENT_CAMERA_SPLIT';

    /** 截图事件*/
    static readonly EVENT_CAMERA_SCREENSHOT = 'EVENT_CAMERA_SCREENSHOT';

    /** 侦探事件*/
    static readonly EVENT_CAMERA_SCREENSHOT_RADAR = 'EVENT_CAMERA_SCREENSHOT_RADAR';

    /** 取消侦探*/
    static readonly EVENT_CAMERA_SCREENSHOT_RADAR_CANCEL = 'EVENT_CAMERA_SCREENSHOT_RADAR_CANCEL';

    /** 相机对准目标*/
    static readonly EVENT_CAMERA_SCREENSHOT_RADAR_LOCK = 'EVENT_CAMERA_SCREENSHOT_RADAR_LOCK';

    /** 击中文本提示测试*/
    static readonly EVENT_CAMERA_SHOOT_TEXT = 'EVENT_CAMERA_SHOOT_TEXT';

    /** 击中了怪物 外星人*/
    static readonly EVENT_CAMERA_SHOOT_ENEMY = 'EVENT_CAMERA_SHOOT_ENEMY';

    /** 显示游戏结算*/
    static readonly EVENT_SHOW_GAME_RESULT = 'EVENT_SHOW_GAME_RESULT';

    /** 闯关失败 关卡重载*/
    static readonly EVENT_BATTLE_FAIL_LEVEL_RESET = 'EVENT_BATTLE_FAIL_LEVEL_RESET';
}