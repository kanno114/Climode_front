import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// モジュールのモック（コンポーネントのインポート前に設定）
jest.mock("@/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: () => null,
}));

jest.mock("../../actions", () => ({
  signUpAction: jest.fn(),
}));

// モックを設定した後にコンポーネントをインポート
import { SignUpForm } from "../SignUpForm";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

// useActionStateのモック
const mockUseActionState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (action: unknown, initialState: unknown) =>
    mockUseActionState(action, initialState),
}));

describe("SignUpForm", () => {
  const mockPrefectures = [
    { id: 1, code: "01", name_ja: "北海道" },
    { id: 13, code: "13", name_ja: "東京都" },
    { id: 27, code: "27", name_ja: "大阪府" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // useActionStateのデフォルト動作を設定
    mockUseActionState.mockImplementation(() => [
      undefined, // lastResult
      jest.fn(), // action
      false, // pending
    ]);
  });

  it("フォームが正しくレンダリングされる", () => {
    render(<SignUpForm prefectures={mockPrefectures} />);

    expect(
      screen.getByRole("button", { name: /Googleで登録/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("山田太郎")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("example@email.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("8文字以上で入力")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("パスワードを再入力")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "アカウント作成" })
    ).toBeInTheDocument();
    expect(screen.getByText("取得地域（都道府県）")).toBeInTheDocument();
  });

  it("Googleログインボタンがクリックできる", async () => {
    const user = userEvent.setup();
    const mockSignIn = jest.fn();
    (signIn as jest.Mock).mockImplementation(mockSignIn);

    render(<SignUpForm prefectures={mockPrefectures} />);

    const googleButton = screen.getByRole("button", {
      name: /Googleで登録/i,
    });
    await user.click(googleButton);

    expect(mockSignIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/onboarding/welcome",
    });
  });

  it("すべての入力フィールドが有効である", () => {
    render(<SignUpForm prefectures={mockPrefectures} />);

    const nameInput = screen.getByPlaceholderText(
      "山田太郎"
    ) as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(
      "example@email.com"
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "8文字以上で入力"
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByPlaceholderText(
      "パスワードを再入力"
    ) as HTMLInputElement;

    expect(nameInput).toBeEnabled();
    expect(emailInput).toBeEnabled();
    expect(passwordInput).toBeEnabled();
    expect(confirmPasswordInput).toBeEnabled();
    expect(nameInput.type).toBe("text");
    expect(emailInput.type).toBe("email");
    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");
  });

  it("フォームにsubmitボタンが存在する", () => {
    render(<SignUpForm prefectures={mockPrefectures} />);

    const submitButton = screen.getByRole("button", {
      name: "アカウント作成",
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });

  it("pending状態の時、ローディング表示になる", () => {
    mockUseActionState.mockImplementation(() => [
      undefined,
      jest.fn(),
      true, // pending = true
    ]);

    render(<SignUpForm prefectures={mockPrefectures} />);

    expect(screen.getByText("登録中...")).toBeInTheDocument();
  });

  it("pending状態の時、入力フィールドが無効になる", () => {
    mockUseActionState.mockImplementation(() => [
      undefined,
      jest.fn(),
      true, // pending = true
    ]);

    render(<SignUpForm prefectures={mockPrefectures} />);

    const nameInput = screen.getByPlaceholderText("山田太郎");
    const emailInput = screen.getByPlaceholderText("example@email.com");
    const passwordInput = screen.getByPlaceholderText("8文字以上で入力");
    const submitButton = screen.getByRole("button", { name: "登録中..." });

    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("バリデーションエラーが表示される", () => {
    mockUseActionState.mockImplementation(() => [
      {
        status: "error",
        error: {
          name: ["名前を入力してください"],
          email: ["メールアドレスを入力してください"],
          password: ["パスワードを入力してください"],
          confirmPassword: ["パスワードを再入力してください"],
        },
      },
      jest.fn(),
      false,
    ]);

    render(<SignUpForm prefectures={mockPrefectures} />);

    expect(screen.getByText("名前を入力してください")).toBeInTheDocument();
    expect(
      screen.getByText("メールアドレスを入力してください")
    ).toBeInTheDocument();
    expect(
      screen.getByText("パスワードを入力してください")
    ).toBeInTheDocument();
    expect(
      screen.getByText("パスワードを再入力してください")
    ).toBeInTheDocument();
  });

  it("サーバーエラーの時、toastエラーが表示される", async () => {
    const mockToastError = jest.fn();
    jest.spyOn(toast, "error").mockImplementation(mockToastError);

    mockUseActionState.mockImplementation(() => [
      {
        status: "error",
        error: {
          message: "登録に失敗しました",
        },
      },
      jest.fn(),
      false,
    ]);

    render(<SignUpForm prefectures={mockPrefectures} />);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("登録に失敗しました");
    });
  });

  it("区切り線とテキストが表示される", () => {
    render(<SignUpForm prefectures={mockPrefectures} />);
    expect(screen.getByText("または")).toBeInTheDocument();
  });

  it("すべてのラベルが正しく表示される", () => {
    render(<SignUpForm prefectures={mockPrefectures} />);
    expect(screen.getByText("お名前")).toBeInTheDocument();
    expect(screen.getByText("メールアドレス")).toBeInTheDocument();
    // パスワードラベルは2つある（パスワード、パスワード確認）
    const passwordLabels = screen.getAllByText("パスワード");
    expect(passwordLabels).toHaveLength(1);
    expect(screen.getByText("パスワード確認")).toBeInTheDocument();
    expect(screen.getByText("取得地域（都道府県）")).toBeInTheDocument();
  });

  it("名前フィールドにテキスト入力ができる", async () => {
    const user = userEvent.setup();
    render(<SignUpForm prefectures={mockPrefectures} />);

    const nameInput = screen.getByPlaceholderText("山田太郎");
    await user.type(nameInput, "テスト太郎");

    expect(nameInput).toHaveValue("テスト太郎");
  });

  it("メールアドレスフィールドにテキスト入力ができる", async () => {
    const user = userEvent.setup();
    render(<SignUpForm prefectures={mockPrefectures} />);

    const emailInput = screen.getByPlaceholderText("example@email.com");
    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("パスワードフィールドにテキスト入力ができる", async () => {
    const user = userEvent.setup();
    render(<SignUpForm prefectures={mockPrefectures} />);

    const passwordInput = screen.getByPlaceholderText("8文字以上で入力");
    await user.type(passwordInput, "password123");

    expect(passwordInput).toHaveValue("password123");
  });

  it("パスワード確認フィールドにテキスト入力ができる", async () => {
    const user = userEvent.setup();
    render(<SignUpForm prefectures={mockPrefectures} />);

    const confirmPasswordInput =
      screen.getByPlaceholderText("パスワードを再入力");
    await user.type(confirmPasswordInput, "password123");

    expect(confirmPasswordInput).toHaveValue("password123");
  });

  it("都道府県選択フィールドが表示される", () => {
    render(<SignUpForm prefectures={mockPrefectures} />);

    expect(screen.getByText("取得地域（都道府県）")).toBeInTheDocument();
    expect(screen.getByText("都道府県を選択してください")).toBeInTheDocument();
  });

  it("都道府県選択フィールドが有効である", () => {
    render(<SignUpForm prefectures={mockPrefectures} />);

    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeInTheDocument();
    expect(selectTrigger).toBeEnabled();
  });
});
