---
sidebar_position: 1
---

# Introduction

## What is revion.js?

**revion.js** is a lightweight TypeScript framework for building systems based on **Command Query Responsibility Segregation (CQRS)**, and **Event Sourcing (ES)**.

It aims to make these architectural patterns simple, type-safe, and practical for modern TypeScript applications.

- 🎯 **Simplicity First** — Minimal boilerplate and clear APIs keep your focus on domain logic
- 🏗️ **Type-Safe Functional Programming** — Declarative, composable, and strongly typed with TypeScript
- 🧪 **Effortless Testing** — Built-in tools for BDD-style, domain-focused testing
- ⚡️ **Lightweight and Fast** — Minimal setup, smooth development

## Core Responsibilities

revion.js provides the essential building blocks to implement CQRS and Event Sourcing effectively:

- 🧩 **Aggregate Management** — Manages domain aggregates, their state, and behavior through event sourcing
- ⚙️ **Command Processing** — Validates and executes commands with business rules enforcement
- 🔁 **Event Handling** — Applies and reacts to domain events to evolve aggregate state
- 🔍 **Query Execution** — Builds and maintains read models for efficient querying
- 🧪 **Testing Support** — Offers built-in BDD-style testing utilities for straightforward domain verification

![revion architecture](/img/revion_architecture.png)

## When to Use revion.js

revion.js is designed for developers who want to **apply CQRS and Event Sourcing principles without unnecessary complexity**, while maintaining strong **type safety** and **rapid development cycles**.

It offers a practical balance between architectural rigor and everyday productivity — ideal for modern TypeScript projects that value both **clarity** and **performance**.

| If you need...                 | revion.js provides...                                      |
| ------------------------------ | ---------------------------------------------------------- |
| CQRS/ES with minimal overhead  | A simple, predictable API that reduces boilerplate         |
| Type-safe domain modeling      | Strong compile-time guarantees powered by TypeScript       |
| Fast feedback and easy testing | Integrated BDD-style test utilities for domain logic       |
| Production-ready performance   | Lightweight runtime with zero heavy dependencies           |
| A clean separation of concerns | A clear boundary between domain, command, and query layers |

### Ideal Scenarios

revion.js is especially well-suited for:

- **Small to medium TypeScript projects** that require structure without enterprise-scale complexity
- **Teams or individual developers practicing TDD**, benefiting from fast, domain-focused testing
- **Next.js backends or APIs** that need a strong, maintainable separation between business logic and delivery layers
- **Domain-driven applications** seeking type-safe, functional, and event-driven foundations

## Quick Example

See the [Quick Start](./3_quick_start.md) guide for a complete working example.

## はじめに

revion.jsは、CQRS + Event Sourcingを実装する時に、開発者がビジネスロジックに集中できるように作られたフレームワークです。

従来の実装では、アーキテクチャが複雑になったり、初期の開発コストが高くなったりする問題がありました。revion.jsでは、関数型プログラミングの考え方と宣言的なAPI設計で、これらの問題を解決しています。

具体的には、面倒なセットアップ作業や大量のボイラープレートコード、テストの難しさといった開発の障害を取り除いて、開発者が本当に重要なドメインロジックの実装に集中できる環境を作っています。
