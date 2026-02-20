import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";

// next-themesのモック
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

describe("ThemeProvider", () => {
  it("子要素が正しくレンダリングされる", () => {
    render(
      <ThemeProvider>
        <p>テスト子要素</p>
      </ThemeProvider>
    );

    expect(screen.getByText("テスト子要素")).toBeInTheDocument();
  });

  it("ThemeProviderがラッパーとして存在する", () => {
    render(
      <ThemeProvider>
        <p>テスト</p>
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
  });
});
