import { selfScoreSchema } from "../self-score";

describe("selfScoreSchema", () => {
  describe("成功ケース", () => {
    it("0を受け入れる", () => {
      const validData = {
        self_score: 0,
      };

      const result = selfScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("100を受け入れる", () => {
      const validData = {
        self_score: 100,
      };

      const result = selfScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("中間値を受け入れる", () => {
      const validData = {
        self_score: 50,
      };

      const result = selfScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("小数点を含む値を受け入れる", () => {
      const validData = {
        self_score: 75.5,
      };

      const result = selfScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("範囲のバリデーション", () => {
    it("0未満の値を拒否する", () => {
      const invalidData = {
        self_score: -1,
      };

      const result = selfScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "スコアは0以上で入力してください"
        );
      }
    });

    it("100を超える値を拒否する", () => {
      const invalidData = {
        self_score: 101,
      };

      const result = selfScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "スコアは100以下で入力してください"
        );
      }
    });

    it("大きな負の値を拒否する", () => {
      const invalidData = {
        self_score: -100,
      };

      const result = selfScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "スコアは0以上で入力してください"
        );
      }
    });

    it("大きな正の値を拒否する", () => {
      const invalidData = {
        self_score: 1000,
      };

      const result = selfScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "スコアは100以下で入力してください"
        );
      }
    });
  });

  describe("必須フィールドのバリデーション", () => {
    it("スコアが未定義の場合エラーを返す", () => {
      const invalidData = {};

      const result = selfScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("スコアは必須です");
      }
    });
  });

  describe("境界値テスト", () => {
    it("0（下限）を受け入れる", () => {
      const validData = {
        self_score: 0,
      };

      const result = selfScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.self_score).toBe(0);
      }
    });

    it("100（上限）を受け入れる", () => {
      const validData = {
        self_score: 100,
      };

      const result = selfScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.self_score).toBe(100);
      }
    });

    it("0.01を受け入れる", () => {
      const validData = {
        self_score: 0.01,
      };

      const result = selfScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("99.99を受け入れる", () => {
      const validData = {
        self_score: 99.99,
      };

      const result = selfScoreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("型のバリデーション", () => {
    it("文字列の数値を拒否する", () => {
      const invalidData = {
        self_score: "50",
      };

      const result = selfScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("NaNを拒否する", () => {
      const invalidData = {
        self_score: NaN,
      };

      const result = selfScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("Infinityを拒否する", () => {
      const invalidData = {
        self_score: Infinity,
      };

      const result = selfScoreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
