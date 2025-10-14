# Quick start

This page shows how to set up the simplest application with the **revion.js framework** and focuses on the primary APIs you will use.

The `revion-counter-app` template already includes the setup implemented in this tutorial.

## 1. Install

Add the `revion` package to your project.

<!-- bash command start -->
<!-- markdownlint-disable MD033 -->
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="pkg-manager" defaultValue="npm" values={[
  {label: 'npm', value: 'npm'},
  {label: 'yarn', value: 'yarn'},
  {label: 'pnpm', value: 'pnpm'},
  {label: 'bun', value: 'bun'},
]}>
  <TabItem value="npm">

```bash
npm install revion
```

  </TabItem>
  <TabItem value="yarn">

```bash
yarn add revion
```

  </TabItem>
  <TabItem value="pnpm">

```bash
pnpm add revion
```

  </TabItem>
  <TabItem value="bun">

```bash
bun add revion
```

  </TabItem>
</Tabs>
<!-- markdownlint-enable MD033 -->
<!-- bash command end -->

## 2. Create the folder structure

The revion.js framework does not enforce a specific folder structure.
Choose a structure that fits your project.

In this tutorial, we will use a feature-based folder structure.
Each feature is composed around an aggregate object.

```txt
./src
├── index.ts
└── features
    └── counter
        ├── counter-aggregate.ts
        └── types.ts
```

## 3. Declare types

Open the `./src/features/counter/types.ts` file.

Define the Counter aggregate `State`, `Command`, and `Event` types.
Use tagged unions so that each variant carries an explicit tag (`type`).

These definitions specify the commands the Counter aggregate accepts and the events it emits.

```ts
export type CounterId = { type: 'counter'; value: string }

export type CounterState = { type: 'active'; id: CounterId; count: number }

export type CounterCommand =
  | { type: 'init'; id: CounterId; payload: { count: number } }
  | { type: 'increment'; id: CounterId }
  | { type: 'decrement'; id: CounterId }

export type CounterEvent =
  | { type: 'init'; id: CounterId; payload: { count: number } }
  | { type: 'incremented'; id: CounterId }
  | { type: 'decremented'; id: CounterId }
```

## 4. Declare functions

Open the `./src/features/counter/counter-aggregate.ts` file.

Import `EventDecider` and `Reducer` types from `revion.js`, and define the EventDecider and Reducer using the Counter types.
The framework uses these two functions to construct the command workflow.

See the detailed workflow in the documentation.

```ts
import type { EventDecider, Reducer } from 'revion'
import type { CounterCommand, CounterEvent, CounterState } from './types'

const decider: EventDecider<CounterState, CounterCommand, CounterEvent> = {
  init: ({ command }) => ({
    type: 'initialized',
    id: command.id,
    payload: command.payload
  }),
  increment: ({ command }) => ({ type: 'incremented', id: command.id }),
  decrement: ({ command }) => ({ type: 'decremented', id: command.id })
}

const reducer: Reducer<CounterState, CounterEvent> = {
  initialized: ({ event }) => ({
    type: 'active',
    id: event.id,
    count: event.payload.count
  }),
  incremented: ({ state }) => {
    state.count += 1
  },
  decremented: ({ state }) => {
    state.count -= 1
  }
}
```

## 5. Create the aggregate

In the same file, import the `createAggregate` API.
The `createAggregate` function is a builder-style factory.

Use the defined decider and reducer to export the aggregate object.

That completes the Counter aggregate definition.

```ts
import { createAggregate } from 'revion'

// const decider = ...

// const reducer = ...

export const counter = createAggregate<CounterState, CounterCommand, CounterEvent>()
  .type('counter')
  .decider(decider)
  .reducer(reducer)
  .build()
```

## 6. Define the handler

Open the `./src/index.ts` file.

The revion.js framework provides a `FakeHandler` class so that you can quickly try behavior without defining complex infrastructure.
By default, `FakeHandler` sets up an in-memory EventStore.

Define the handler using the `counter` you defined.

```ts
import { FakeHandler } from 'revion'

const handler = new FakeHandler({
  aggregates: [counter]
})
```

Now the command handler for operating on the Counter aggregate is ready.
Try sending some commands.

```ts
import { zeroId } from 'revion'

const id = zeroId('counter')

const commands: CounterCommand[] = [
  { type: 'init', id, payload: { count: 10 } }, // count to be 10
  { type: 'increment', id }, // count to be 11
  { type: 'decrement', id } // count to be 10
]

for (const command of commands) {
  await handler.command(command)
}

handler.log()
```

### EventStore log

```txt
[
  {
    type: "initialized",
    id: {
      type: "counter",
      value: "0e8c2192-f20d-4342-92b1-d1a1428c1e43",
    },
    payload: {
      count: 10,
    },
    version: 1,
    timestamp: 2025-10-04T02:31:37.759Z,
  },
  {
    type: "incremented",
    id: {
      type: "counter",
      value: "0e8c2192-f20d-4342-92b1-d1a1428c1e43",
    },
    version: 2,
    timestamp: 2025-10-04T02:31:37.762Z,
  },
  {
    type: "incremented",
    id: {
      type: "counter",
      value: "0e8c2192-f20d-4342-92b1-d1a1428c1e43",
    },
    version: 3,
    timestamp: 2025-10-04T02:31:37.764Z,
  }
]
```

## Next step

This code is the same as the first step of the tutorial.
For more details on how to implement the query bus, event bus, and test code, read here.
