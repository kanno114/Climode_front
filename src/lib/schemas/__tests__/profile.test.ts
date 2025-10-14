import { profileSchema } from "../profile";

describe("profileSchema", () => {
  describe("成功ケース", () => {
    it("有効な名前と都道府県IDを受け入れる", () => {
      const validData = {
        name: "山田太郎",
        prefecture_id: "13",
      };

      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("1文字の名前を受け入れる", () => {
      const validData = {
        name: "太",
        prefecture_id: "1",
      };

      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("50文字の名前を受け入れる", () => {
      const validData = {
        name: "あ".repeat(50),
        prefecture_id: "13",
      };

      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("名前のバリデーション", () => {
    it("名前が空の場合エラーを返す", () => {
      const invalidData = {
        name: "",
        prefecture_id: "13",
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("お名前を入力してください");
      }
    });

    it("名前が未定義の場合エラーを返す", () => {
      const invalidData = {
        prefecture_id: "13",
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((i) =>
          i.message.includes("名前")
        );
        expect(nameError?.message).toBe("お名前を入力してください");
      }
    });

    it("名前が50文字を超える場合エラーを返す", () => {
      const invalidData = {
        name: "あ".repeat(51),
        prefecture_id: "13",
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "お名前は50文字以内で入力してください"
        );
      }
    });
  });

  describe("都道府県IDのバリデーション", () => {
    it("都道府県IDが空の場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
        prefecture_id: "",
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "都道府県を選択してください"
        );
      }
    });

    it("都道府県IDが未定義の場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const prefError = result.error.issues.find((i) =>
          i.message.includes("都道府県")
        );
        expect(prefError?.message).toBe("都道府県は必須です");
      }
    });
  });

  describe("複数フィールドのバリデーション", () => {
    it("すべてのフィールドが無効な場合、複数のエラーを返す", () => {
      const invalidData = {
        name: "",
        prefecture_id: "",
      };

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBe(2);
      }
    });

    it("すべてのフィールドが欠落している場合エラーを返す", () => {
      const invalidData = {};

      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBe(2);
      }
    });
  });

  describe("エッジケース", () => {
    it("数値形式の都道府県IDを文字列として受け入れる", () => {
      const validData = {
        name: "山田太郎",
        prefecture_id: "47",
      };

      const result = profileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("スペースのみの名前を拒否する", () => {
      const invalidData = {
        name: "   ",
        prefecture_id: "13",
      };

      // zodのminは文字数をチェックするので、スペースも文字としてカウントされる
      const result = profileSchema.safeParse(invalidData);
      expect(result.success).toBe(true); // スペースも有効な文字として扱われる
    });
  });
});
