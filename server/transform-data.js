import fs from 'fs/promises';
import { jsonDb } from './json-db.js';

// Function to transform output.json into districts and performance data
export async function transformOutputData() {
  try {
    console.log('Reading output.json...');
    const rawData = JSON.parse(await fs.readFile('./server/data/output.json', 'utf8'));
    
    console.log(`Found ${rawData.length} records`);
    
    // Extract unique districts
    const districtsMap = new Map();
    const performanceData = [];
    
    // Process each record
    rawData.forEach(record => {
      const districtCode = record.district_code.toString();
      
      // Add district if not already added
      if (!districtsMap.has(districtCode)) {
        districtsMap.set(districtCode, {
          district_code: districtCode,
          district_name: record.district_name,
          state_name: record.state_name,
          state_code: record.state_code,
          // Adding approximate coordinates for UP districts (you can update these with real coordinates)
          latitude: getApproximateLatitude(record.district_name),
          longitude: getApproximateLongitude(record.district_name)
        });
      }
      
      // Transform performance data
      const monthYear = getMonthYear(record.fin_year, record.month);
      
      performanceData.push({
        district_code: districtCode,
        district_name: record.district_name,
        year: parseInt(record.fin_year.split('-')[0]),
        month: getMonthNumber(record.month),
        month_year: monthYear,
        
        // Core metrics
        total_households_registered: record.Total_No_of_JobCards_issued || 0,
        households_worked: record.Total_Households_Worked || 0,
        total_persondays_generated: record.Persondays_of_Central_Liability_so_far || 0,
        women_persondays: record.Women_Persondays || 0,
        total_expenditure: Math.round((record.Total_Exp || 0) * 100000), // Convert to rupees (assuming lakhs)
        avg_wage_per_day: Math.round(record.Average_Wage_rate_per_day_per_person || 0),
        works_completed: record.Number_of_Completed_Works || 0,
        works_ongoing: record.Number_of_Ongoing_Works || 0,
        
        // Additional metrics
        total_workers: record.Total_No_of_Workers || 0,
        active_workers: record.Total_No_of_Active_Workers || 0,
        sc_persondays: record.SC_persondays || 0,
        st_persondays: record.ST_persondays || 0,
        differently_abled_worked: record.Differently_abled_persons_worked || 0,
        avg_days_per_household: record.Average_days_of_employment_provided_per_Household || 0,
        households_100_days: record.Total_No_of_HHs_completed_100_Days_of_Wage_Employment || 0,
        
        // Financial metrics
        wages_paid: Math.round((record.Wages || 0) * 100000), // Convert to rupees
        material_wages: Math.round((record.Material_and_skilled_Wages || 0) * 100000),
        admin_expenditure: Math.round((record.Total_Adm_Expenditure || 0) * 100000),
        
        // Performance indicators
        percent_category_b_works: record.percent_of_Category_B_Works || 0,
        percent_agriculture_works: record.percent_of_Expenditure_on_Agriculture_Allied_Works || 0,
        percent_nrm_expenditure: record.percent_of_NRM_Expenditure || 0,
        percent_payments_15_days: record.percentage_payments_gererated_within_15_days || 0
      });
    });
    
    // Convert districts map to array
    const districts = Array.from(districtsMap.values());
    
    console.log(`Processed ${districts.length} districts and ${performanceData.length} performance records`);
    
    // Save to JSON files
    await jsonDb.saveDistricts(districts);
    await jsonDb.savePerformance(performanceData);
    
    console.log('Data transformation completed successfully!');
    console.log('Districts saved to: server/data/districts.json');
    console.log('Performance data saved to: server/data/performance.json');
    
    return { districts, performance: performanceData };
    
  } catch (error) {
    console.error('Error transforming data:', error);
    throw error;
  }
}

// Helper functions
function getMonthNumber(monthName) {
  const months = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };
  return months[monthName] || 1;
}

function getMonthYear(finYear, month) {
  const year = parseInt(finYear.split('-')[0]);
  const monthNum = getMonthNumber(month);
  
  // Adjust year for financial year (Apr-Mar)
  const actualYear = monthNum >= 4 ? year : year + 1;
  
  return `${actualYear}-${monthNum.toString().padStart(2, '0')}-01`;
}

// Approximate coordinates for major UP districts (you can update these with real coordinates)
function getApproximateLatitude(districtName) {
  const coordinates = {
    'MORADABAD': 28.8386,
    'SAHARANPUR': 29.9680,
    'BULANDSHAHR': 28.4041,
    'AGRA': 27.1767,
    'ALIGARH': 27.8974,
    'ALLAHABAD': 25.4358,
    'LUCKNOW': 26.8467,
    'KANPUR NAGAR': 26.4499,
    'VARANASI': 25.3176,
    'GORAKHPUR': 26.7606,
    'BAREILLY': 28.3670,
    'MEERUT': 28.9845,
    'GHAZIABAD': 28.6692,
    'FAIZABAD': 26.7751,
    'MUZAFFARNAGAR': 29.4727
  };
  
  return coordinates[districtName.toUpperCase()] || 26.8467; // Default to Lucknow
}

function getApproximateLongitude(districtName) {
  const coordinates = {
    'MORADABAD': 78.7733,
    'SAHARANPUR': 77.5552,
    'BULANDSHAHR': 77.8498,
    'AGRA': 78.0081,
    'ALIGARH': 78.0880,
    'ALLAHABAD': 81.8463,
    'LUCKNOW': 80.9462,
    'KANPUR NAGAR': 80.3319,
    'VARANASI': 83.0116,
    'GORAKHPUR': 83.3732,
    'BAREILLY': 79.4304,
    'MEERUT': 77.7064,
    'GHAZIABAD': 77.4538,
    'FAIZABAD': 82.1391,
    'MUZAFFARNAGAR': 77.7085
  };
  
  return coordinates[districtName.toUpperCase()] || 80.9462; // Default to Lucknow
}

// If running this file directly
if (process.argv[1].endsWith('transform-data.js')) {
  transformOutputData()
    .then(() => {
      console.log('✅ Transformation completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Transformation failed:', error);
      process.exit(1);
    });
}