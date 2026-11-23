# R-524 / portfolio

R-524 / X: [@R5ni4](https://x.com/R5ni4)

## Published

- [524s portfolio](https://portfolio.r524.workers.dev/)

## Works

- [5.24秒](https://five24-seconds-game.r524.workers.dev/)
- [ぺたかくし](https://petakakushi-app.r524.workers.dev/)
- [524のお友達メーカー](https://friends-of-524.pages.dev/)
- [ぴた壁](https://pitakabe-wallpaper-maker.r524.workers.dev/)

## Run locally

```sh
python3 -m http.server 4174
```

Then open <http://127.0.0.1:4174/>.

### Cloudflare Workers 用のビルド

`sh scripts/build-portfolio.sh` で `dist/` を作成します。
Cloudflare の設定先は Worker `portfolio` です。リリースする前に
`wrangler versions upload` で確認用 URL を作り、既存ページと画像が残っていることを確認してから、そのバージョンを本番に反映します。
