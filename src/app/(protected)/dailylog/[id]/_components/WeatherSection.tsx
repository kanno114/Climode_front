import {
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  CloudSun,
  Thermometer,
  Droplets,
  Gauge,
  MapPin,
  AlertTriangle,
} from "lucide-react";

interface WeatherSectionProps {
  weather: {
    temperature_c?: number | null;
    humidity_pct?: number | null;
    pressure_hpa?: number | null;
    pressure_drop_6h?: number | null;
    pressure_drop_24h?: number | null;
    weather_code?: number | null;
  };
  prefectureName?: string | null;
}

function getWeatherInfo(code: number | null | undefined): {
  icon: React.ReactNode;
  label: string;
} {
  if (code == null)
    return { icon: <Cloud className="h-5 w-5 text-gray-400" />, label: "-" };
  if (code === 0)
    return {
      icon: <Sun className="h-5 w-5 text-yellow-500" />,
      label: "晴れ",
    };
  if (code <= 2)
    return {
      icon: <CloudSun className="h-5 w-5 text-yellow-400" />,
      label: "晴れ時々曇り",
    };
  if (code <= 3 || code === 45 || code === 48)
    return {
      icon: <Cloud className="h-5 w-5 text-gray-500" />,
      label: "曇り",
    };
  if ((code >= 51 && code <= 57) || (code >= 80 && code <= 82))
    return {
      icon: <CloudDrizzle className="h-5 w-5 text-blue-400" />,
      label: code <= 57 ? "霧雨" : "にわか雨",
    };
  if (code >= 61 && code <= 67)
    return {
      icon: <CloudRain className="h-5 w-5 text-blue-500" />,
      label: "雨",
    };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86))
    return {
      icon: <CloudSnow className="h-5 w-5 text-blue-300" />,
      label: "雪",
    };
  if (code >= 95)
    return {
      icon: <CloudLightning className="h-5 w-5 text-yellow-600" />,
      label: "雷雨",
    };
  return { icon: <Cloud className="h-5 w-5 text-gray-400" />, label: "-" };
}

function hasPressureAlert(
  drop6h: number | null | undefined,
  drop24h: number | null | undefined
): boolean {
  if (drop6h != null && drop6h <= -6) return true;
  if (drop24h != null && drop24h <= -10) return true;
  return false;
}

export function WeatherSection({
  weather,
  prefectureName,
}: WeatherSectionProps) {
  const weatherInfo = getWeatherInfo(weather.weather_code);
  const showPressureAlert = hasPressureAlert(
    weather.pressure_drop_6h,
    weather.pressure_drop_24h
  );

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span className="text-base">🌤️</span>
          気象データ
        </div>
        {prefectureName && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {prefectureName}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 天気 */}
        <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-3">
          {weatherInfo.icon}
          <span className="text-xs text-muted-foreground">天気</span>
          <span className="text-sm font-medium">{weatherInfo.label}</span>
        </div>

        {/* 気温 */}
        <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-3">
          <Thermometer className="h-5 w-5 text-red-400" />
          <span className="text-xs text-muted-foreground">気温</span>
          <span className="text-sm font-medium">
            {weather.temperature_c != null
              ? `${weather.temperature_c}℃`
              : "-"}
          </span>
        </div>

        {/* 湿度 */}
        <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-3">
          <Droplets className="h-5 w-5 text-blue-400" />
          <span className="text-xs text-muted-foreground">湿度</span>
          <span className="text-sm font-medium">
            {weather.humidity_pct != null
              ? `${weather.humidity_pct}%`
              : "-"}
          </span>
        </div>

        {/* 気圧 */}
        <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-3 relative">
          <Gauge className="h-5 w-5 text-indigo-400" />
          <span className="text-xs text-muted-foreground">気圧</span>
          <span className="text-sm font-medium">
            {weather.pressure_hpa != null
              ? `${weather.pressure_hpa}hPa`
              : "-"}
          </span>
          {showPressureAlert && (
            <div className="absolute -top-1 -right-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
          )}
        </div>
      </div>

      {/* 気圧変化アラート */}
      {showPressureAlert && (
        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-md px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>
            気圧の変化が大きい日です
            {weather.pressure_drop_6h != null && (
              <span className="ml-1">
                （6時間: {weather.pressure_drop_6h > 0 ? "+" : ""}
                {weather.pressure_drop_6h}hPa）
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
