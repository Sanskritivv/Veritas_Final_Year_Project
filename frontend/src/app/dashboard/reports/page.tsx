'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';

const chartData = [
  { month: 'January', applications: 186 },
  { month: 'February', applications: 305 },
  { month: 'March', applications: 237 },
  { month: 'April', applications: 273 },
  { month: 'May', applications: 209 },
  { month: 'June', applications: 214 },
];

const pieChartData = [
    { status: 'Approved', count: 45, fill: 'hsl(var(--chart-1))' },
    { status: 'Pending', count: 30, fill: 'hsl(var(--chart-4))' },
    { status: 'Rejected', count: 25, fill: 'hsl(var(--destructive))' },
]

const reasonsData = [
  { reason: 'Low Credit Score', count: 15, fill: 'hsl(var(--destructive))' },
  { reason: 'High DTI', count: 8, fill: 'hsl(var(--chart-5))' },
  { reason: 'Auto-Approved', count: 28, fill: 'hsl(var(--chart-1))' },
  { reason: 'Manual Approve', count: 17, fill: 'hsl(var(--chart-2))' },
  { reason: 'Incomplete Docs', count: 12, fill: 'hsl(var(--chart-4))' },
];


export default function ReportsPage() {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Applications by Month</CardTitle>
                <CardDescription>January - June 2023</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="applications" fill="hsl(var(--primary))" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Application Status Distribution</CardTitle>
                <CardDescription>Overall status of all applications</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="h-[300px] w-full">
                    <PieChart>
                         <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                        <Pie data={pieChartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            percent,
                            }) => {
                            const RADIAN = Math.PI / 180
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                            const x = cx + radius * Math.cos(-midAngle * RADIAN)
                            const y = cy + radius * Math.sin(-midAngle * RADIAN)

                            return (
                                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                                {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            )
                        }}>
                             {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
       </div>
       <Card>
        <CardHeader>
          <CardTitle>Approval & Rejection Reasons</CardTitle>
          <CardDescription>Breakdown of decisions made on applications</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={reasonsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="reason" type="category" tickLine={false} axisLine={false} tickMargin={8} width={120} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={4}>
                {reasonsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
