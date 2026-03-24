# データ設計

## 問題データ
1問を1オブジェクトで表現する。

### 項目
- id: 問題ID
- exam_type: 試験区分
- question_type: 問題形式
- category: カテゴリ
- subcategory: サブカテゴリ
- title: 問題タイトル
- difficulty: 難易度
- tags: タグ
- question: 問題文
- choices: 選択肢
- answer: 正解番号
- explanation: 解説
- wrong_choice_explanations: 各選択肢の説明
- related_articles: 関連記事リンク
- status: 公開状態
- created_at: 作成日
- updated_at: 更新日
