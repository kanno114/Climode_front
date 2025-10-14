import { signUpSchema } from "../signup";

describe("signUpSchema", () => {
  describe("成功ケース", () => {
    it("すべてのフィールドが有効な場合成功する", () => {
      const validData = {
        name: "山田太郎",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("長い名前を受け入れる", () => {
      const validData = {
        name: "とても長い名前のユーザー",
        email: "user@test.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("名前のバリデーション", () => {
    it("名前が空の場合エラーを返す", () => {
      const invalidData = {
        name: "",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("お名前を入力してください");
      }
    });

    it("名前が未定義の場合エラーを返す", () => {
      const invalidData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((i) =>
          i.message.includes("名前")
        );
        expect(nameError?.message).toBe("お名前を入力してください");
      }
    });
  });

  describe("メールアドレスのバリデーション", () => {
    it("無効なメールアドレス形式を拒否する", () => {
      const invalidData = {
        name: "山田太郎",
        email: "invalid-email",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "有効なメールアドレスを入力してください"
        );
      }
    });

    it("メールアドレスが空の場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
        email: "",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("メールアドレスが未定義の場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
        password: "password123",
        confirmPassword: "password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((i) =>
          i.message.includes("メールアドレス")
        );
        expect(emailError?.message).toBe("メールアドレスは必須です");
      }
    });
  });

  describe("パスワードのバリデーション", () => {
    it("パスワードが8文字未満の場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
        email: "test@example.com",
        password: "short",
        confirmPassword: "short",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "パスワードは8文字以上で入力してください"
        );
      }
    });

    it("パスワードが未定義の場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
        email: "test@example.com",
        confirmPassword: "password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find(
          (i) => i.message === "パスワードは必須です"
        );
        expect(passwordError).toBeDefined();
      }
    });
  });

  describe("パスワード確認のバリデーション", () => {
    it("パスワードと確認パスワードが一致しない場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "different123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const mismatchError = result.error.issues.find(
          (i) => i.message === "パスワードが一致しません"
        );
        expect(mismatchError).toBeDefined();
        expect(mismatchError?.path).toContain("confirmPassword");
      }
    });

    it("確認パスワードが空の場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) =>
          i.message.includes("パスワード確認")
        );
        expect(confirmError).toBeDefined();
      }
    });

    it("確認パスワードが未定義の場合エラーを返す", () => {
      const invalidData = {
        name: "山田太郎",
        email: "test@example.com",
        password: "password123",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find(
          (i) => i.message === "パスワード確認は必須です"
        );
        expect(confirmError).toBeDefined();
      }
    });
  });

  describe("複数フィールドのバリデーション", () => {
    it("すべてのフィールドが無効な場合、複数のエラーを返す", () => {
      const invalidData = {
        name: "",
        email: "invalid",
        password: "short",
        confirmPassword: "different",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });

    it("すべてのフィールドが欠落している場合エラーを返す", () => {
      const invalidData = {};

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(4);
      }
    });
  });
});
