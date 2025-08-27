import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Svg, { Polyline, Rect, Text as SvgText, Line, G } from 'react-native-svg';
import MerchantApiService from '../services/api';

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
  
  // Nye state variabler til API data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [merchantInfo, setMerchantInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hent ALT data når komponenten mounter - ét smart API kald! 🚀
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🚀 Henter ALT data på én gang...');
        
        // Parallelle API kald for bedre performance
        const [analyticsResponse, merchantResponse] = await Promise.all([
          MerchantApiService.getMerchantAnalytics('talent-garden'),
          MerchantApiService.getMerchantInfo('talent-garden')
        ]);
        
        console.log('✅ Data hentet succesfuldt!');
        
        setAnalyticsData(analyticsResponse.data);
        setMerchantInfo(merchantResponse.data);
        
      } catch (err) {
        console.error('❌ Fejl ved hentning af data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Tom dependency array = kun kør når komponenten mounter

  const tabs = [
    { key: 'today', label: 'I dag' },
    { key: 'week', label: 'Uge' },
    { key: 'twoWeeks', label: '2 uger' },
    { key: 'month', label: 'Måned' },
  ] as const;

  // Hvis vi loader, vis loading screen
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4FD300" />
          <Text style={styles.loadingText}>Henter dashboard data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hvis der er en fejl, vis error screen
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>😕 Noget gik galt</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setIsLoading(true);
              setError(null);
              // Trigger useEffect igen (du kan også lave en retry funktion)
            }}
          >
            <Text style={styles.retryButtonText}>Prøv igen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Nu har vi data! Brug det fra API'et i stedet for hardcoded
  const currentStats = analyticsData?.stats[selectedPeriod];
  const currentChartData = analyticsData?.chartData[selectedPeriod];
  const recentTransactions = analyticsData?.recentTransactions || [];

  // Chart helper functions (samme som før)
  const LineChartComponent = ({ data, dataKey, color, width = screenWidth - 80, height = 160 }) => {
    // Optimeret padding: mindre fra kant til tal, mere mellem tal og graf
    const leftPadding = 45;
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
            x={35}
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
    const leftPadding = 45;
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
            x={35}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header - Fixed */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {/* Nu bruger vi rigtig merchant data! */}
          <Text style={styles.storeName}>{merchantInfo?.name || 'Loading...'}</Text>
          <Text style={styles.welcomeText}>Dashboard</Text>
        </View>

        {/* Sticky Tabs - SUPERFAST switching nu! ⚡ */}
        <View style={styles.stickyTabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollView}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  selectedPeriod === tab.key && styles.activeTab
                ]}
                onPress={() => {
                  console.log(`🚀 Skifter til ${tab.label} - INGEN API kald!`);
                  setSelectedPeriod(tab.key); // Øjeblikkelig skift!
                }}
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
        {/* Metrics - nu med rigtig API data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentStats?.subtitle}</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Kunder"
              value={currentStats?.customers?.toString() || '0'}
              color="#4FD300"
            />
            <MetricCard
              title="Transaktioner"
              value={currentStats?.transactions?.toString() || '0'}
              color="#00D4FF"
            />
            <MetricCard
              title="Omsætning"
              value={`${currentStats?.revenue?.toLocaleString('da-DK') || '0'} kr`}
              color="#FF6B00"
            />
          </View>
        </View>

        {/* Charts Section - med rigtig data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Udvikling</Text>
          
          {/* Kunder Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Kunder</Text>
            <View style={styles.chartWrapper}>
              {currentChartData && (
                <LineChartComponent 
                  data={currentChartData}
                  dataKey="customers"
                  color="#4FD300"
                />
              )}
            </View>
          </View>

          {/* Transaktioner Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Transaktioner</Text>
            <View style={styles.chartWrapper}>
              {currentChartData && (
                <BarChartComponent 
                  data={currentChartData}
                  dataKey="transactions"
                  color="#00D4FF"
                />
              )}
            </View>
          </View>

          {/* Omsætning Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Omsætning (kr)</Text>
            <View style={styles.chartWrapper}>
              {currentChartData && (
                <LineChartComponent 
                  data={currentChartData}
                  dataKey="revenue"
                  color="#FF6B00"
                />
              )}
            </View>
          </View>
        </View>

        {/* Recent Transactions - med rigtig API data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seneste transaktioner</Text>
          <View style={styles.transactionsContainer}>
            {recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                time={transaction.time}
                amount={transaction.amount.toString()}
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
  // Nye styles til loading og error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 40,
  },
  errorText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#4FD300',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;