export interface Action<Payload = {}> {
    readonly type: string;
    readonly payload: Payload;
}

export interface TypedAction<Type extends string, Payload = {}>
    extends Action<Payload> {
    readonly type: Type;
}
