import { render, screen, waitFor } from "@testing-library/react";

const mockUseForm = jest.fn();
jest.mock("@conform-to/react", () => ({
  useForm: (...args: unknown[]) => mockUseForm(...args),
}));

jest.mock("@/app/(protected)/evening/actions", () => ({
  submitEveningReflection: jest.fn(),
}));

const mockUseActionState = jest.fn();
const mockUseTransition = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (action: unknown, initialState: unknown) =>
    mockUseActionState(action, initialState),
  useTransition: () => mockUseTransition(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

import { EveningReflectionForm } from "../EveningReflectionForm";
import { toast } from "sonner";

describe("EveningReflectionForm", () => {
  const mockSuggestions = [
    {
      key: "pressure_drop_signal_warning",
      title: "気圧低下の警告",
      message: "気圧が低下しています",
      tags: ["weather"],
      severity: 3,
    },
    {
      key: "low_mood",
      title: "気分が低い",
      message: "気分が低い状態です",
      tags: ["mood"],
      severity: 2,
    },
  ];

  const defaultProps = {
    initialSuggestions: mockSuggestions,
    initialDailyLog: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseForm.mockReturnValue([
      {
        id: "evening-reflection-form",
        errors: [],
        onSubmit: jest.fn(),
      },
    ]);
    mockUseActionState.mockImplementation(() => [undefined, jest.fn(), false]);
    mockUseTransition.mockImplementation(() => [false, jest.fn()]);
  });

  it("提案が表示される", async () => {
    render(<EveningReflectionForm {...defaultProps} />);

    expect(screen.getByText("今日の提案")).toBeInTheDocument();
    expect(screen.getByText("気圧低下の警告")).toBeInTheDocument();
    expect(screen.getByText("気分が低い")).toBeInTheDocument();
  });

  it("提案がない場合は提案セクションが表示されない", async () => {
    render(
      <EveningReflectionForm
        initialSuggestions={[]}
        initialDailyLog={null}
      />
    );

    expect(screen.queryByText("今日の提案")).not.toBeInTheDocument();
  });

  it("出来事入力欄が表示される", async () => {
    render(<EveningReflectionForm {...defaultProps} />);

    expect(screen.getByText("出来事")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("今日の出来事や気づきを記録してください...")
    ).toBeInTheDocument();
  });

  it("送信ボタンが表示される", async () => {
    render(<EveningReflectionForm {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "保存してダッシュボードへ" })
    ).toBeInTheDocument();
  });

  it("pending状態では送信ボタンが無効になる", async () => {
    mockUseActionState.mockImplementation(() => [undefined, jest.fn(), true]);
    mockUseTransition.mockImplementation(() => [true, jest.fn()]);

    render(<EveningReflectionForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /保存中/i });
    expect(submitButton).toBeDisabled();
  });

  it("エラー時にtoast.errorが呼ばれる", async () => {
    mockUseActionState.mockImplementation(() => [
      {
        status: "error",
        error: { message: "保存に失敗しました" },
      },
      jest.fn(),
      false,
    ]);

    render(<EveningReflectionForm {...defaultProps} />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("保存に失敗しました");
    });
  });

  it("エラー時にformErrorsが表示される", async () => {
    mockUseForm.mockReturnValue([
      {
        id: "evening-reflection-form",
        errors: ["バリデーションエラー"],
        onSubmit: jest.fn(),
      },
    ]);

    render(<EveningReflectionForm {...defaultProps} />);

    expect(screen.getByText("バリデーションエラー")).toBeInTheDocument();
  });

  it("既存の振り返りデータが初期値として反映される", () => {
    render(
      <EveningReflectionForm
        initialSuggestions={mockSuggestions}
        initialDailyLog={{
          note: "今日は良い日だった",
          self_score: 3,
          suggestion_feedbacks: [
            { suggestion_key: "pressure_drop_signal_warning", helpfulness: true },
          ],
        }}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "今日の出来事や気づきを記録してください..."
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe("今日は良い日だった");
  });
});
