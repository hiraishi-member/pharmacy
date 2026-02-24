# アーキテクチャ設計図

## 1. 画面遷移図

```mermaid
flowchart TB
    subgraph BottomNav["ボトムナビゲーション"]
        direction LR
        TabToday["今日"]
        TabMedicine["お薬"]
        TabHistory["履歴"]
    end

    Home["/ 今日の服薬\n（ホーム画面）"]
    MedicineList["/medicines\nお薬一覧"]
    MedicineNew["/medicines/new\nお薬登録"]
    MedicineEdit["/medicines/[id]/edit\nお薬編集"]
    History["/history\nカレンダー履歴"]
    DayDetail["日付タップ\n日別詳細表示"]

    TabToday --> Home
    TabMedicine --> MedicineList
    TabHistory --> History

    Home -- "チェック操作" --> Home

    MedicineList -- "＋追加ボタン" --> MedicineNew
    MedicineList -- "編集ボタン" --> MedicineEdit
    MedicineNew -- "保存 / 戻る" --> MedicineList
    MedicineEdit -- "保存 / 戻る" --> MedicineList
    MedicineList -- "削除（確認ダイアログ）" --> MedicineList

    History -- "日付タップ" --> DayDetail
    History -- "前月 / 翌月" --> History
    DayDetail -- "戻る" --> History
```

## 2. コンポーネント構成図

```mermaid
flowchart TB
    RootLayout["app/layout.tsx\n（RootLayout）\nNoto Sans JP / グローバルCSS"]

    RootLayout --> Home["app/page.tsx\n今日の服薬"]
    RootLayout --> MedicineLayout["app/medicines/layout.tsx"]
    RootLayout --> HistoryPage["app/history/page.tsx\nカレンダー履歴"]
    RootLayout --> BottomNav["components/BottomNav\nタブバー（固定）"]

    MedicineLayout --> MedicineList["app/medicines/page.tsx\nお薬一覧"]
    MedicineLayout --> MedicineNew["app/medicines/new/page.tsx\nお薬登録"]
    MedicineLayout --> MedicineEdit["app/medicines/[id]/edit/page.tsx\nお薬編集"]

    Home --> TimingSection["components/TimingSection\nタイミング別セクション"]
    TimingSection --> MedicineCheckCard["components/MedicineCheckCard\n服薬チェックカード"]

    MedicineList --> MedicineCard["components/MedicineCard\nお薬カード"]
    MedicineNew --> MedicineForm["components/MedicineForm\n入力フォーム（共通）"]
    MedicineEdit --> MedicineForm

    HistoryPage --> Calendar["components/Calendar\n月間カレンダー"]
    Calendar --> DayCell["components/DayCell\n日付セル＋インジケーター"]
    HistoryPage --> DayDetailSheet["components/DayDetailSheet\n日別詳細"]

    subgraph SharedUI["共通UIコンポーネント (components/ui/)"]
        Button["Button"]
        Card["Card"]
        Badge["Badge\n（タイミングバッジ）"]
        Dialog["Dialog\n（削除確認）"]
        Checkbox["Checkbox"]
    end

    MedicineCheckCard --> TimingBadge["components/TimingBadge\nタイミングバッジ"]
    MedicineCheckCard --> Checkbox
    MedicineCard --> TimingBadge
    TimingBadge --> Badge
    MedicineCard --> Button
    MedicineForm --> Button
    MedicineList --> Dialog
```

## 3. ER図（データモデル）

```mermaid
erDiagram
    Medicine {
        string id PK "UUID"
        string name "お薬名"
        string-array timings "服用タイミング（morning/noon/evening/bedtime）"
        string memo "メモ（任意）"
        string createdAt "登録日時（ISO 8601）"
    }

    DailyRecord {
        string date PK "日付（YYYY-MM-DD）"
    }

    Check {
        string medicineId FK "お薬ID"
        string timing "タイミング（TimingSlot）"
        boolean taken "服用済みフラグ"
        string checkedAt "チェック日時（ISO 8601、任意）"
    }

    Medicine ||--o{ Check : "対象薬"
    DailyRecord ||--o{ Check : "含む"
```

### localStorage 保存構造

| キー | 型 | 説明 |
|------|------|------|
| `medicines` | `Medicine[]` | 登録済みお薬リスト |
| `records` | `DailyRecord[]` | 日次服薬記録リスト |

## 4. データフロー図

```mermaid
flowchart LR
    subgraph User["ユーザー操作"]
        AddMed["お薬を登録"]
        EditMed["お薬を編集"]
        DelMed["お薬を削除"]
        ToggleCheck["服薬チェック\nON/OFF"]
        ViewCal["カレンダー閲覧"]
    end

    subgraph State["React State（クライアント）"]
        MedState["medicines\nState"]
        RecState["records\nState"]
    end

    subgraph Storage["localStorage"]
        MedStore[("medicines\nMedicine[]")]
        RecStore[("records\nDailyRecord[]")]
    end

    subgraph Render["UI描画"]
        TodayView["今日の服薬画面"]
        MedListView["お薬一覧画面"]
        CalView["カレンダー画面"]
    end

    AddMed --> MedState
    EditMed --> MedState
    DelMed --> MedState
    ToggleCheck --> RecState
    ViewCal --> RecState

    MedState -- "JSON.stringify\n書き込み" --> MedStore
    RecState -- "JSON.stringify\n書き込み" --> RecStore

    MedStore -- "初回読み込み\nJSON.parse" --> MedState
    RecStore -- "初回読み込み\nJSON.parse" --> RecState

    MedState --> TodayView
    MedState --> MedListView
    RecState --> TodayView
    RecState --> CalView
```
