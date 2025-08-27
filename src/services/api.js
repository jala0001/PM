// src/services/api.js
// Smart API service der henter ALT data på én gang

// Mock data - tilsvarende dine Spring Boot @Entity klasser
const MOCK_MERCHANTS = {
  'talent-garden': {
    id: 'talent-garden',
    name: 'Talent Garden',
    phone: '+45 12 34 56 78',
    email: 'contact@talentgarden.dk'
  }
};

// Simuler netværks delay (som hvis det var rigtige API kald)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API funktioner - tilsvarende dine Spring Boot service methods
class MerchantApiService {
  
  // GET /api/merchants/{merchantId}/analytics
  // Dette endpoint returnerer ALT data på én gang - super smart! 🚀
  static async getMerchantAnalytics(merchantId) {
    await delay(800); // Simuler at vi henter og beregner meget data
    
    console.log(`API Call: GET /merchants/${merchantId}/analytics`);
    
    if (merchantId !== 'talent-garden') {
      throw new Error(`Merchant ${merchantId} not found`);
    }
    
    // Dette ville normalt komme fra din Spring Boot Service klasse
    // der beregner aggregeret data fra rå transaktioner
    return {
      success: true,
      merchantId,
      data: {
        // Stats for alle perioder
        stats: {
          today: {
            customers: 47,
            transactions: 23,
            revenue: 12450,
            subtitle: "I dag"
          },
          week: {
            customers: 234,
            transactions: 156,
            revenue: 67890,
            subtitle: "Sidste 7 dage"
          },
          twoWeeks: {
            customers: 445,
            transactions: 298,
            revenue: 134560,
            subtitle: "Sidste 14 dage"
          },
          month: {
            customers: 892,
            transactions: 567,
            revenue: 278340,
            subtitle: "Sidste måned"
          }
        },
        
        // Chart data for alle perioder - Mulighed 3: Smart gruppering 📊
        chartData: {
          // I dag: 6 punkter (4-timers intervaller)
          today: [
            { time: '08:00', customers: 8, transactions: 5, revenue: 1250 },
            { time: '12:00', customers: 18, transactions: 12, revenue: 3680 },
            { time: '16:00', customers: 29, transactions: 18, revenue: 6450 },
            { time: '20:00', customers: 35, transactions: 21, revenue: 8920 },
            { time: '00:00', customers: 41, transactions: 22, revenue: 10650 },
            { time: '04:00', customers: 47, transactions: 23, revenue: 12450 },
          ],
          // Uge: 7 punkter (daglig)
          week: [
            { time: 'Man', customers: 42, transactions: 28, revenue: 8650 },
            { time: 'Tir', customers: 38, transactions: 25, revenue: 7890 },
            { time: 'Ons', customers: 52, transactions: 34, revenue: 12340 },
            { time: 'Tor', customers: 45, transactions: 31, revenue: 9870 },
            { time: 'Fre', customers: 67, transactions: 42, revenue: 15680 },
            { time: 'Lör', customers: 89, transactions: 58, revenue: 21450 },
            { time: 'Søn', customers: 71, transactions: 46, revenue: 17560 },
          ],
          // To uger: 7 punkter (hver 2. dag)
          twoWeeks: [
            { time: '15/1', customers: 45, transactions: 32, revenue: 9450 },
            { time: '17/1', customers: 62, transactions: 41, revenue: 13680 },
            { time: '19/1', customers: 58, transactions: 38, revenue: 12890 },
            { time: '21/1', customers: 71, transactions: 48, revenue: 16750 },
            { time: '23/1', customers: 83, transactions: 56, revenue: 19320 },
            { time: '25/1', customers: 78, transactions: 52, revenue: 18450 },
            { time: '27/1', customers: 91, transactions: 61, revenue: 22340 },
          ],
          // Måned: 8 punkter (hver 4. dag)
          month: [
            { time: '1/1', customers: 52, transactions: 35, revenue: 11230 },
            { time: '5/1', customers: 67, transactions: 44, revenue: 14680 },
            { time: '9/1', customers: 71, transactions: 48, revenue: 16450 },
            { time: '13/1', customers: 84, transactions: 56, revenue: 19870 },
            { time: '17/1', customers: 78, transactions: 52, revenue: 18340 },
            { time: '21/1', customers: 95, transactions: 63, revenue: 23680 },
            { time: '25/1', customers: 89, transactions: 59, revenue: 21560 },
            { time: '29/1', customers: 103, transactions: 71, revenue: 26890 },
          ],
        },
        
        // Recent transactions (uafhængig af periode)
        recentTransactions: [
          { id: 1, time: "14:32", amount: 245, customer: "Marie Jensen", type: 'sale', timestamp: new Date() },
          { id: 2, time: "14:18", amount: 89, customer: "Lars Andersen", type: 'sale', timestamp: new Date() },
          { id: 3, time: "14:05", amount: 156, customer: "Anna Petersen", type: 'refund', timestamp: new Date() },
          { id: 4, time: "13:45", amount: 320, customer: "Michael Nielsen", type: 'sale', timestamp: new Date() },
          { id: 5, time: "13:22", amount: 78, customer: "Sofia Hansen", type: 'sale', timestamp: new Date() },
        ]
      }
    };
  }

  // GET /api/merchants/{merchantId} - Merchant info
  static async getMerchantInfo(merchantId) {
    await delay(200);
    
    console.log(`API Call: GET /merchants/${merchantId}`);
    
    const merchant = MOCK_MERCHANTS[merchantId];
    if (!merchant) {
      throw new Error(`Merchant ${merchantId} not found`);
    }
    
    return {
      success: true,
      data: merchant
    };
  }

  // Hjælpefunktion til at håndtere errors (tilsvarende @ControllerAdvice i Spring Boot)
  static handleApiError(error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

export default MerchantApiService;