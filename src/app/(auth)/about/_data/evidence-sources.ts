/**
 * 提案ロジックの参照エビデンス（Aboutページ用）
 * notes/改修_202602/Climode_ロジックとエビデンス - エビデンス.tsv を参照
 */

export interface EvidenceSource {
  name: string;
  description?: string;
  url?: string;
}

export interface EvidenceCategory {
  id: string;
  title: string;
  description: string;
  sources: EvidenceSource[];
}

export const EVIDENCE_CATEGORIES: EvidenceCategory[] = [
  {
    id: "weather_pain",
    title: "気象病・頭痛予報",
    description: "気圧変化による体調不良リスクの判定に使用しています。",
    sources: [
      {
        name: "大熊博久医師らの研究 (2015)",
        description:
          "論文名：Examination of fluctuations in atmospheric pressure related to migraine／概要：気圧低下幅と片頭痛発生の相関に関する研究",
      },
      {
        name: "天気痛ドクター（監修：愛知医科大学 佐藤純医師）",
        description: "気象病・天気痛に関する予報傾向と基礎知識",
        url: "https://tenki-tsura.com/",
      },
    ],
  },
  {
    id: "heatstroke",
    title: "熱中症・ヒートショック対策",
    description: "気温や湿度に基づく身体へのリスク判定に使用しています。",
    sources: [
      {
        name: "環境省「熱中症予防情報サイト」",
        description: "暑さ指数(WBGT)の定義および判定基準",
        url: "https://www.wbgt.env.go.jp/",
      },
      {
        name: "鹿児島大学 法医学分野（林敬人教授ら）の研究",
        description:
          "研究内容：浴室内突然死（ヒートショック等）の発生予測モデル",
      },
    ],
  },
  {
    id: "infection",
    title: "感染症対策・室内環境",
    description: "換気タイミングや適切な湿度の判定に使用しています。",
    sources: [
      {
        name: "厚生労働省",
        description: "インフルエンザQ&A（湿度の保持について）",
        url: "https://www.mhlw.go.jp/bunya/kenkou/kekkaku-kansenshou01/qa.html",
      },
      {
        name: "東京都健康安全研究センター",
        description: "「健康で快適な居住環境のために」（ビル管理・居住環境）",
        url: "https://www.tokyo-eiken.go.jp/",
      },
    ],
  },
  {
    id: "sleep",
    title: "睡眠・リカバリー",
    description: "最適な就寝時間や睡眠環境の提案に使用しています。",
    sources: [
      {
        name: "厚生労働省「健康づくりのための睡眠ガイド2023」",
        description:
          "概要：成人・高齢者・こどもごとの推奨睡眠時間および休養指針",
        url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/suimin/index.html",
      },
    ],
  },
];
