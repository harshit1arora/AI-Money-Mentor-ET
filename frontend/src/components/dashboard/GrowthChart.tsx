import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  savings: number;
  sipAmount: number;
}

const GrowthChart = ({ savings, sipAmount }: Props) => {
  const rate = 0.12;
  const calcWealth = (monthly: number, years: number) => {
    let total = 0;
    for (let i = 0; i < years * 12; i++) total = (total + monthly) * (1 + rate / 12);
    return Math.round(total / 100000 * 10) / 10;
  };

  const data = [0, 2, 4, 6, 8, 10].map((y) => ({
    year: y === 0 ? "Now" : `${y}Y`,
    unplanned: y === 0 ? 0 : Math.round(2000 * y * 12 / 100000 * 10) / 10,
    planned: y === 0 ? 0 : calcWealth(sipAmount, y),
  }));

  return (
    <div className="card-et group">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">10-Year Wealth Projection</h2>
          <p className="text-xs font-body text-muted-foreground mt-1">Visualizing the power of optimized financial compounding</p>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-xs font-body">
          <span className="flex items-center gap-2"><span className="w-4 h-[3px] bg-muted/80 rounded" /> Unplanned</span>
          <span className="flex items-center gap-2"><span className="w-4 h-[3px] bg-gradient-to-r from-primary to-[hsl(var(--et-gold))] rounded" /> With AI Mentor</span>
        </div>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(358 79% 55%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(358 79% 55%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="linePlanned" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(358 79% 49%)"/>
                <stop offset="100%" stopColor="hsl(43 96% 56%)"/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground)/0.05)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} dx={-10} />
            <Tooltip 
              contentStyle={{ 
                fontFamily: 'DM Sans', 
                fontSize: 12, 
                borderRadius: 12, 
                border: '1px solid hsl(var(--border)/0.5)', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                backgroundColor: 'hsl(var(--background)/0.9)',
                backdropFilter: 'blur(8px)'
              }} 
              formatter={(value: number, name: string) => [
                <span className="font-bold text-foreground">₹{value}L</span>, 
                <span className="text-muted-foreground">{name}</span>
              ]} 
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area type="monotone" dataKey="unplanned" stroke="hsl(var(--muted-foreground)/0.5)" strokeWidth={2} fill="transparent" dot={false} name="Unplanned" activeDot={{ r: 4, fill: "hsl(var(--muted-foreground))" }} />
            <Area type="monotone" dataKey="planned" stroke="url(#linePlanned)" strokeWidth={3} fill="url(#colorPlanned)" dot={false} name="With AI Mentor" activeDot={{ r: 6, fill: "hsl(358 79% 55%)", stroke: "hsl(var(--background))", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;
