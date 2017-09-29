import { Action } from './action';
import { Reducer, SubReducer } from './reducer';

/**
 * Utility class used to build a reducer in a type safe manner.
 */
export class ReducerBuilder<State, ActionMap> {
    private initial: State;
    private cases: {
        [type: string]: SubReducer<State, ActionMap, keyof ActionMap>;
    };

    /**
     * Sets an initial state for the reducer.
     * @param initial The initial state
     */
    public init(initial: State): this {
        return this;
    }

    /**
     * Links the provided action type with the sub-reducer function.
     * @param type The action type
     * @param reducer The sub-reducer function
     */
    public case<Type extends keyof ActionMap>(
        type: Type,
        reducer: SubReducer<State, ActionMap, Type>
    ): this {
        this.cases[type] = reducer;
        return this;
    }

    /**
     * Links the provided action type with the sub-reducer function, without
     * performing type checks.
     * @param type The action type
     * @param reducer The sub-reducer function
     */
    public external(type: string, reducer: SubReducer<State, any, any>): this {
        this.cases[type] = reducer;
        return this;
    }

    /**
     * Build the reducer.
     */
    public build(): Reducer<State> {
        // An initial action is created to allow the reducer to be called
        // without parameters, returning the initial state.
        const initialAction: Action<any> = {
            type: '',
            payload: {}
        };

        return (state = this.initial, action = initialAction): State => {
            const handler = this.cases[action.type];

            // Execute the handler to retrieve the new state or, if no handler
            // is found, return the state as is.
            return handler
                ? handler(state, action.payload, action as any)
                : state;
        };
    }
}

/**
 * Creates a reducer in a type safe manner.
 * @param initial The initial state
 * @param cases The action handlers
 */
export const createReducer = <State, ActionMap>(
    initial: State,
    cases: { [type in keyof ActionMap]: SubReducer<State, ActionMap, type> }
): Reducer<State> => {
    // Create a reducer builder and set it's properties
    const builder = new ReducerBuilder<State, ActionMap>().init(initial);
    Object.keys(cases).forEach(type =>
        builder.external(type, cases[type as any])
    );

    // Build & return the reducer
    return builder.build();
};
