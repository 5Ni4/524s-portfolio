# ポートフォリオの本番公開手順（切り替え前の案）

対象は Cloudflare Workers の既存 Worker `portfolio` と既存の本番 URL。別の Pages プロジェクトには適用しない。以下の本番設定はこの変更では変更していない。

1. ローカルで `sh scripts/build-portfolio.sh` を実行し、差分を GitHub の PR にする。ローカル成果物は本番に送らない。
2. PR の `Verify static release` とプレビューを確認する。プレビューと本番は別。Worker Builds のプレビュー先を使う場合も、本番 URL や本番トラフィックを変更しない。
3. 移行前に、Cloudflare でいまのデプロイ ID・トリガー・Git 連携状態を読み取り確認する。GitHub `main` から作った配信ファイルと現行本番を比較し、現行本番だけにある変更は先にレビュー付き PR で戻す。
4. 既存 Worker の Builds で GitHub の対象リポジトリと本番ブランチ `main` に限定する案を優先する。Build command は `sh scripts/build-portfolio.sh`、既存 `wrangler.jsonc` の `assets.directory` は `./dist`。切り替え前に実際の設定とアカウント権限を確認する。本番経路を複数作らない。
5. GitHub 側の運用は PR・検査を必須にする。Cloudflare 側の手動デプロイ権限は別に棚卸しする。Git 連携だけでは手動公開を禁止できない。権限変更前に、緊急時の復旧手段と管理者を確認する。
6. 本番反映後はマージ SHA、Cloudflare のデプロイ ID、公開 URL を対応付け、既存の掲載・画像・主要リンクを実ページで確認する。本番の照合までを完了とする。

## 今回のパイロットで検査すること

`Verify static release` は公開を行わず、`scripts/verify-portfolio-release-source.sh` に6種類の模擬入力を渡す。現行の main と一致する模擬ケースだけを通し、古い SHA、非 main ブランチ、main と同名のタグ、main SHA 未取得、短縮 SHA を拒否する。テストの「現行 SHA」はテスト用に固定したチェックアウトの SHA で、これを本番公開の許可証として使ってはいけない。

将来、本番の公開コマンドへ接続する場合、(1) 候補の完全な ref は信頼済みの実行基盤のイベント情報から、(2) チェックアウトの完全な SHA はビルド対象の作業ツリーの `git rev-parse HEAD` から、(3) 最新 main の完全な SHA は正規 GitHub リポジトリ `5Ni4/524s-portfolio` の `refs/heads/main` から公開直前に取得する。利用者が入力した ref、キャッシュしたローカル ref、PRの基点 SHA で代用しない。取得不可・不一致は公開せず停止し、通った場合でも検査済みの同一 SHA のビルドのみを公開する。

このPRだけでは、本番の公開コマンドはこの検査を通らない。GitHubの `main` への直接更新の制限・PR必須・必須チェック設定と、Cloudflareの実デプロイ元・本番ブランチ・手動公開権限は別に確認してから設定する。これらの設定・本番デプロイ・既存認証情報は今回変更していない。

公式: [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) / [Builds 設定](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)。
