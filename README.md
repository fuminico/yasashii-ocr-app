# やさしさOCR

画像を読み込み → OCR処理 → 要約 → 良い点を褒めて → 優しく修正案を提示する  
日本語向けの温かみあるデザインのViteアプリです。

## 技術スタック
- Vite + React + TypeScript
- Tailwind CSS
- Tesseract.js (OCR)
- OpenAI API (要約・フィードバック)

## 機能
- 画像アップロード（複数枚対応）
- OCR処理（日本語対応）
- LLMによる要約・褒め・修正案生成
- 白背景×黒文字の見やすいUI

## セットアップ
```bash
npm install
npm run dev
