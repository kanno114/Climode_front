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
  signInAction: jest.fn(),
}));

// モックを設定した後にコンポーネントをインポート
import { SignInForm } from "../SignInForm";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

// useActionStateのモック
const mockUseActionState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (action: unknown, initialState: unknown) =>
    mockUseActionState(action, initialState),
}));

describe("SignInForm", () => {
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
    render(<SignInForm />);

    expect(
      screen.getByRole("button", { name: /Googleアカウントでログイン/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("example@email.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワードを入力")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログイン" })
    ).toBeInTheDocument();
  });

  it("Googleログインボタンがクリックできる", async () => {
    const user = userEvent.setup();
    const mockSignIn = jest.fn();
    (signIn as jest.Mock).mockImplementation(mockSignIn);

    render(<SignInForm />);

    const googleButton = screen.getByRole("button", {
      name: /Googleアカウントでログイン/i,
    });
    await user.click(googleButton);

    expect(mockSignIn).toHaveBeenCalledWith("google", {
      callbackUrl: "/dashboard",
    });
  });

  it("メールアドレスとパスワードの入力フィールドが有効である", async () => {
    render(<SignInForm />);

    const emailInput = screen.getByPlaceholderText(
      "example@email.com"
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "パスワードを入力"
    ) as HTMLInputElement;

    expect(emailInput).toBeEnabled();
    expect(passwordInput).toBeEnabled();
    expect(emailInput.type).toBe("email");
    expect(passwordInput.type).toBe("password");
  });

  it("フォームにsubmitボタンが存在する", () => {
    render(<SignInForm />);

    const submitButton = screen.getByRole("button", { name: "ログイン" });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });

  it("pending状態の時、ローディング表示になる", () => {
    mockUseActionState.mockImplementation(() => [
      undefined,
      jest.fn(),
      true, // pending = true
    ]);

    render(<SignInForm />);

    expect(screen.getByText("ログイン中...")).toBeInTheDocument();
  });

  it("pending状態の時、入力フィールドが無効になる", () => {
    mockUseActionState.mockImplementation(() => [
      undefined,
      jest.fn(),
      true, // pending = true
    ]);

    render(<SignInForm />);

    const emailInput = screen.getByPlaceholderText("example@email.com");
    const passwordInput = screen.getByPlaceholderText("パスワードを入力");
    const submitButton = screen.getByRole("button", { name: "ログイン中..." });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("バリデーションエラーが表示される", () => {
    mockUseActionState.mockImplementation(() => [
      {
        status: "error",
        error: {
          email: ["メールアドレスを入力してください"],
          password: ["パスワードを入力してください"],
        },
      },
      jest.fn(),
      false,
    ]);

    render(<SignInForm />);

    expect(
      screen.getByText("メールアドレスを入力してください")
    ).toBeInTheDocument();
    expect(
      screen.getByText("パスワードを入力してください")
    ).toBeInTheDocument();
  });

  it("サーバーエラーの時、toastエラーが表示される", async () => {
    const mockToast = {
      error: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    };
    (toast as { error: jest.Mock }).error = mockToast.error;

    mockUseActionState.mockImplementation(() => [
      {
        status: "error",
        error: {
          message: "ログインに失敗しました",
        },
      },
      jest.fn(),
      false,
    ]);

    render(<SignInForm />);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("ログインに失敗しました");
    });
  });

  it("区切り線とテキストが表示される", () => {
    render(<SignInForm />);
    expect(screen.getByText("または")).toBeInTheDocument();
  });

  it("ラベルが正しく表示される", () => {
    render(<SignInForm />);
    expect(screen.getByText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByText("パスワード")).toBeInTheDocument();
  });
});
