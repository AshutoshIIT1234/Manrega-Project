import { pool } from './db.js';

const schema = `
CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  district_code VARCHAR(10) UNIQUE NOT NULL,
  district_name VARCHAR(100) NOT NULL,
  state_code VARCHAR(10) NOT NULL,
  state_name VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS performance_data (
  id SERIAL PRIMARY KEY,
  district_code VARCHAR(10) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  total_households_registered BIGINT,
  households_worked BIGINT,
  total_persondays_generated BIGINT,
  women_persondays BIGINT,
  sc_persondays BIGINT,
  st_persondays BIGINT,
  total_expenditure DECIMAL(15, 2),
  wage_expenditure DECIMAL(15, 2),
  material_expenditure DECIMAL(15, 2),
  works_completed INTEGER,
  works_ongoing INTEGER,
  avg_wage_per_day DECIMAL(10, 2),
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(district_code, month, year)
);

CREATE INDEX IF NOT EXISTS idx_district_code ON performance_data(district_code);
CREATE INDEX IF NOT EXISTS idx_month_year ON performance_data(month, year);
CREATE INDEX IF NOT EXISTS idx_district_location ON districts(latitude, longitude);
`;

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');
    await pool.query(schema);
    console.log('Database schema created successfully');
    
    // Insert sample UP districts
    await insertUPDistricts();
    
    process.exit(0);
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

async function insertUPDistricts() {
  const { upDistricts } = await import('./districts-up.js');
  
  for (const district of upDistricts) {
    try {
      await pool.query(
        `INSERT INTO districts (district_code, district_name, state_code, state_name, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (district_code) DO NOTHING`,
        [district.code, district.name, '09', 'Uttar Pradesh', district.lat, district.lng]
      );
    } catch (err) {
      console.error(`Error inserting ${district.name}:`, err);
    }
  }
  console.log('Inserted UP districts');
}

setupDatabase();
