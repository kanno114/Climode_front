import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUseForm = jest.fn();
jest.mock("@conform-to/react", () => ({
  useForm: (...args: unknown[]) => mockUseForm(...args),
}));

jest.mock("@/app/(protected)/morning/actions", () => ({
  submitMorningDeclaration: jest.fn(),
}));

const mockUseActionState = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (action: unknown, initialState: unknown) =>
    mockUseActionState(action, initialState),
}));

const mockSlider = jest.fn(
  ({ disabled }: { disabled?: boolean; className?: string }) => (
    <div
      data-testid="slider"
      data-disabled={disabled ? "true" : "false"}
      role="presentation"
    />
  )
);
jest.mock("@/components/ui/slider", () => ({
  Slider: (props: { disabled?: boolean; className?: string }) =>
    mockSlider(props),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

import { MorningDeclarationForm } from "../MorningDeclarationForm";
import { toast } from "sonner";

describe("MorningDeclarationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseForm.mockReturnValue([
      {
        id: "form-id",
        errors: [],
        onSubmit: jest.fn(),
      },
      {
        sleep_hours: { name: "sleep_hours", errors: [] },
        mood: { name: "mood", errors: [] },
        fatigue: { name: "fatigue", errors: [] },
      },
    ]);
    mockUseActionState.mockImplementation(() => [undefined, jest.fn(), false]);
  });

  it("フォームの主要なUIが表示される", () => {
    render(<MorningDeclarationForm />);

    expect(screen.getByText("睡眠時間（時間）")).toBeInTheDocument();
    expect(screen.getByText("気分（1〜5）")).toBeInTheDocument();
    expect(screen.getByText("疲労感（1〜5）")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "今日の提案を見てみる" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /とても悪い/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /とても高い/i })
    ).toBeInTheDocument();
  });

  it("気分と疲労感のボタンが選択できる", async () => {
    const user = userEvent.setup();
    render(<MorningDeclarationForm />);

    await user.click(screen.getByRole("button", { name: /とても良い/i }));
    const moodInput = document.querySelector(
      'input[name="mood"]'
    ) as HTMLInputElement;
    expect(moodInput.value).toBe("5");

    await user.click(screen.getByRole("button", { name: /とても高い/i }));
    const fatigueInput = document.querySelector(
      'input[name="fatigue"]'
    ) as HTMLInputElement;
    expect(fatigueInput.value).toBe("5");
  });

  it("pending状態ではUIが無効になる", () => {
    mockUseActionState.mockImplementation(() => [undefined, jest.fn(), true]);

    render(<MorningDeclarationForm />);

    expect(
      screen.getByRole("button", { name: "送信中..." })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "送信中..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: /とても悪い/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /とても高い/i })).toBeDisabled();
    expect(screen.getByTestId("slider")).toHaveAttribute(
      "data-disabled",
      "true"
    );
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

    render(<MorningDeclarationForm />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("保存に失敗しました");
    });
  });
});
