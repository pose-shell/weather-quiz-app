# データ設計

## 問題データ
### 規則
- 1問を1オブジェクトで表現する。
- カテゴリごとにファイルを分けてjsonで持つ

### 項目
- id: 問題ID
  - q-試験区分-カテゴリ略称-連番
- exam_type: 試験区分
  - 試験区分
- 
- question_type: 問題形式
  - 問題形式
- category: カテゴリ
  - カテゴリ略称
- title: 問題タイトル
  - タイトル
- level:レベル
  - basic / standard / advanced
- frequency
  - frequent / occasional / rare
- tags: タグ
  - タグ
- question: 問題文
- choices: 選択肢
- answer: 正解番号
- explanation: 解説
- wrong_choice_explanations: 各選択肢の説明
- related_articles: 関連記事リンク
- status: 公開状態
  - draft / published / archived
- order:カテゴリ内の記事順
  - 数字
- created_at: 作成日
- updated_at: 更新日

## 記事データ
### 規則
- 記事はMarkdownで記載しメタデータは記事ファイルに併記する。
- 公開時はHTML化する。
- HTML化する際に別途記事一覧をjsonで作り、メタデータはそこに持つ

### 項目
- id:記事ID
  - art-試験区分-カテゴリ略称-連番
- title:記事タイトル
- category:記事カテゴリ
  - カテゴリ略称
- tags:タグ
  - タグ
- status: 公開状態
  - draft / published / archived
- related_q_ids:関連問題
  - 問題ID
- related_art_ids:関連記事
  - 記事ID
- created_at: 作成日
  - yyyy-mm-dd
- updated_at: 更新日
  - yyyy-mm-dd

### 命名リスト
- 試験区分
  - 一般:gen
  - 専門:sen
- カテゴリ略称
  - 観測:obs
  ― 実況解析・総観場:syn 
  ― 数値予報:nwp 
  ― 短時間予報・局地予報:slf
  - 予報技術:fst
  - 気象災害・予報活用:dis
- 問題形式
  - 4択:mcq
- サブカテゴリ
  - 
- タグ