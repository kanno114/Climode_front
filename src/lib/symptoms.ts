// 症状の名前とコードのマッピング
export const SYMPTOM_MAPPING = {
  頭痛: "headache",
  めまい: "dizziness",
  吐き気: "nausea",
  倦怠感: "fatigue",
  肩こり: "shoulder_pain",
  腰痛: "back_pain",
  腹痛: "stomach_ache",
  発熱: "fever",
  咳: "cough",
  鼻水: "runny_nose",
  目の疲れ: "eye_strain",
  不眠: "insomnia",
  食欲不振: "loss_of_appetite",
  その他: "other",
} as const;

// 症状コードから名前への逆マッピング
export const SYMPTOM_CODE_TO_NAME = Object.fromEntries(
  Object.entries(SYMPTOM_MAPPING).map(([name, code]) => [code, name])
) as Record<string, string>;

// 症状名の配列（フォームで使用）
export const SYMPTOM_NAMES = Object.keys(SYMPTOM_MAPPING);

// 症状名からコードへの変換
export function symptomNameToCode(name: string): string {
  return SYMPTOM_MAPPING[name as keyof typeof SYMPTOM_MAPPING] || "other";
}

// 症状コードから名前への変換
export function symptomCodeToName(code: string): string {
  return SYMPTOM_CODE_TO_NAME[code] || "その他";
}

// 症状名の配列からコードの配列への変換
export function symptomNamesToCodes(names: string[]): string[] {
  return names.map(symptomNameToCode);
}

// 症状コードの配列から名前の配列への変換
export function symptomCodesToNames(codes: string[]): string[] {
  return codes.map(symptomCodeToName);
}
