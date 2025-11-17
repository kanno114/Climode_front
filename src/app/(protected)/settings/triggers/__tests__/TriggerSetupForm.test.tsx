import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { Trigger } from "@/lib/schemas/triggers";

const mockRegisterTriggerSelection = jest.fn();
(mockRegisterTriggerSelection as unknown as { $$typeof?: symbol }).$$typeof =
  Symbol.for("react.server.reference");

jest.mock("../actions", () => ({
  registerTriggerSelection: (...args: unknown[]) =>
    mockRegisterTriggerSelection(...args),
}));

// useActionStateのモック
const mockUseActionState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (action: unknown, initialState: unknown) =>
    mockUseActionState(action, initialState),
}));

// モックを設定した後にコンポーネントをインポート
import { TriggerSetupForm } from "../_components/TriggerSetupForm";

const mockTriggers: Trigger[] = [
  {
    id: 1,
    key: "pressure_drop",
    label: "気圧低下",
    category: "env",
    is_active: true,
    version: 1,
    rule: {
      metric: "pressure_drop_6h",
      operator: "lte",
      levels: [{ id: "attention", label: "注意", threshold: -3, priority: 50 }],
    },
  },
  {
    id: 2,
    key: "temperature_change",
    label: "気温変化",
    category: "env",
    is_active: true,
    version: 1,
    rule: {
      metric: "temperature_change_24h",
      operator: "gte",
      levels: [{ id: "warning", label: "警告", threshold: 5, priority: 100 }],
    },
  },
  {
    id: 3,
    key: "fatigue",
    label: "疲労感",
    category: "body",
    is_active: true,
    version: 1,
    rule: {
      metric: "fatigue_level",
      operator: "gte",
      levels: [{ id: "mild", label: "軽度", threshold: 3, priority: 30 }],
    },
  },
];

describe("TriggerSetupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterTriggerSelection.mockResolvedValue({ status: "idle" });

    // useActionStateのデフォルト動作を設定
    mockUseActionState.mockImplementation(() => [
      { status: "idle" }, // lastResult
      jest.fn(), // action
      false, // pending
    ]);
  });

  it("トリガーリストをカテゴリ別に表示する", () => {
    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    expect(screen.getByText("気になるトリガーを選択")).toBeVisible();
    expect(screen.getByText("環境要因")).toBeVisible();
    expect(screen.getByText("身体要因")).toBeVisible();
    expect(screen.getByText("気圧低下")).toBeVisible();
    expect(screen.getByText("気温変化")).toBeVisible();
    expect(screen.getByText("疲労感")).toBeVisible();
  });

  it("初期選択状態を反映する", () => {
    render(
      <TriggerSetupForm
        triggers={mockTriggers}
        initialSelectedKeys={["pressure_drop"]}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // 最初のトリガー（pressure_drop）が選択されていることを確認
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "true");
    // 他のトリガーは選択されていないことを確認
    expect(checkboxes[1]).toHaveAttribute("aria-checked", "false");
    expect(checkboxes[2]).toHaveAttribute("aria-checked", "false");
  });

  it("カードクリックでトリガーをトグルできる", () => {
    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    const card = screen.getByText("気圧低下").closest('[role="button"]');
    expect(card).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    const firstCheckbox = checkboxes[0];
    expect(firstCheckbox).toHaveAttribute("aria-checked", "false");

    fireEvent.click(card!);

    expect(firstCheckbox).toHaveAttribute("aria-checked", "true");
  });

  it("チェックボックスでトリガーをトグルできる", () => {
    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const firstCheckbox = checkboxes[0];

    expect(firstCheckbox).toHaveAttribute("aria-checked", "false");

    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toHaveAttribute("aria-checked", "true");

    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toHaveAttribute("aria-checked", "false");
  });

  it("全選択ボタンで全てのトリガーを選択できる", () => {
    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    const selectAllButton = screen.getByRole("button", { name: "すべて選択" });
    fireEvent.click(selectAllButton);

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute("aria-checked", "true");
    });
  });

  it("クリアボタンで全てのトリガーを解除できる", () => {
    render(
      <TriggerSetupForm
        triggers={mockTriggers}
        initialSelectedKeys={mockTriggers.map((t) => t.key)}
      />
    );

    const clearButton = screen.getByRole("button", { name: "クリア" });
    fireEvent.click(clearButton);

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute("aria-checked", "false");
    });
  });

  it("フォーム送信でサーバーアクションを呼び出す", async () => {
    const mockAction = jest.fn();
    mockUseActionState.mockImplementation(() => [
      { status: "idle" },
      mockAction,
      false,
    ]);

    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    // トリガーを選択
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]); // 気圧低下
    fireEvent.click(checkboxes[1]); // 気温変化

    // フォーム送信
    const submitButton = screen.getByRole("button", { name: "登録して続行" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });

    const callArgs = mockAction.mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(FormData);
  });

  it("エラー状態を表示する", () => {
    mockUseActionState.mockImplementation(() => [
      {
        status: "error",
        errors: ["エラーメッセージ1", "エラーメッセージ2"],
      },
      jest.fn(),
      false,
    ]);

    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    // AlertTitleが表示されることを確認
    expect(screen.getByText("登録に失敗しました")).toBeVisible();
    // エラーメッセージがリストとして表示されることを確認
    expect(screen.getByText("エラーメッセージ1")).toBeVisible();
    expect(screen.getByText("エラーメッセージ2")).toBeVisible();
  });

  it("ローディング中はボタンが無効化される", () => {
    mockUseActionState.mockImplementation(() => [
      { status: "idle" },
      jest.fn(),
      true, // pending = true
    ]);

    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    const submitButton = screen.getByRole("button", { name: "登録中..." });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText("登録中...")).toBeVisible();
  });

  it("Enterキーでカードをトグルできる", () => {
    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    const card = screen.getByText("気圧低下").closest('[role="button"]');
    expect(card).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    const firstCheckbox = checkboxes[0];
    expect(firstCheckbox).toHaveAttribute("aria-checked", "false");

    fireEvent.keyDown(card!, { key: "Enter" });

    expect(firstCheckbox).toHaveAttribute("aria-checked", "true");
  });

  it("カード内のチェックボックスをクリックしてもカードのトグルが発火しない", () => {
    render(
      <TriggerSetupForm triggers={mockTriggers} initialSelectedKeys={[]} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const firstCheckbox = checkboxes[0];

    // チェックボックスを直接クリック
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toHaveAttribute("aria-checked", "true");

    // 再度クリック（カードのトグルが発火しないことを確認）
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toHaveAttribute("aria-checked", "false");
  });
});
