require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('../Models/Coupon');
const User = require('../Models/User');
const connectDB = require('../db/connectDB');

// Athlete coupon codes - 5% discount
const athleteCodes = [
  // { code: 'sagar10', athleteName: 'Sagar' },
  // { code: 'susan10', athleteName: 'Susan' },
  // { code: 'sowen10', athleteName: 'Sowen' },
  // { code: 'saru10', athleteName: 'Saru' },
  // { code: 'akash10', athleteName: 'Akash' },
  // { code: 'karnik10', athleteName: 'Karnik' },
  // { code: 'nehal10', athleteName: 'Nehal' },
  // { code: 'rajani10', athleteName: 'Rajani' },
  // { code: 'kamal10', athleteName: 'Kamal' },
  { code: 'iconic10', athleteName: 'iconic' }
];

// Generate athlete coupons with 5% discount
const sampleCoupons = athleteCodes.map(athlete => ({
  code: athlete.code.toUpperCase(),
  description: `${athlete.athleteName}'s athlete code - 10% off your order`,
  discountType: 'percentage',
  discountValue: 10,
  minimumOrderAmount: 0, // No minimum order amount
  maxDiscountAmount: null, // No maximum discount cap
  usageLimit: null, // Unlimited total usage
  userUsageLimit: null, // Unlimited usage per customer (but only once per order)
  validDays: 365 // Valid for 1 year
}));

async function seedCoupons() {
  try {
    // Connect to database
    await connectDB("mongodb+srv://Aashrya77:0908@nodejslearning.qeemezd.mongodb.net/Power_Supplement?retryWrites=true&w=majority&appName=NodeJsLearning");
    console.log('Connected to MongoDB');

    // Find an admin user to set as creator
    let adminUser = await User.findOne({ isAdmin: true });

    // Clear existing coupons (optional - comment out if you want to keep existing)
    // await Coupon.deleteMany({});
    // console.log('Cleared existing coupons');

    // Create coupons
    const createdCoupons = [];
    
    for (const couponData of sampleCoupons) {
      // Check if coupon already exists
      const existingCoupon = await Coupon.findOne({ code: couponData.code });
      
      if (existingCoupon) {
        console.log(`Coupon ${couponData.code} already exists, skipping...`);
        continue;
      }

      const validFrom = new Date();
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + couponData.validDays);

      const coupon = await Coupon.create({
        code: couponData.code,
        description: couponData.description,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        minimumOrderAmount: couponData.minimumOrderAmount || 0,
        maxDiscountAmount: couponData.maxDiscountAmount || null,
        usageLimit: couponData.usageLimit,
        userUsageLimit: couponData.userUsageLimit || 1,
        applicableCategories: couponData.applicableCategories || [],
        validFrom,
        validUntil,
        isActive: true,
        createdBy: adminUser._id
      });

      createdCoupons.push(coupon);
      console.log(`Created coupon: ${coupon.code}`);
    }

    console.log(`\n✅ Successfully seeded ${createdCoupons.length} coupons`);
    
    // Display created coupons
    console.log('\n📋 Available Coupons:');
    console.log('═══════════════════════════════════════════════════════════════');
    
    for (const coupon of createdCoupons) {
      console.log(`\nCode: ${coupon.code}`);
      console.log(`Description: ${coupon.description}`);
      console.log(`Discount: ${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : 'NPR ' + coupon.discountValue}`);
      console.log(`Min Order: NPR ${coupon.minimumOrderAmount}`);
      if (coupon.maxDiscountAmount) {
        console.log(`Max Discount: NPR ${coupon.maxDiscountAmount}`);
      }
      console.log(`Valid Until: ${coupon.validUntil.toLocaleDateString()}`);
      console.log('───────────────────────────────────────────────────────────────');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
}

// Run the seeder
seedCoupons();
