import { dailyLogSchema } from "../daily-log";

describe("dailyLogSchema", () => {
  // 今日の日付を取得
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  describe("成功ケース", () => {
    it("すべての必須フィールドが有効な場合成功する", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("オプショナルフィールドを含む有効なデータを受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
        symptoms: ["headache", "fatigue"],
        notes: "今日は体調が良かった",
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("symptomsとnotesが空でも成功する", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
        symptoms: [],
        notes: "",
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("日付のバリデーション", () => {
    it("今日の日付を受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("昨日の日付を拒否する", () => {
      const invalidData = {
        date: yesterday,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "今日の日付のみ記録できます"
        );
      }
    });

    it("明日の日付を拒否する", () => {
      const invalidData = {
        date: tomorrow,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "今日の日付のみ記録できます"
        );
      }
    });

    it("日付が未定義の場合エラーを返す", () => {
      const invalidData = {
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("日付は必須です");
      }
    });
  });

  describe("都道府県IDのバリデーション", () => {
    it("有効な都道府県IDを受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "1",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("都道府県IDが空の場合エラーを返す", () => {
      const invalidData = {
        date: today,
        prefecture_id: "",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "都道府県を選択してください"
        );
      }
    });

    it("都道府県IDが未定義の場合エラーを返す", () => {
      const invalidData = {
        date: today,
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const prefError = result.error.issues.find((i) =>
          i.message.includes("都道府県")
        );
        expect(prefError?.message).toBe("都道府県は必須です");
      }
    });
  });

  describe("睡眠時間のバリデーション", () => {
    it("0時間を受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 0,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("24時間を受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 24,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("負の値を拒否する", () => {
      const invalidData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: -1,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "睡眠時間は0時間以上で入力してください"
        );
      }
    });

    it("24時間を超える値を拒否する", () => {
      const invalidData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 25,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "睡眠時間は24時間以下で入力してください"
        );
      }
    });

    it("睡眠時間が未定義の場合エラーを返す", () => {
      const invalidData = {
        date: today,
        prefecture_id: "13",
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const sleepError = result.error.issues.find((i) =>
          i.message.includes("睡眠時間")
        );
        expect(sleepError?.message).toBe("睡眠時間は必須です");
      }
    });
  });

  describe("気分スコアのバリデーション", () => {
    it("-5を受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: -5,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("5を受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 5,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("0を受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 0,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("-5未満の値を拒否する", () => {
      const invalidData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: -6,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "気分スコアは-5以上で入力してください"
        );
      }
    });

    it("5を超える値を拒否する", () => {
      const invalidData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 6,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "気分スコアは5以下で入力してください"
        );
      }
    });

    it("気分スコアが未定義の場合エラーを返す", () => {
      const invalidData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const moodError = result.error.issues.find((i) =>
          i.message.includes("気分スコア")
        );
        expect(moodError?.message).toBe("気分スコアは必須です");
      }
    });
  });

  describe("オプショナルフィールドのバリデーション", () => {
    it("symptomsが未定義でも成功する", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("notesが未定義でも成功する", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("複数の症状を受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
        symptoms: ["headache", "fatigue", "nausea"],
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("長いメモを受け入れる", () => {
      const validData = {
        date: today,
        prefecture_id: "13",
        sleep_hours: 7,
        mood_score: 3,
        notes: "非常に長いメモの内容".repeat(100),
      };

      const result = dailyLogSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("複数フィールドのバリデーション", () => {
    it("複数のフィールドが無効な場合、複数のエラーを返す", () => {
      const invalidData = {
        date: yesterday,
        prefecture_id: "",
        sleep_hours: -1,
        mood_score: 10,
      };

      const result = dailyLogSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(4);
      }
    });
  });
});
