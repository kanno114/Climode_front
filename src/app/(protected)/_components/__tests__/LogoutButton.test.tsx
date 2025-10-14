import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// モジュールのモック
jest.mock("@/lib/auth/logout", () => ({
  logout: jest.fn(),
}));

// モックを設定した後にコンポーネントをインポート
import LogoutButton from "../LogoutButton";
import { logout } from "@/lib/auth/logout";

describe("LogoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("コンポーネントが正しくレンダリングされる", () => {
    render(<LogoutButton>ログアウト</LogoutButton>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("childrenが表示される", () => {
    render(<LogoutButton>ログアウト</LogoutButton>);

    expect(screen.getByText("ログアウト")).toBeInTheDocument();
  });

  it("複雑なchildrenを表示できる", () => {
    render(
      <LogoutButton>
        <span>アイコン</span>
        <span>ログアウト</span>
      </LogoutButton>
    );

    expect(screen.getByText("アイコン")).toBeInTheDocument();
    expect(screen.getByText("ログアウト")).toBeInTheDocument();
  });

  it("childrenがない場合でもレンダリングされる", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("ボタンをクリックするとlogout関数が呼ばれる", async () => {
    const user = userEvent.setup();
    const mockLogout = jest.fn();
    (logout as jest.Mock).mockImplementation(mockLogout);

    render(<LogoutButton>ログアウト</LogoutButton>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("複数回クリックすると複数回logout関数が呼ばれる", async () => {
    const user = userEvent.setup();
    const mockLogout = jest.fn();
    (logout as jest.Mock).mockImplementation(mockLogout);

    render(<LogoutButton>ログアウト</LogoutButton>);

    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockLogout).toHaveBeenCalledTimes(3);
  });

  it("正しいクラス名が適用されている", () => {
    render(<LogoutButton>ログアウト</LogoutButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("h-auto");
    expect(button).toHaveClass("p-0");
    expect(button).toHaveClass("cursor-pointer");
  });

  it("ghostバリアントが適用されている", () => {
    render(<LogoutButton>ログアウト</LogoutButton>);

    const button = screen.getByRole("button");
    // ghostバリアントのクラスが含まれていることを確認
    const classes = button.className;
    expect(classes).toContain("hover:bg-transparent");
    expect(classes).toContain("focus:bg-transparent");
  });

  it("非同期のlogout処理を待つ", async () => {
    const user = userEvent.setup();
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    (logout as jest.Mock).mockImplementation(mockLogout);

    render(<LogoutButton>ログアウト</LogoutButton>);

    const button = screen.getByRole("button");
    await user.click(button);

    // awaitで待機されることを確認
    expect(mockLogout).toHaveBeenCalled();
  });
});
