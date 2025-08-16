import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from '@/components/ui/card';

interface TrendChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  title: string;
  description?: string;
  color?: string;
  height?: number;
}

export function TrendChart({ 
  data, 
  title, 
  description, 
  color = 'hsl(142, 76%, 36%)', 
  height = 300 
}: TrendChartProps) {
  return (
    <Card className="card-gradient p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(220, 13%, 20%)" 
              opacity={0.3}
            />
            <XAxis 
              dataKey="name" 
              stroke="hsl(220, 9%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(220, 9%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(220, 13%, 11%)',
                border: '1px solid hsl(220, 13%, 20%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px hsl(220, 13%, 5% / 0.1)'
              }}
              labelStyle={{ color: 'hsl(220, 9%, 98%)' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4, fill: color }}
              activeDot={{ r: 6, fill: color, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}