import { Node, Prefab, instantiate, NodePool } from 'cc';

export class NodePoolManager {
    private static _instance: NodePoolManager;
    public static get instance(): NodePoolManager {
        if (!this._instance) {
            this._instance = new NodePoolManager();
        }
        return this._instance;
    }

    private pools: Map<string, NodePool> = new Map();
    private prefabs: Map<string, Prefab> = new Map();

    public initPool(key: string, prefab: Prefab, initCount: number = 10) {
        const pool = new NodePool();
        this.pools.set(key, pool);
        this.prefabs.set(key, prefab);

        for (let i = 0; i < initCount; i++) {
            const node = instantiate(prefab);
            pool.put(node);
        }
    }

    public getNode(key: string, parent?: Node): Node {
        const pool = this.pools.get(key);
        const prefab = this.prefabs.get(key);
        if (!pool || !prefab) {
            throw new Error(`未初始化对象池：${key}`);
        }

        const node = pool.size() > 0 ? pool.get() : instantiate(prefab);
        if (parent) {
            parent.addChild(node);
        }
        return node;
    }

    public putNode(key: string, node: Node) {
        const pool = this.pools.get(key);
        if (!pool) {
            node.destroy();
            return;
        }
        pool.put(node);
    }

    public clearPool(key: string) {
        const pool = this.pools.get(key);
        pool?.clear();
    }
}
