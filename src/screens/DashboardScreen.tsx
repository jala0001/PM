import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Polyline, Rect, Text as SvgText, Line, G } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color: string;
}

const MetricCard = ({ title, value, subtitle, color }: MetricCardProps) => (
  <View style={[styles.metricCard, { borderLeftColor: color }]}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
  </View>
);

interface TransactionItemProps {
  time: string;
  amount: string;
  customer: string;
  type: 'sale' | 'refund';
}

const TransactionItem = ({ time, amount, customer, type }: TransactionItemProps) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionLeft}>
      <Text style={styles.transactionTime}>{time}</Text>
      <Text style={styles.transactionCustomer}>{customer}</Text>
    </View>
    <Text style={[
      styles.transactionAmount,
      { color: type === 'sale' ? '#4FD300' : '#FF4444' }
    ]}>
      {type === 'refund' ? '-' : '+'}{amount} kr
    </Text>
  </View>
);

type TimePeriod = 'today' | 'week' | 'twoWeeks' | 'month';

// Hjælpefunktion til at formatere store tal
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

// Hjælpefunktion til at formatere kronebeløb
const formatCurrency = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    // For kroner, vis uden decimal hvis tallet er jævnt i tusinder
    const thousands = num / 1000;
    if (thousands % 1 === 0) {
      return thousands + 'k';
    }
    return thousands.toFixed(1) + 'k';
  }
  return num.toLocaleString('da-DK');
};

const DashboardScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');

  // Dummy data for forskellige tidsperioder
  const statsData = {
    today: {
      customers: "47",
      transactions: "23", 
      revenue: "12.450",
      subtitle: "I dag"
    },
    week: {
      customers: "234",
      transactions: "156",
      revenue: "67.890",
      subtitle: "Sidste 7 dage"
    },
    twoWeeks: {
      customers: "445",
      transactions: "298",
      revenue: "134.560",
      subtitle: "Sidste 14 dage"
    },
    month: {
      customers: "892",
      transactions: "567",
      revenue: "278.340",
      subtitle: "Sidste måned"
    }
  };

  // Chart data for forskellige tidsperioder
  const chartData = {
    today: [
      { time: '08:00', customers: 5, transactions: 3, revenue: 850 },
      { time: '10:00', customers: 12, transactions: 8, revenue: 2340 },
      { time: '12:00', customers: 25, transactions: 15, revenue: 5680 },
      { time: '14:00', customers: 38, transactions: 20, revenue: 8920 },
      { time: '16:00', customers: 47, transactions: 23, revenue: 12450 },
    ],
    week: [
      { time: 'Man', customers: 42, transactions: 28, revenue: 8650 },
      { time: 'Tir', customers: 38, transactions: 25, revenue: 7890 },
      { time: 'Ons', customers: 52, transactions: 34, revenue: 12340 },
      { time: 'Tor', customers: 45, transactions: 31, revenue: 9870 },
      { time: 'Fre', customers: 67, transactions: 42, revenue: 15680 },
      { time: 'Lør', customers: 89, transactions: 58, revenue: 21450 },
      { time: 'Søn', customers: 71, transactions: 46, revenue: 17560 },
    ],
    twoWeeks: [
      { time: 'Uge 1', customers: 198, transactions: 142, revenue: 45680 },
      { time: 'Uge 2', customers: 247, transactions: 156, revenue: 88880 },
    ],
    month: [
      { time: 'Uge 1', customers: 198, transactions: 142, revenue: 45680 },
      { time: 'Uge 2', customers: 247, transactions: 156, revenue: 88880 },
      { time: 'Uge 3', customers: 223, transactions: 134, revenue: 67890 },
      { time: 'Uge 4', customers: 224, transactions: 135, revenue: 75890 },
    ],
  };

  const tabs = [
    { key: 'today', label: 'I dag' },
    { key: 'week', label: 'Uge' },
    { key: 'twoWeeks', label: '2 uger' },
    { key: 'month', label: 'Måned' },
  ] as const;

  const currentStats = statsData[selectedPeriod];
  const currentChartData = chartData[selectedPeriod];

  // Chart helper functions
  const LineChartComponent = ({ data, dataKey, color, width = screenWidth - 80, height = 160 }) => {
    // Optimeret padding: mindre fra kant til tal, mere mellem tal og graf
    const leftPadding = 45;  // Hvor grafen starter (mere plads mellem tal og graf)
    const rightPadding = 20;
    const topPadding = 20;
    const bottomPadding = 40;
    
    const chartWidth = width - leftPadding - rightPadding;
    const chartHeight = height - topPadding - bottomPadding;
    
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    const minValue = Math.min(...data.map(d => d[dataKey]));
    const range = maxValue - minValue || 1;
    
    const points = data.map((d, i) => {
      const x = leftPadding + (i * chartWidth / (data.length - 1));
      const y = topPadding + chartHeight - ((d[dataKey] - minValue) / range * chartHeight);
      return `${x},${y}`;
    }).join(' ');

    // Y-axis labels med formatering
    const yLabels = [];
    for (let i = 0; i <= 4; i++) {
      const value = Math.round(maxValue - (i * range / 4));
      yLabels.push(formatNumber(value));
    }

    return (
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <Line
            key={i}
            x1={leftPadding}
            y1={topPadding + (i * chartHeight / 4)}
            x2={width - rightPadding}
            y2={topPadding + (i * chartHeight / 4)}
            stroke="#333"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        
        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <SvgText
            key={i}
            x={35}  // Øget fra 25 til 35 for at sikre tal ikke klippes
            y={topPadding + (i * chartHeight / 4) + 4}
            fontSize="11"
            fill="#888"
            textAnchor="end"
          >
            {label}
          </SvgText>
        ))}
        
        {/* Chart line */}
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = leftPadding + (i * chartWidth / (data.length - 1));
          const y = topPadding + chartHeight - ((d[dataKey] - minValue) / range * chartHeight);
          return (
            <G key={i}>
              <Rect
                x={x - 4}
                y={y - 4}
                width={8}
                height={8}
                fill={color}
                rx={4}
              />
            </G>
          );
        })}
        
        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = leftPadding + (i * chartWidth / (data.length - 1));
          return (
            <SvgText
              key={i}
              x={x}
              y={height - 10}
              fontSize="12"
              fill="#888"
              textAnchor="middle"
            >
              {d.time}
            </SvgText>
          );
        })}
      </Svg>
    );
  };

  const BarChartComponent = ({ data, dataKey, color, width = screenWidth - 80, height = 160 }) => {
    // Optimeret padding: mindre fra kant til tal, mere mellem tal og graf
    const leftPadding = 45;  // Hvor grafen starter (mere plads mellem tal og graf)
    const rightPadding = 20;
    const topPadding = 20;
    const bottomPadding = 40;
    
    const chartWidth = width - leftPadding - rightPadding;
    const chartHeight = height - topPadding - bottomPadding;
    
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length;

    // Y-axis labels med formatering
    const yLabels = [];
    for (let i = 0; i <= 4; i++) {
      const value = Math.round(maxValue - (i * maxValue / 4));
      yLabels.push(formatNumber(value));
    }

    return (
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <Line
            key={i}
            x1={leftPadding}
            y1={topPadding + (i * chartHeight / 4)}
            x2={width - rightPadding}
            y2={topPadding + (i * chartHeight / 4)}
            stroke="#333"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        
        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <SvgText
            key={i}
            x={35}  // Øget fra 25 til 35 for at sikre tal ikke klippes
            y={topPadding + (i * chartHeight / 4) + 4}
            fontSize="11"
            fill="#888"
            textAnchor="end"
          >
            {label}
          </SvgText>
        ))}
        
        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d[dataKey] / maxValue) * chartHeight;
          const x = leftPadding + (i * barSpacing) + (barSpacing - barWidth) / 2;
          const y = topPadding + chartHeight - barHeight;
          
          return (
            <G key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={4}
              />
            </G>
          );
        })}
        
        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = leftPadding + (i * barSpacing) + barSpacing / 2;
          return (
            <SvgText
              key={i}
              x={x}
              y={height - 10}
              fontSize="12"
              fill="#888"
              textAnchor="middle"
            >
              {d.time}
            </SvgText>
          );
        })}
      </Svg>
    );
  };

  const recentTransactions = [
    { time: "14:32", amount: "245", customer: "Marie Jensen", type: 'sale' as const },
    { time: "14:18", amount: "89", customer: "Lars Andersen", type: 'sale' as const },
    { time: "14:05", amount: "156", customer: "Anna Petersen", type: 'refund' as const },
    { time: "13:45", amount: "320", customer: "Michael Nielsen", type: 'sale' as const },
    { time: "13:22", amount: "78", customer: "Sofia Hansen", type: 'sale' as const },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header - Fixed */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.storeName}>Nørrebro Butik</Text>
          <Text style={styles.welcomeText}>Dashboard</Text>
        </View>

        {/* Sticky Tabs */}
        <View style={styles.stickyTabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollView}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  selectedPeriod === tab.key && styles.activeTab
                ]}
                onPress={() => setSelectedPeriod(tab.key)}
              >
                <Text style={[
                  styles.tabText,
                  selectedPeriod === tab.key && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentStats.subtitle}</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Kunder"
              value={currentStats.customers}
              color="#4FD300"
            />
            <MetricCard
              title="Transaktioner"
              value={currentStats.transactions}
              color="#00D4FF"
            />
            <MetricCard
              title="Omsætning"
              value={`${currentStats.revenue} kr`}
              color="#FF6B00"
            />
          </View>
        </View>

        {/* Charts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Udvikling</Text>
          
          {/* Kunder Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Kunder</Text>
            <View style={styles.chartWrapper}>
              <LineChartComponent 
                data={currentChartData}
                dataKey="customers"
                color="#4FD300"
              />
            </View>
          </View>

          {/* Transaktioner Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Transaktioner</Text>
            <View style={styles.chartWrapper}>
              <BarChartComponent 
                data={currentChartData}
                dataKey="transactions"
                color="#00D4FF"
              />
            </View>
          </View>

          {/* Omsætning Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Omsætning (kr)</Text>
            <View style={styles.chartWrapper}>
              <LineChartComponent 
                data={currentChartData}
                dataKey="revenue"
                color="#FF6B00"
              />
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seneste transaktioner</Text>
          <View style={styles.transactionsContainer}>
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                time={transaction.time}
                amount={transaction.amount}
                customer={transaction.customer}
                type={transaction.type}
              />
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  storeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#888',
  },
  stickyTabsContainer: {
    paddingBottom: 15,
  },
  tabsScrollView: {
    paddingRight: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeTab: {
    backgroundColor: '#4FD300',
    borderColor: '#4FD300',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#000',
  },
  section: {
    marginBottom: 30,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  metricsGrid: {
    gap: 15,
  },
  metricCard: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  transactionsContainer: {
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTime: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  transactionCustomer: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  chartWrapper: {
    alignItems: 'center',
  },
});

export default DashboardScreen;