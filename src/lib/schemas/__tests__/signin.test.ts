import { signInSchema } from "../signin";

describe("signInSchema", () => {
  describe("成功ケース", () => {
    it("有効なメールアドレスとパスワードを受け入れる", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("8文字のパスワードを受け入れる", () => {
      const validData = {
        email: "user@test.com",
        password: "12345678",
      };

      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("長いパスワードを受け入れる", () => {
      const validData = {
        email: "user@test.com",
        password: "very_long_password_with_many_characters_123",
      };

      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("メールアドレスのバリデーション", () => {
    it("メールアドレスが空の場合エラーを返す", () => {
      const invalidData = {
        email: "",
        password: "password123",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("メールアドレス");
      }
    });

    it("メールアドレスが無効な形式の場合エラーを返す", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "メールアドレスの形式が正しくありません"
        );
      }
    });

    it("@がないメールアドレスを拒否する", () => {
      const invalidData = {
        email: "testexample.com",
        password: "password123",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("メールアドレスが未定義の場合エラーを返す", () => {
      const invalidData = {
        password: "password123",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("メールアドレスは必須です");
      }
    });
  });

  describe("パスワードのバリデーション", () => {
    it("パスワードが空の場合エラーを返す", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("パスワード");
      }
    });

    it("パスワードが8文字未満の場合エラーを返す", () => {
      const invalidData = {
        email: "test@example.com",
        password: "1234567",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "パスワードを入力してください"
        );
      }
    });

    it("パスワードが未定義の場合エラーを返す", () => {
      const invalidData = {
        email: "test@example.com",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("パスワードは必須です");
      }
    });
  });

  describe("複数フィールドのバリデーション", () => {
    it("すべてのフィールドが無効な場合、複数のエラーを返す", () => {
      const invalidData = {
        email: "invalid-email",
        password: "short",
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it("両方のフィールドが欠落している場合エラーを返す", () => {
      const invalidData = {};

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBe(2);
      }
    });
  });
});
