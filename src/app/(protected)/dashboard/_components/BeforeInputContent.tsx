import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function BeforeInputContent() {
  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="h-5 w-5" />
          体調を入力してみましょう
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          睡眠・気分・疲労感を数タップで記録し、今日の提案づくりに役立てます。
        </p>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href="/morning">体調を記録する</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
