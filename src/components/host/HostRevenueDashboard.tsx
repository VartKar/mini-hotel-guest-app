import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHostRevenue } from "@/hooks/useHostRevenue";
import { DollarSign, TrendingUp, ShoppingBag, Plane, Loader2, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface HostRevenueDashboardProps {
  hostEmail: string;
}

export const HostRevenueDashboard = ({ hostEmail }: HostRevenueDashboardProps) => {
  const { data: revenue, isLoading } = useHostRevenue(hostEmail);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Ваш доход
          </CardTitle>
          <CardDescription>Загрузка данных о доходах...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!revenue) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Ваш доход
          </CardTitle>
          <CardDescription>Нет данных о доходах</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription>Сегодня</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {formatCurrency(revenue.today.total)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  Товары
                </span>
                <span className="font-medium">{formatCurrency(revenue.today.shop_orders)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Plane className="h-3 w-3" />
                  Услуги
                </span>
                <span className="font-medium">{formatCurrency(revenue.today.travel_services)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Эта неделя</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(revenue.thisWeek.total)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  Товары
                </span>
                <span className="font-medium">{formatCurrency(revenue.thisWeek.shop_orders)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Plane className="h-3 w-3" />
                  Услуги
                </span>
                <span className="font-medium">{formatCurrency(revenue.thisWeek.travel_services)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Этот месяц</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(revenue.thisMonth.total)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  Товары
                </span>
                <span className="font-medium">{formatCurrency(revenue.thisMonth.shop_orders)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Plane className="h-3 w-3" />
                  Услуги
                </span>
                <span className="font-medium">{formatCurrency(revenue.thisMonth.travel_services)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Последние 30 дней</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(revenue.last30Days.total)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  Товары
                </span>
                <span className="font-medium">{formatCurrency(revenue.last30Days.shop_orders)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Plane className="h-3 w-3" />
                  Услуги
                </span>
                <span className="font-medium">{formatCurrency(revenue.last30Days.travel_services)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Динамика дохода за 14 дней
          </CardTitle>
          <CardDescription>Разбивка по товарам и услугам</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenue.dailyTrend}>
              <defs>
                <linearGradient id="colorShop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTravel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
                className="text-xs"
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                className="text-xs"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="text-sm font-medium mb-2">
                        {new Date(payload[0].payload.date).toLocaleDateString("ru-RU")}
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <ShoppingBag className="h-3 w-3" />
                            Товары
                          </span>
                          <span className="font-medium">{formatCurrency(payload[0].value as number)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Plane className="h-3 w-3" />
                            Услуги
                          </span>
                          <span className="font-medium">{formatCurrency(payload[1].value as number)}</span>
                        </div>
                        <div className="border-t pt-1 mt-1 flex items-center justify-between gap-4">
                          <span className="font-medium">Всего</span>
                          <span className="font-bold">{formatCurrency(payload[2].value as number)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="shop"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorShop)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="travel"
                stroke="hsl(var(--accent))"
                fillOpacity={1}
                fill="url(#colorTravel)"
                stackId="1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products and Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Топ услуги за 30 дней
            </CardTitle>
            <CardDescription>Самые популярные по доходу</CardDescription>
          </CardHeader>
          <CardContent>
            {revenue.topServices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет заказов услуг за этот период
              </p>
            ) : (
              <div className="space-y-4">
                {revenue.topServices.map((service, idx) => (
                  <div key={service.title} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Badge variant="outline" className="font-mono shrink-0">
                        #{idx + 1}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{service.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {service.count} {service.count === 1 ? "заказ" : "заказа"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-bold text-primary">{formatCurrency(service.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Топ товары за 30 дней
            </CardTitle>
            <CardDescription>Самые популярные по доходу</CardDescription>
          </CardHeader>
          <CardContent>
            {revenue.topItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет заказов товаров за этот период
              </p>
            ) : (
              <div className="space-y-4">
                {revenue.topItems.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Badge variant="outline" className="font-mono shrink-0">
                        #{idx + 1}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.count} шт.
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="font-bold text-primary">{formatCurrency(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
