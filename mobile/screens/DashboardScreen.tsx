import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';
import { recentSales } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatting';

const DashboardScreen = () => {
  const { logout, session, currency } = useAppContext();
  const totalRevenue = recentSales.reduce((acc, sale) => acc + sale.amount, 0);

  const renderSaleItem = ({ item }: { item: typeof recentSales[0] }) => (
    <View style={styles.saleItem}>
      <View>
        <Text style={styles.saleCustomer}>{item.customerName}</Text>
        <Text style={styles.saleDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.saleAmount}>{formatCurrency(item.amount, currency)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{session?.user?.email}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Revenue</Text>
            <Text style={styles.cardValue}>{formatCurrency(totalRevenue, currency)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sales</Text>
            <Text style={styles.cardValue}>+{recentSales.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Sales</Text>
        <FlatList
          data={recentSales}
          renderItem={renderSaleItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} // The parent ScrollView handles scrolling
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  cardValue: {
    color: '#F9FAFB',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  saleCustomer: {
    color: '#F9FAFB',
    fontWeight: '600',
  },
  saleDate: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  saleAmount: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DashboardScreen;
