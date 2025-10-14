import {
  symptomNameToCode,
  symptomCodeToName,
  symptomNamesToCodes,
  symptomCodesToNames,
  SYMPTOM_MAPPING,
  SYMPTOM_CODE_TO_NAME,
  SYMPTOM_NAMES,
} from "../symptoms";

describe("症状関連のユーティリティ関数", () => {
  describe("SYMPTOM_MAPPING", () => {
    it("症状名とコードのマッピングが存在する", () => {
      expect(SYMPTOM_MAPPING).toBeDefined();
      expect(typeof SYMPTOM_MAPPING).toBe("object");
    });

    it("主要な症状が含まれている", () => {
      expect(SYMPTOM_MAPPING["頭痛"]).toBe("headache");
      expect(SYMPTOM_MAPPING["めまい"]).toBe("dizziness");
      expect(SYMPTOM_MAPPING["吐き気"]).toBe("nausea");
      expect(SYMPTOM_MAPPING["倦怠感"]).toBe("fatigue");
    });

    it("14種類の症状が定義されている", () => {
      expect(Object.keys(SYMPTOM_MAPPING).length).toBe(14);
    });
  });

  describe("SYMPTOM_CODE_TO_NAME", () => {
    it("コードから名前への逆マッピングが存在する", () => {
      expect(SYMPTOM_CODE_TO_NAME).toBeDefined();
      expect(typeof SYMPTOM_CODE_TO_NAME).toBe("object");
    });

    it("コードから正しい日本語名を取得できる", () => {
      expect(SYMPTOM_CODE_TO_NAME["headache"]).toBe("頭痛");
      expect(SYMPTOM_CODE_TO_NAME["dizziness"]).toBe("めまい");
      expect(SYMPTOM_CODE_TO_NAME["nausea"]).toBe("吐き気");
    });
  });

  describe("SYMPTOM_NAMES", () => {
    it("症状名の配列が存在する", () => {
      expect(SYMPTOM_NAMES).toBeDefined();
      expect(Array.isArray(SYMPTOM_NAMES)).toBe(true);
    });

    it("14種類の症状名が含まれている", () => {
      expect(SYMPTOM_NAMES.length).toBe(14);
    });

    it("主要な症状名が含まれている", () => {
      expect(SYMPTOM_NAMES).toContain("頭痛");
      expect(SYMPTOM_NAMES).toContain("めまい");
      expect(SYMPTOM_NAMES).toContain("吐き気");
      expect(SYMPTOM_NAMES).toContain("倦怠感");
    });
  });

  describe("symptomNameToCode", () => {
    it("症状名をコードに変換する", () => {
      expect(symptomNameToCode("頭痛")).toBe("headache");
      expect(symptomNameToCode("めまい")).toBe("dizziness");
      expect(symptomNameToCode("吐き気")).toBe("nausea");
      expect(symptomNameToCode("倦怠感")).toBe("fatigue");
    });

    it("すべての症状名を正しく変換する", () => {
      expect(symptomNameToCode("肩こり")).toBe("shoulder_pain");
      expect(symptomNameToCode("腰痛")).toBe("back_pain");
      expect(symptomNameToCode("腹痛")).toBe("stomach_ache");
      expect(symptomNameToCode("発熱")).toBe("fever");
      expect(symptomNameToCode("咳")).toBe("cough");
      expect(symptomNameToCode("鼻水")).toBe("runny_nose");
      expect(symptomNameToCode("目の疲れ")).toBe("eye_strain");
      expect(symptomNameToCode("不眠")).toBe("insomnia");
      expect(symptomNameToCode("食欲不振")).toBe("loss_of_appetite");
      expect(symptomNameToCode("その他")).toBe("other");
    });

    it("存在しない症状名はotherを返す", () => {
      expect(symptomNameToCode("存在しない症状")).toBe("other");
      expect(symptomNameToCode("")).toBe("other");
    });
  });

  describe("symptomCodeToName", () => {
    it("コードを症状名に変換する", () => {
      expect(symptomCodeToName("headache")).toBe("頭痛");
      expect(symptomCodeToName("dizziness")).toBe("めまい");
      expect(symptomCodeToName("nausea")).toBe("吐き気");
      expect(symptomCodeToName("fatigue")).toBe("倦怠感");
    });

    it("すべてのコードを正しく変換する", () => {
      expect(symptomCodeToName("shoulder_pain")).toBe("肩こり");
      expect(symptomCodeToName("back_pain")).toBe("腰痛");
      expect(symptomCodeToName("stomach_ache")).toBe("腹痛");
      expect(symptomCodeToName("fever")).toBe("発熱");
      expect(symptomCodeToName("cough")).toBe("咳");
      expect(symptomCodeToName("runny_nose")).toBe("鼻水");
      expect(symptomCodeToName("eye_strain")).toBe("目の疲れ");
      expect(symptomCodeToName("insomnia")).toBe("不眠");
      expect(symptomCodeToName("loss_of_appetite")).toBe("食欲不振");
      expect(symptomCodeToName("other")).toBe("その他");
    });

    it("存在しないコードは「その他」を返す", () => {
      expect(symptomCodeToName("unknown_code")).toBe("その他");
      expect(symptomCodeToName("")).toBe("その他");
    });
  });

  describe("symptomNamesToCodes", () => {
    it("症状名の配列をコードの配列に変換する", () => {
      const names = ["頭痛", "めまい", "吐き気"];
      const codes = symptomNamesToCodes(names);
      expect(codes).toEqual(["headache", "dizziness", "nausea"]);
    });

    it("空配列を処理する", () => {
      expect(symptomNamesToCodes([])).toEqual([]);
    });

    it("存在しない症状名を含む配列を処理する", () => {
      const names = ["頭痛", "存在しない症状", "めまい"];
      const codes = symptomNamesToCodes(names);
      expect(codes).toEqual(["headache", "other", "dizziness"]);
    });

    it("すべての症状名を変換できる", () => {
      const codes = symptomNamesToCodes(SYMPTOM_NAMES);
      expect(codes.length).toBe(14);
      expect(codes).toContain("headache");
      expect(codes).toContain("other");
    });
  });

  describe("symptomCodesToNames", () => {
    it("コードの配列を症状名の配列に変換する", () => {
      const codes = ["headache", "dizziness", "nausea"];
      const names = symptomCodesToNames(codes);
      expect(names).toEqual(["頭痛", "めまい", "吐き気"]);
    });

    it("空配列を処理する", () => {
      expect(symptomCodesToNames([])).toEqual([]);
    });

    it("存在しないコードを含む配列を処理する", () => {
      const codes = ["headache", "unknown_code", "dizziness"];
      const names = symptomCodesToNames(codes);
      expect(names).toEqual(["頭痛", "その他", "めまい"]);
    });

    it("すべてのコードを変換できる", () => {
      const allCodes = Object.values(SYMPTOM_MAPPING);
      const names = symptomCodesToNames(allCodes);
      expect(names.length).toBe(14);
      expect(names).toContain("頭痛");
      expect(names).toContain("その他");
    });
  });

  describe("相互変換テスト", () => {
    it("名前→コード→名前の変換が一致する", () => {
      const originalName = "頭痛";
      const code = symptomNameToCode(originalName);
      const convertedName = symptomCodeToName(code);
      expect(convertedName).toBe(originalName);
    });

    it("コード→名前→コードの変換が一致する", () => {
      const originalCode = "headache";
      const name = symptomCodeToName(originalCode);
      const convertedCode = symptomNameToCode(name);
      expect(convertedCode).toBe(originalCode);
    });

    it("配列の相互変換が一致する", () => {
      const originalNames = ["頭痛", "めまい", "吐き気"];
      const codes = symptomNamesToCodes(originalNames);
      const convertedNames = symptomCodesToNames(codes);
      expect(convertedNames).toEqual(originalNames);
    });
  });
});
