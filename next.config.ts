import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopackではfsモジュールは自動的にクライアント側で無効化されるため、
  // 明示的な設定は不要
};

export default nextConfig;
