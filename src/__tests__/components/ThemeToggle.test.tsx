import { render, screen } from "@testing-library/react";

const mockSetTheme = jest.fn();
let mockTheme = "system";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

import { ThemeToggle } from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTheme = "system";
  });

  it("コンポーネントが正しくレンダリングされる", () => {
    render(<ThemeToggle />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("現在のテーマが「システム」として表示される", () => {
    render(<ThemeToggle />);

    expect(screen.getByText("システム")).toBeInTheDocument();
  });

  it("テーマが「light」の場合「ライト」と表示される", () => {
    mockTheme = "light";
    render(<ThemeToggle />);

    expect(screen.getByText("ライト")).toBeInTheDocument();
  });

  it("テーマが「dark」の場合「ダーク」と表示される", () => {
    mockTheme = "dark";
    render(<ThemeToggle />);

    expect(screen.getByText("ダーク")).toBeInTheDocument();
  });
});
