export type ReactTestChild = string | ReactTestInstance;
export interface ReactTestInstance {
    readonly type: string | object;
    readonly children: readonly ReactTestChild[];
    findAll(predicate: (node: ReactTestInstance) => boolean): ReactTestInstance[];
}
export declare function text(node: ReactTestInstance): string;
export declare function textOf(node: ReactTestInstance): string;
export declare function findButtonByText(root: ReactTestInstance, label: string): ReactTestInstance;
export declare function flush(): Promise<void>;
//# sourceMappingURL=react-test.d.ts.map