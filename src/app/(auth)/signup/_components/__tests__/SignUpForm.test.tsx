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
import { signUpAction } from "../../actions";

// useActionStateのモック
const mockUseActionState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (action: any, initialState: any) =>
    mockUseActionState(action, initialState),
}));

describe("SignUpForm", () => {
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
    render(<SignUpForm />);

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
  });

  it("Googleログインボタンがクリックできる", async () => {
    const user = userEvent.setup();
    const mockSignIn = jest.fn();
    (signIn as jest.Mock).mockImplementation(mockSignIn);

    render(<SignUpForm />);

    const googleButton = screen.getByRole("button", {
      name: /Googleで登録/i,
    });
    await user.click(googleButton);

    expect(mockSignIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/dashboard",
    });
  });

  it("すべての入力フィールドが有効である", () => {
    render(<SignUpForm />);

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
    render(<SignUpForm />);

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

    render(<SignUpForm />);

    expect(screen.getByText("登録中...")).toBeInTheDocument();
  });

  it("pending状態の時、入力フィールドが無効になる", () => {
    mockUseActionState.mockImplementation(() => [
      undefined,
      jest.fn(),
      true, // pending = true
    ]);

    render(<SignUpForm />);

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

    render(<SignUpForm />);

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
    const mockToast = {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    };
    (toast as any).error = mockToast.error;

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

    render(<SignUpForm />);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("登録に失敗しました");
    });
  });

  it("区切り線とテキストが表示される", () => {
    render(<SignUpForm />);
    expect(screen.getByText("または")).toBeInTheDocument();
  });

  it("すべてのラベルが正しく表示される", () => {
    render(<SignUpForm />);
    expect(screen.getByText("お名前")).toBeInTheDocument();
    expect(screen.getByText("メールアドレス")).toBeInTheDocument();
    // パスワードラベルは2つある（パスワード、パスワード確認）
    const passwordLabels = screen.getAllByText("パスワード");
    expect(passwordLabels).toHaveLength(1);
    expect(screen.getByText("パスワード確認")).toBeInTheDocument();
  });

  it("名前フィールドにテキスト入力ができる", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const nameInput = screen.getByPlaceholderText("山田太郎");
    await user.type(nameInput, "テスト太郎");

    expect(nameInput).toHaveValue("テスト太郎");
  });

  it("メールアドレスフィールドにテキスト入力ができる", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const emailInput = screen.getByPlaceholderText("example@email.com");
    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("パスワードフィールドにテキスト入力ができる", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const passwordInput = screen.getByPlaceholderText("8文字以上で入力");
    await user.type(passwordInput, "password123");

    expect(passwordInput).toHaveValue("password123");
  });

  it("パスワード確認フィールドにテキスト入力ができる", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const confirmPasswordInput =
      screen.getByPlaceholderText("パスワードを再入力");
    await user.type(confirmPasswordInput, "password123");

    expect(confirmPasswordInput).toHaveValue("password123");
  });
});
