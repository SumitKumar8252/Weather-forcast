import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#111827',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '0.82rem',
    }}>
      <p style={{ color: '#4a5a7a', marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}°</strong>
        </p>
      ))}
    </div>
  )
}

function TemperatureChart({ data, unit }) {
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#4a5a7a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#4a5a7a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}${symbol}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '0.8rem', paddingTop: '12px' }}
          formatter={(val) => <span style={{ color: '#8899bb' }}>{val}</span>}
        />
        <Line
          type="monotone"
          dataKey="temp"
          name="Temperature"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: '#3b82f6' }}
        />
        <Line
          type="monotone"
          dataKey="feelsLike"
          name="Feels Like"
          stroke="#06b6d4"
          strokeWidth={2}
          strokeDasharray="4 2"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TemperatureChart
