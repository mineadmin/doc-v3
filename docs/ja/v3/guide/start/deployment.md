# デプロイ

本記事では、MineAdmin のフロントエンド・バックエンドアプリケーションを様々な環境（開発、テスト、本番環境）にデプロイする方法について説明します。

## デプロイアーキテクチャ概要

MineAdmin はフロントエンド・バックエンド分離アーキテクチャを採用し、以下の技術スタックに基づいています。
- **バックエンド**: PHP 8.1+ + Hyperf フレームワーク + Swoole 拡張機能
- **フロントエンド**: Vue 3 + TypeScript + Vite
- **データベース**: MySQL 5.7+ / PostgreSQL (オプション)
- **キャッシュ**: Redis 6.0+
- **コンテナ化**: Docker + Docker Compose

```plantuml
@startuml MineAdmin デプロイアーキテクチャ図
!theme plain

skinparam rectangle {
    BackgroundColor LightBlue
    BorderColor Black
}

skinparam component {
    BackgroundColor LightGreen
    BorderColor Black
}

rectangle "ロードバランサー" as LB {
    component "Nginx/HAProxy" as nginx
}

rectangle "Web 層" as Web {
    component "フロントエンド静的リソース\n(Vue 3 + Vite)" as frontend
}

rectangle "API 層" as API {
    component "MineAdmin バックエンド\n(PHP 8.1 + Hyperf)" as backend1
    component "MineAdmin バックエンド\n(PHP 8.1 + Hyperf)" as backend2
}

rectangle "データ層" as Data {
    component "MySQL 5.7+" as mysql
    component "Redis 6.0+" as redis
}

LB --> Web
LB --> API
API --> Data

@enduml
```