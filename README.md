# ソード・ワールド 2.5 (for FoundryVTT)

![Foundry v11](https://img.shields.io/badge/foundry-v11-green)
![Foundry v12](https://img.shields.io/badge/foundry-v12-green)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X415YUSP)
[![OFUSE](https://img.shields.io/badge/OFUSE-9cf.svg?style=for-the-badge)](https://ofuse.me/o?uid=81619)

FVTT用ソード・ワールド2.5ゲームシステム（β版）

## インストール
「ゲームシステム」タブの「ゲームシステムを入手」からインストール。

## 使い方
同梱辞典資料に簡易的な使用方法を用意しています。

サンプルを同梱しているので、参考にしてください。

### 推奨モジュール

- [Token Action HUD Sword World 2.5](https://foundryvtt.com/packages/token-action-hud-sw25)（[Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core)が必要）
- [Drag Ruler for Sword World 2.5](https://foundryvtt.com/packages/drag-ruler-integration-for-sw25)（[Drag Ruler](https://foundryvtt.com/packages/drag-ruler)が必要）
- [Sword World 2.5 Support Tools](https://github.com/keyslock/sw25-fvtt-support)

## 対応言語
- 日本語（[Jean.N](https://github.com/jeannjeann)）
- English ([kuouvadis](https://github.com/kuouvadis))

## 作者
- [Jean.N](https://github.com/jeannjeann)

### 開発サポート
- [kuouvadis](https://github.com/kuouvadis)
- [HikariNoTsurugi](https://github.com/HikariNoTsurugi)
- [keyslock](https://github.com/keyslock)
- [Airamhh](https://github.com/Airamhh)

## 権利表記
[MITライセンス](LICENSE.txt)

本作は、「グループSNE」および「株式会社KADOKAWA」が権利を有する『ソード・ワールド2.0/2.5』の、二次創作です。 (C)GroupSNE (C)KADOKAWA

このシステムはBoilerplateテンプレートをベースにしています。

## 検証環境
- OS:Windows 10
- ブラウザ:GoogleChrome
- FVTT:バージョン11.315

## 注意事項
- ひととおりFVTTらしいセッションに使用できる機能が実装されました。
- β版です。バグが残存している可能性はかなり高いです。
- エラー対応甘いです、常識的な数値を入れるようにしてください。
- 警告がコンソールに出ますが、動作に問題がないためひとまず放置しています。
- Modとの相性などはほとんど検証していません。「Dice So Nice!」「Times Up」「Chat Commander」「Token Action HUD」「Polyglot」は簡単に検証済み。
- バフ・デバフの持続時間の管理には「Times Up」Modの使用をオススメします。
- カスタムチャットコマンド使用には「Chat Commander」が必要です。
- 戦闘に関する実装は行っていません。行動順に関しては手動で行うか、Modの導入をオススメします。
- 行動順をサポートするModの一例（ポップコーンイニシアチブが向いているのではないかと個人的には思う）
  - ポップコーンタイプ「Lancer Initiative」「Just Popcorn Initiative」
  - グループタイプ「Combat Tracker Extensions」「Combat Tracker Groups」

## 開発目標
- β版目標：バグ潰し、UIブラッシュアップ

## 言い訳
- JavaScriptの本格的な使用はほぼはじめて、HTMLはいにしえの知識、CSSっておいしいの？という状態での開発なので、とてもバタ臭いコードです。もっとスマートにできるはずだけど、実力が追い付いていません。設計とコーディングも並行して行ったので、不要なコードやファイルが多数残ってますが見逃してください。
- CSSは本当に一から始めた上、装飾センスにはまったく自信がないので装飾は最低限です。有志がいるなら是非改良を！プルリクもらえると嬉しいです。


