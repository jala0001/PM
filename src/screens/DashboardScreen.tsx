import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

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

const DashboardScreen = () => {
  // Dummy data
  const todayStats = {
    customers: "47",
    transactions: "23",
    revenue: "12.450",
  };

  const allTimeStats = {
    customers: "1.247",
    transactions: "856",
    revenue: "187.350",
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
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.storeName}>Nørrebro Butik</Text>
          <Text style={styles.welcomeText}>Dashboard</Text>
        </View>

        {/* Today's Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I dag</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Kunder"
              value={todayStats.customers}
              color="#4FD300"
            />
            <MetricCard
              title="Transaktioner"
              value={todayStats.transactions}
              color="#00D4FF"
            />
            <MetricCard
              title="Omsætning"
              value={`${todayStats.revenue} kr`}
              color="#FF6B00"
            />
          </View>
        </View>

        {/* All Time Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Total</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Kunder"
              value={allTimeStats.customers}
              subtitle="Registrerede"
              color="#4FD300"
            />
            <MetricCard
              title="Transaktioner"
              value={allTimeStats.transactions}
              subtitle="Gennemført"
              color="#00D4FF"
            />
            <MetricCard
              title="Omsætning"
              value={`${allTimeStats.revenue} kr`}
              subtitle="Samlet"
              color="#FF6B00"
            />
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
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
  section: {
    marginBottom: 30,
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
});

export default DashboardScreen;