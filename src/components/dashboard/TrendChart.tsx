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
    <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm p-6">
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground/80 mt-1 font-medium">{description}</p>
          )}
        </div>
        
        <div style={{ height }} className="relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground))" 
                opacity={0.2}
              />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color}
                strokeWidth={3}
                dot={{ r: 4, fill: color, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                activeDot={{ 
                  r: 6, 
                  fill: color, 
                  stroke: 'hsl(var(--background))', 
                  strokeWidth: 3,
                  filter: 'drop-shadow(0 0 6px hsla(var(--primary), 0.4))'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}