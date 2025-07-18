
import { JsonUtil } from "db://assets/core_tgx/base/utils/JsonUtil";

export class Tablelevels_config {
    static TableName: string = "levels_config";

    private data: any;

    init(id: number) {
        const table = JsonUtil.get(Tablelevels_config.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 场景 */
    get level(): string {
        return this.data.level;
    }
    /** 关卡时长 */
    get eliminate(): number {
        return this.data.eliminate;
    }
    /** 关卡奖励 */
    get target(): number {
        return this.data.target;
    }
    /** 是否参与随机 */
    get random(): number {
        return this.data.random;
    }
}
    