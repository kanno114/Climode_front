import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUseForm = jest.fn();
jest.mock("@conform-to/react", () => ({
  useForm: (...args: unknown[]) => mockUseForm(...args),
}));

jest.mock("@/app/(protected)/evening/actions", () => ({
  getTodaySuggestions: jest.fn(),
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
import { getTodaySuggestions } from "@/app/(protected)/evening/actions";
import { toast } from "sonner";

describe("EveningReflectionForm", () => {
  const mockSuggestions = [
    {
      key: "pressure_drop_signal_warning",
      title: "気圧低下の警告",
      description: "気圧が低下しています",
      tags: ["weather"],
      severity: 3,
      triggers: ["pressure_drop"],
    },
    {
      key: "low_mood",
      title: "気分が低い",
      description: "気分が低い状態です",
      tags: ["mood"],
      severity: 2,
      triggers: ["mood"],
    },
  ];

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
    (getTodaySuggestions as jest.Mock).mockResolvedValue(mockSuggestions);
  });

  it("ローディング状態が表示される", () => {
    (getTodaySuggestions as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // 解決しないPromise
    );

    render(<EveningReflectionForm />);

    expect(screen.getByText("データを読み込んでいます...")).toBeInTheDocument();
  });

  it("提案が表示される", async () => {
    render(<EveningReflectionForm />);

    await waitFor(() => {
      expect(screen.getByText("今日の提案")).toBeInTheDocument();
    });

    expect(screen.getByText("気圧低下の警告")).toBeInTheDocument();
    expect(screen.getByText("気分が低い")).toBeInTheDocument();
  });

  it("提案がない場合は提案セクションが表示されない", async () => {
    (getTodaySuggestions as jest.Mock).mockResolvedValue([]);

    render(<EveningReflectionForm />);

    await waitFor(() => {
      expect(screen.queryByText("今日の提案")).not.toBeInTheDocument();
    });
  });

  it("出来事入力欄が表示される", async () => {
    render(<EveningReflectionForm />);

    await waitFor(() => {
      expect(screen.getByText("出来事")).toBeInTheDocument();
    });

    expect(
      screen.getByPlaceholderText("今日の出来事や気づきを記録してください...")
    ).toBeInTheDocument();
  });

  it("送信ボタンが表示される", async () => {
    render(<EveningReflectionForm />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "保存してダッシュボードへ" })
      ).toBeInTheDocument();
    });
  });

  it("pending状態では送信ボタンが無効になる", async () => {
    mockUseActionState.mockImplementation(() => [undefined, jest.fn(), true]);
    mockUseTransition.mockImplementation(() => [true, jest.fn()]);

    render(<EveningReflectionForm />);

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /保存中/i });
      expect(submitButton).toBeDisabled();
    });
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

    render(<EveningReflectionForm />);

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

    render(<EveningReflectionForm />);

    await waitFor(() => {
      expect(screen.getByText("バリデーションエラー")).toBeInTheDocument();
    });
  });

  it("データ取得エラー時にエラーメッセージが表示される", async () => {
    (getTodaySuggestions as jest.Mock).mockRejectedValue(
      new Error("データ取得エラー")
    );

    render(<EveningReflectionForm />);

    await waitFor(() => {
      expect(screen.getByText("データの取得に失敗しました")).toBeInTheDocument();
    });
  });
});

