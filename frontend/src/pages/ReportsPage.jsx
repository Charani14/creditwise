import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../services/api';
import {
  EmptyState,
  ErrorText,
  Loading,
  PageHeader,
  Panel,
  Stat,
  money,
} from '../components/ui';

const categoryColors = [
  '#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#c084fc', '#2dd4bf',
];

const utilizationColors = ['#818cf8', '#38bdf8', '#34d399', '#fbbf24'];

export function ReportsPage() {
  const year = new Date().getFullYear();
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [utilization, setUtilization] = useState([]);
  const [categorySpending, setCategorySpending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const [monthlyResponse, utilizationResponse, categoryResponse] = await Promise.all([
          api.get(`/reports/monthly?year=${year}`),
          api.get('/reports/utilization'),
          api.get('/reports/categories'),
        ]);

        setMonthlySpending(monthlyResponse.data.data || []);
        setUtilization(utilizationResponse.data.data || []);
        setCategorySpending(categoryResponse.data.data || []);
      } catch (requestError) {
        setError(requestError);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [year]);

  if (loading) {
    return <Loading />;
  }

  const yearToDateSpending = monthlySpending.reduce(
    (total, month) => total + Number(month.total || 0),
    0,
  );

  return (
    <div>
      <PageHeader
        title="Reports & analytics"
        description={`Explore card utilization and spending patterns for ${year}.`}
      />
      <ErrorText error={error} />

      <div className="stats-grid reports-stats">
        <Stat
          icon="fa-chart-column"
          label="Year to date spend"
          value={money(yearToDateSpending)}
          tone="purple"
        />
        <Stat
          icon="fa-receipt"
          label="Purchase categories"
          value={categorySpending.length}
          tone="blue"
        />
        <Stat
          icon="fa-credit-card"
          label="Cards in report"
          value={utilization.length}
          tone="green"
        />
      </div>

      <div className="two-col-grid reports-grid">
        <Panel title="Monthly spending" subtitle="Completed purchases by transaction month">
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySpending}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,.08)"
                  vertical={false}
                />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => money(value)}
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,.12)',
                    borderRadius: 10,
                  }}
                />
                <Bar dataKey="total" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Spending by category" subtitle="Share of completed purchases">
          <div className="chart-box chart-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySpending}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {categorySpending.map((category, index) => (
                    <Cell
                      key={category.category}
                      fill={categoryColors[index % categoryColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => money(value)}
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,.12)',
                    borderRadius: 10,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="legend-list">
            {categorySpending.slice(0, 5).map((category, index) => (
              <div key={category.category}>
                <span
                  className="legend-dot"
                  style={{ background: categoryColors[index % categoryColors.length] }}
                />
                {category.category}
                <strong>{money(category.total)}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Card utilization"
        subtitle="Outstanding balance compared with each active card limit"
        className="utilization-report-panel"
      >
        {utilization.length ? (
          utilization.map((card, index) => (
            <div
              className="utilization-report-row"
              key={`${card.bankName}-${card.cardName}`}
            >
              <div className="utilization-report-heading">
                <div>
                  <strong>{card.cardName}</strong>
                  <small>{card.bankName}</small>
                </div>
                <div className="align-right">
                  <strong>{Number(card.utilization).toFixed(1)}%</strong>
                  <small>{money(card.outstanding)} of {money(card.creditLimit)}</small>
                </div>
              </div>
              <div className="utilization-bar">
                <div
                  className="utilization-fill"
                  style={{
                    width: `${Math.min(Number(card.utilization), 100)}%`,
                    background: utilizationColors[index % utilizationColors.length],
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="fa-chart-pie" title="No card data yet">
            Add a card and record activity to see its utilization here.
          </EmptyState>
        )}
      </Panel>
    </div>
  );
}
