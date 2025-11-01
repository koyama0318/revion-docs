---
sidebar_position: 2
---

# Quick Start

CQRS and Event Sourcing are powerful architectural patterns that enable clear separation of business logic.
However, they require setup of message buses and event stores, and understanding of multiple abstraction layers, making it difficult to take the first step.

**revion.js** was designed to solve these challenges.
You can immediately experience the CQRS + Event Sourcing flow simply by defining types and combining functions.

In this chapter, you'll learn by actually running the **Command → Event → State** flow with a minimal `counter` domain.

A type-safe CQRS application will be complete in the following 3 steps:

1. Define types
2. Define behavior
3. Build and execute the Aggregate

Let's get started.

## Step 1 - Define the Domain with Types

In CQRS, the core elements of the application are expressed through 3 types:

- **State**: The current state
- **Command**: What you want to do
- **Event**: What happened

Simply by defining these three, the structure of the domain becomes clear.

```ts
export type CounterState = {
  type: "active";
  id: CounterId;
  count: number;
};

export type CounterCommand =
  | { type: "initialize"; id: CounterId; payload: { count: number } }
  | { type: "increment"; id: CounterId }
  | { type: "decrement"; id: CounterId };

export type CounterEvent =
  | { type: "initialized"; id: CounterId; payload: { count: number } }
  | { type: "incremented"; id: CounterId }
  | { type: "decremented"; id: CounterId };
```

Command is an "instruction," Event is a "result," and State is an "accumulation of results."
By using TypeScript's tagged unions, you can define all cases with types.

This allows you to express the domain's intent through **the types themselves** rather than comments.

## Step 2 - Define Behavior (EventDecider / Reducer)

Next, you'll implement the system's behavior concretely.
Create two components: `EventDecider` that converts Commands to Events, and `Reducer` that updates State with Events.

### EventDecider — Convert Command to Event

```ts
const decider: EventDecider<CounterState, CounterCommand, CounterEvent> = {
  initialize: ({ command }) => ({
    type: "initialized",
    id: command.id,
    payload: { count: command.payload.count },
  }),
  increment: ({ command }) => ({
    type: "incremented",
    id: command.id,
  }),
  decrement: ({ command }) => ({
    type: "decremented",
    id: command.id,
  }),
};
```

Command is an instruction indicating "what you want to do."
`EventDecider` receives it and determines the Event that should actually occur.
This is based on Event Sourcing's principle that "all changes are recorded as Events," and it plays the role of persisting Command execution results as explicit Events.

### Reducer — Update State with Event

```ts
const reducer: Reducer<CounterState, CounterEvent> = {
  initialized: ({ state, event }) => {
    state.type = "active";
    state.count = event.payload.count;
  },
  incremented: ({ state }) => {
    state.count += 1;
  },
  decremented: ({ state }) => {
    state.count -= 1;
  },
};
```

`Reducer` defines "how the state changes as a result of an Event occurring."
In Event Sourcing, all Events are saved as history, and `Reducer` reconstructs the latest state by applying (replaying) them in order.
Additionally, by using the same logic during Command execution, it verifies state consistency and prevents invalid operations.

By combining these two functions, the flow of **"Command → Event → State"** is declaratively defined.

## Step 3 - Build the Aggregate

Assemble the domain as a single Aggregate using the defined decider and reducer.

```ts
export const counter = createAggregate
  CounterState,
  CounterCommand,
  CounterEvent
>()
  .type("counter")
  .decider(decider)
  .reducer(reducer)
  .build();
```

The `counter` domain is now complete.
Through type parameters, the relationship between State, Command, and Event is always guaranteed at the type level.
Code completion works accurately, and definition errors cannot occur.

## Step 4 - Execute Commands and Observe Event Flow (Optional)

The CQRS domain is now complete.
Next, use `FakeHandler` to verify the actual behavior.

```ts
async function main() {
  const handler = new FakeHandler({
    aggregates: [counter],
    reactors: [],
    querySources: [],
  });

  const id = zeroId("counter");

  await handler.command({ type: "initialize", id, payload: { count: 10 } });
  await handler.command({ type: "increment", id });
  await handler.command({ type: "decrement", id });
  await handler.command({ type: "increment", id });

  handler.log();
}

main();
```

### Execution Result

```bash
❯ bun run ./src/index.ts

-- eventStore.events --
[
  {
    type: "initialized",
    id: { type: "counter", value: "da3b45d1-1975-4bcc-9825-1a6048a14a6e" },
    payload: { count: 10 },
    version: 1,
    timestamp: 2025-10-01T23:36:04.263Z,
  }, {
    type: "incremented",
    id: { type: "counter", value: "da3b45d1-1975-4bcc-9825-1a6048a14a6e" },
    version: 2,
    timestamp: 2025-10-01T23:36:04.265Z,
  }, {
    type: "decremented",
    id: { type: "counter", value: "da3b45d1-1975-4bcc-9825-1a6048a14a6e" },
    version: 3,
    timestamp: 2025-10-01T23:36:04.266Z,
  }, {
    type: "incremented",
    id: { type: "counter", value: "da3b45d1-1975-4bcc-9825-1a6048a14a6e" },
    version: 4,
    timestamp: 2025-10-01T23:36:04.266Z,
  }
]
```

Each time a Command is executed, an Event is generated,
and the Reducer updates the State.

The EventStore holds the history, and the ReadModel holds the current state.
This flow is the essence of CQRS + Event Sourcing.

## Step 5 - Verify with Tests (Optional)

Using `aggregateFixture`, you can verify behavior in BDD style.

```ts
import { describe, expect, test } from "bun:test";

test("initialize counter command", () => {
  aggregateFixture<CounterState, CounterCommand, CounterEvent>(counter)
    .when({
      type: "initialize",
      id: counterId,
      payload: { count: 10 },
    })
    .then((fixture) => {
      fixture.assert((ctx) => {
        expect(ctx.error).toBeNull();
        expect(ctx.state.after).toEqual({
          type: "active",
          id: counterId,
          count: 10,
          version: 1,
        });
        expect(ctx.events.after).toEqual([
          {
            type: "initialized",
            id: counterId,
            payload: { count: 10 },
            version: 1,
            timestamp: expect.any(Date),
          },
        ]);
      });
    });
});
```

This test declaratively verifies State and Event changes from Command execution.
Since domain logic is composed as pure functions,
tests can focus on "verifying state transitions without side effects."

## Summary

You've completed three steps so far:

1. Defined `State`, `Command`, and `Event` types
2. Implemented `decider` and `reducer`
3. Built an aggregate object with `createAggregate`

With just this minimal configuration, you've experienced the basic flow of CQRS on the Command side.

revion.js provides the shortest route to learning CQRS + Event Sourcing.
You can focus on the essence of "expressing the domain with types and building declaratively" without worrying about complex configuration or abstraction.

## Next Steps

### For those who want to organize CQRS/ES concepts

→ [Guide / Concept](../3_guide/1_concept.md)  
Explains CQRS + Event Sourcing structure and architecture with diagrams.

### For those who want to build more practical applications

→ [Guide / Tutorial](../3_guide/2_tutorial.md)  
Learn the overall design including EventBus and QueryBus using an inventory management domain as the subject.
