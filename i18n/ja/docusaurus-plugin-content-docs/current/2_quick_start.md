---
sidebar_position: 2
---

# Quick Start

CQRS や Event Sourcing は、ビジネスロジックを明確に分離できる強力なアーキテクチャパターンです。
一方で、メッセージバスやイベントストアの設定、複数の抽象化レイヤーの理解が必要で、最初の一歩を踏み出しにくい面もあります。

**revion.js** は、そうした課題を解消するために設計されました。
型を定義し、関数を組み合わせるだけで、CQRS + Event Sourcing の流れを即座に体験できます。

この章では、最小構成の `counter` ドメインで、**Command → Event → State** の流れを実際に動かしながら学びます。

次の 3 ステップで、型安全な CQRS アプリケーションが完成します。

1. 型を定義する
2. 振る舞いを定義する
3. Aggregate を構築して実行する

それでは始めましょう。

## Step 1 - 型でドメインを定義する

CQRS では、アプリケーションの中核となる要素を 3 種類の型で表現します。

- **State**：現在の状態
- **Command**：何をしたいか
- **Event**：何が起きたか

この 3 つを定義するだけで、ドメインの構造が明確になります。

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

Command は「命令」、Event は「結果」、State は「結果の集積」です。
TypeScript の tagged union を用いることで、すべてのケースを型で定義できます。

これにより、ドメインの意図をコメントではなく**型そのもの**で表現できます。

## Step 2 - 振る舞いを定義する（EventDecider / Reducer）

次に、システムの振る舞いを具体的に実装していきます。
Command を Event に変換する `EventDecider` と、Event で State を更新する `Reducer` の 2 つのコンポーネントを作成します。

### EventDecider — Command を Event に変換する

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

Command は「何をしたいか」を示す命令です。
`EventDecider` はそれを受け取り、実際に発生すべき Event を決定します。
これは Event Sourcing の「すべての変更は Event として記録される」という原則に基づいており、Command の実行結果を明確な Event として永続化する役割を担います。

### Reducer — Event で State を更新する

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

`Reducer` は「Event が起きた結果、状態がどう変わるか」を定義します。
Event Sourcing では、すべての Event が履歴として保存されており、`Reducer` はそれらを順に適用（replay）することで最新の状態を再構築します。
また、Command 実行時にも同様のロジックを使うことで、状態の整合性を確認し、無効な操作を防止します。

この 2 つの関数を組み合わせることで、**「Command → Event → State」** という流れが宣言的に定義されます。

## Step 3 - Aggregate を構築する

定義した decider と reducer を使って、ドメインを 1 つの Aggregate として組み立てます。

```ts
export const counter = createAggregate<
  CounterState,
  CounterCommand,
  CounterEvent
>()
  .type("counter")
  .decider(decider)
  .reducer(reducer)
  .build();
```

これで `counter` ドメインが完成しました。
型パラメータを通して、State・Command・Event の関係が常に型レベルで保証されます。
コード補完も正確に動作し、定義ミスが起こりません。

## Step 4 - Command を実行して Event Flow を観察する (Optional)

ここまでで CQRS ドメインは完成しました。
次に `FakeHandler` を使って実際に動作を確認します。

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

### 実行結果

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

Command を実行するたびに Event が生成され、
Reducer が State を更新していることが分かります。

EventStore には履歴が、ReadModel には現在の状態が保持されています。
この流れが CQRS + Event Sourcing の本質です。

## Step 5 - テストで検証する (Optional)

`aggregateFixture` を使うと、BDD スタイルで動作を確認できます。

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

このテストは、Command 実行による State と Event の変化を宣言的に検証します。
ドメインロジックが純粋関数として構成されているため、
テストは「副作用を持たない状態遷移の確認」に集中できます。

## まとめ

ここまでで、3 つのステップを完了しました。

1. `State`, `Command`, `Event` 型を定義した
2. `decider` と `reducer` を実装した
3. `createAggregate` で集約オブジェクトを構築した

この最小構成だけで、Command 側の CQRS の基本的な流れを体験できました。

revion.js は、CQRS + Event Sourcing を学ぶための最短のルートを提供します。
複雑な設定や抽象化に悩むことなく、「ドメインを型で表現し、宣言的に構築する」という本質に集中できます。

## 次に進む

### CQRS/ES の概念を整理したい方

→ [Guide / Concept](../3_guide/1_concept.md)  
CQRS + Event Sourcing の構造とアーキテクチャを図解で解説します。

### より実践的なアプリケーションを構築したい方

→ [Guide / Tutorial](../3_guide/2_tutorial.md)  
在庫管理ドメインを題材に、EventBus・QueryBus を含む全体設計を学びます。
