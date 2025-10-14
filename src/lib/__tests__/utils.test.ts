import { cn } from "../utils";

describe("cn utility function", () => {
  it("単一のクラス名を返す", () => {
    expect(cn("text-center")).toBe("text-center");
  });

  it("複数のクラス名を結合する", () => {
    expect(cn("text-center", "font-bold")).toBe("text-center font-bold");
  });

  it("Tailwindのクラスを正しくマージする（後勝ち）", () => {
    // 同じプロパティの場合、後のクラスが優先される
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("条件付きクラス名を処理する", () => {
    expect(cn("base", true && "active")).toBe("base active");
    expect(cn("base", false && "inactive")).toBe("base");
  });

  it("undefined値を無視する", () => {
    expect(cn("text-center", undefined)).toBe("text-center");
    expect(cn(undefined, "font-bold")).toBe("font-bold");
  });

  it("null値を無視する", () => {
    expect(cn("text-center", null)).toBe("text-center");
    expect(cn(null, "font-bold")).toBe("font-bold");
  });

  it("空文字列を処理する", () => {
    expect(cn("", "font-bold")).toBe("font-bold");
    expect(cn("text-center", "")).toBe("text-center");
  });

  it("配列形式のクラス名を処理する", () => {
    expect(cn(["text-center", "font-bold"])).toBe("text-center font-bold");
  });

  it("オブジェクト形式のクラス名を処理する", () => {
    expect(cn({ "text-center": true, "font-bold": false })).toBe("text-center");
    expect(cn({ "text-center": false, "font-bold": true })).toBe("font-bold");
  });

  it("複雑な組み合わせを処理する", () => {
    expect(
      cn(
        "base-class",
        { active: true, disabled: false },
        ["extra-class"],
        undefined,
        "final-class"
      )
    ).toBe("base-class active extra-class final-class");
  });

  it("重複するクラス名を削除する", () => {
    expect(cn("text-center", "text-center")).toBe("text-center");
  });

  it("Tailwindの競合するクラスで後のものを優先する", () => {
    // bg-colorの場合
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    // paddingの場合
    expect(cn("p-2", "p-4", "p-6")).toBe("p-6");
  });
});
