import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/scan';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Action } from './action';
import { Reducer } from './reducer';

/**
 * Internal reset action type
 */
const RESET = '@@ngfk/RESET';

/**
 * Store class containing an action and a state stream. Actions can be
 * dispatched in a type safe manner to trigger state updates.
 */
export class Store<State, ActionMap> implements IStore<State, ActionMap> {
    /**
     * The action stream processing every action.
     */
    public action$: Observable<Action<any>>;

    /**
     * The state stream containing the latest state.
     */
    public state$: Observable<State>;

    /**
     * The current state.
     */
    public state: State;

    /**
     * The initial state, this is the state used by default on `Store.reset`.
     */
    protected initial: State;

    /**
     * The internal action BehaviorSubject, the `Store.action$` is created
     * from this action BehaviorSubject.
     */
    protected actionSubject: Subject<Action<any>>;

    /**
     * Creates a new instance of the Store class.
     * @param reducer The root reducer
     * @param initial The initial state
     */
    constructor(reducer: Reducer<State>, initial?: State) {
        // Extend the provided reducer with resetting functionality.
        const rootReducer = this.extendReducer(reducer);
        this.initial = initial || rootReducer();

        // Construct custom, shared, action$ using a new Subject.
        this.actionSubject = new Subject();
        this.action$ = this.actionSubject.asObservable();

        // Construct an Observable state$ by reducing/scanning the actions over
        // the current state.
        this.state$ = this.action$
            // Register reducers and set seed to the initial state
            .scan<Action<any>, State>(rootReducer, this.initial)
            // Ensure every subscriber shares the same stream and receives the
            // last available value on subscribe, similar to the event stream
            // of a BehaviorSubject.
            .multicast(new BehaviorSubject(this.initial));

        // The multicast operator returns a ConnectableObservable which must be
        // connected to the internal Subject to begin emitting items.
        (this.state$ as ConnectableObservable<State>).connect();

        // Subscribe to the state$ to update our internal reference to the
        // current state.
        this.subscribe(state => (this.state = state));
    }

    /**
     * Subscribes to the state stream. Shorthand notation for `Store.state$.subscribe`.
     * @param next Callback function performed on every next state
     * @param error Callback function performed on errors
     * @param complete Callback function performed on completion
     */
    public subscribe(
        next?: (value: State) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        // Forward callback functions to the state$
        return this.state$.subscribe(next, error, complete);
    }

    /**
     * Dispatches the provided action, triggering a state update. This method
     * enforces type safety.
     * @param type The action type
     * @param payload The action payload
     */
    public dispatch<Type extends keyof ActionMap>(
        type: Type,
        payload?: ActionMap[Type]
    ): void {
        // Pass the action to the action$ triggering a state update
        this.actionSubject.next({ type, payload });
    }

    /**
     * Selects a state property returning it as an Observable stream the caller
     * can subscribe to.
     * @param selector The selector function
     */
    public select<T>(selector: (state: State) => T): Observable<T> {
        return (
            this.state$
                // Map using the provided selector
                .map(selector)
                // Only emit updates when the selected property change
                .distinctUntilChanged()
        );
    }

    /**
     * Reset's the state to either the provided state or to the initial state.
     * @param state The new state
     */
    public reset(state = this.initial): void {
        this.actionSubject.next({ type: RESET, payload: state });
    }

    private extendReducer(originalReducer: Reducer<State>): Reducer<State> {
        // Construct and return a new reducer function
        return (state: State, action: Action<any>): State => {
            // If we receive a reset action, skip the originalReducer and
            // simply return the new state provided in the action payload.
            if (action && action.type === RESET) {
                return action.payload;
            }

            // The rest of the actions are forwarded to the originalReducer
            return originalReducer(state, action);
        };
    }
}

export interface IStore<S, A> {
    action$: Observable<Action<any>>;
    state$: Observable<S>;
    state: S;

    dispatch<Type extends keyof A>(type: Type, payload?: A[Type]): void;
    select<T>(selector: (state: S) => T): Observable<T>;
    reset(state?: S): void;

    subscribe(
        next?: (value: S) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription;
}
