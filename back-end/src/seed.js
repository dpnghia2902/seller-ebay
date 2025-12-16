  // seed.js
  // Chạy: node seed.js
  // Lưu ý: script này sẽ DROP toàn bộ database ebay_clone (nếu dùng URI mặc định)

  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ebay_clone';

  // -----------------------
  // 1. ĐỊNH NGHĨA SCHEMA
  // -----------------------
  const { Schema } = mongoose;

  // User
  const UserSchema = new Schema(
    {
      email: { type: String, unique: true, index: true },
      passwordHash: String,
      name: String,
      roles: { type: [String], default: ['buyer'] }, // ['buyer', 'seller', 'admin']
      defaultRole: { type: String, default: 'buyer' },
      buyerProfile: {
        phone: String,
        defaultShippingAddressId: Schema.Types.ObjectId,
      },
      sellerProfileId: { type: Schema.Types.ObjectId, ref: 'SellerProfile' },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  // SellerProfile
  const SellerProfileSchema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'suspended'],
        default: 'pending',
      },
      legalName: String,
      businessType: String, // 'individual', 'business'
      businessRegistrationNumber: String,
      taxId: String,
      contact: {
        phone: String,
        email: String,
      },
      payoutAccount: {
        method: { type: String, enum: ['bank', 'paypal', 'other'] },
        bankName: String,
        accountNumberMasked: String,
        accountHolder: String,
        paypalEmail: String,
      },
      kycDocs: [
        {
          type: { type: String },
          url: String,
          status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
          },
          note: String,
        },
      ],
      verificationLevel: { type: Number, default: 0 },
      reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
      reviewNote: String,
    },
    { timestamps: true }
  );

  // StorePlan
  const StorePlanSchema = new Schema(
    {
      code: { type: String, unique: true },
      name: String,
      description: String,
      monthlyPrice: Number,
      yearlyPrice: Number,
      maxActiveListings: Number,
      freeListingsPerMonth: Number,
      discountOnFeesPercent: Number,
      features: [String],
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  // Store
  const StoreSchema = new Schema(
    {
      sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', index: true },
      name: String,
      slug: { type: String, unique: true },
      logoUrl: String,
      bannerUrl: String,
      description: String,
      planId: { type: Schema.Types.ObjectId, ref: 'StorePlan' },
      subscription: {
        status: {
          type: String,
          enum: ['none', 'active', 'expired', 'cancelled'],
          default: 'none',
        },
        startDate: Date,
        endDate: Date,
        autoRenew: { type: Boolean, default: true },
        billingCycle: { type: String, enum: ['monthly', 'yearly'] },
      },
      policies: {
        shippingPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
        returnPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
        paymentPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
      },
      tags: [String],
      isPublic: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  // BusinessPolicy
  const BusinessPolicySchema = new Schema(
    {
      sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', index: true },
      type: { type: String, enum: ['shipping', 'payment', 'return'] },
      name: String,
      description: String,
      config: Schema.Types.Mixed,
      isDefault: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  // Category
  const CategorySchema = new Schema(
    {
      name: String,
      slug: String,
      parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
      path: [Schema.Types.ObjectId],
      isLeaf: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  // InventoryItem
  const InventoryItemSchema = new Schema(
    {
      sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', index: true },
      storeId: { type: Schema.Types.ObjectId, ref: 'Store', index: true },
      sku: { type: String, index: true },
      title: String,
      subtitle: String,
      description: String,
      brand: String,
      categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
      condition: String,
      itemSpecifics: [
        {
          name: String,
          value: String,
        },
      ],
      variationAttributes: [
        {
          name: String,
          values: [String],
        },
      ],
      images: [
        {
          url: String,
          isPrimary: { type: Boolean, default: false },
        },
      ],
      quantityOnHand: { type: Number, default: 0 },
      quantityReserved: { type: Number, default: 0 },
      location: {
        warehouseCode: String,
        bin: String,
      },
      isArchived: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  // Listing
  const ListingSchema = new Schema(
    {
      sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', index: true },
      storeId: { type: Schema.Types.ObjectId, ref: 'Store', index: true },
      inventoryMode: {
        type: String,
        enum: ['single', 'variation'],
        default: 'single',
      },
      inventorySku: String, // single
      variations: [
        {
          sku: String,
          attributes: [{ name: String, value: String }],
          price: Number,
          quantityOverride: Number,
        },
      ],
      title: String,
      subtitle: String,
      categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
      condition: String,
      itemSpecifics: [
        {
          name: String,
          value: String,
        },
      ],
      listingType: {
        type: String,
        enum: ['fixed_price', 'auction'],
        default: 'fixed_price',
      },
      pricing: {
        currency: { type: String, default: 'USD' },
        fixedPrice: Number,
        auction: {
          startPrice: Number,
          buyItNowPrice: Number,
          reservePrice: Number,
          durationDays: Number,
        },
      },
      totalQuantity: Number,
      shippingPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
      returnPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
      paymentPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
      status: {
        type: String,
        enum: ['draft', 'active', 'scheduled', 'ended', 'paused'],
        default: 'draft',
        index: true,
      },
      startTime: Date,
      endTime: Date,
      stats: {
        views: { type: Number, default: 0 },
        watchers: { type: Number, default: 0 },
        soldQuantity: { type: Number, default: 0 },
      },
      isFeatured: { type: Boolean, default: false },
      isPromoted: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  // Order
  const OrderSchema = new Schema(
    {
      orderNumber: { type: String, unique: true, index: true },
      buyerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
      buyerName: String,
      buyerUsername: String,
      sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', index: true },
      storeId: { type: Schema.Types.ObjectId, ref: 'Store', index: true },
      listingId: { type: Schema.Types.ObjectId, ref: 'Listing' },
      listingTitle: String,
      listingImage: String,
      customSku: String,
      variationDetails: {
        sku: String,
        attributes: [{ name: String, value: String }]
      },
      pricing: {
        itemPrice: Number,
        quantity: { type: Number, default: 1 },
        subtotal: Number,
        shippingCost: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        total: Number,
        currency: { type: String, default: 'USD' }
      },
      shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        ward: String,
        district: String,
        city: String,
        postalCode: String,
        country: String
      },
      tracking: {
        carrier: String,
        trackingNumber: String,
        shippedDate: Date,
        estimatedDelivery: Date,
        actualDelivery: Date
      },
      status: {
        type: String,
        enum: ['awaiting_payment', 'awaiting_shipment', 'shipped', 'delivered', 'returned', 'refunded', 'cancelled', 'delivery_failed'],
        default: 'awaiting_payment',
        index: true
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
      },
      paymentMethod: String,
      paymentDate: Date,
      purchaseDate: { type: Date, default: Date.now, index: true },
      paymentDueDate: Date,
      buyerNotes: String,
      sellerNotes: String,
      isGift: { type: Boolean, default: false },
      isPriority: { type: Boolean, default: false },
      returnRequest: {
        requested: { type: Boolean, default: false },
        reason: String,
        requestDate: Date,
        status: String
      },
      refundInfo: {
        amount: Number,
        reason: String,
        refundDate: Date
      }
    },
    { timestamps: true }
  );

  // -----------------------
  // 2. TẠO MODEL
  // -----------------------
  const User = mongoose.model('User', UserSchema);
  const SellerProfile = mongoose.model('SellerProfile', SellerProfileSchema);
  const StorePlan = mongoose.model('StorePlan', StorePlanSchema);
  const Store = mongoose.model('Store', StoreSchema);
  const BusinessPolicy = mongoose.model('BusinessPolicy', BusinessPolicySchema);
  const Category = mongoose.model('Category', CategorySchema);
  const InventoryItem = mongoose.model('InventoryItem', InventoryItemSchema);
  const Listing = mongoose.model('Listing', ListingSchema);
  const Order = mongoose.model('Order', OrderSchema);

  // -----------------------
  // 3. HÀM SEED
  // -----------------------
  async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', MONGODB_URI);

    // CẢNH BÁO: xoá toàn bộ DB
    await mongoose.connection.dropDatabase();
    console.log('⚠️  Dropped existing database');

    // 3.1. Tạo user mẫu
    const passwordHash = await bcrypt.hash('password123', 10);

    const buyerUser = await User.create({
      email: 'buyer@example.com',
      passwordHash,
      name: 'Test Buyer',
      roles: ['buyer'],
      defaultRole: 'buyer',
    });

    const sellerUser = await User.create({
      email: 'seller@example.com',
      passwordHash,
      name: 'Test Seller',
      roles: ['buyer', 'seller'],
      defaultRole: 'seller',
    });

    console.log('👤 Seeded users:', { buyerUser: buyerUser.email, sellerUser: sellerUser.email });

    // 3.2. Tạo SellerProfile cho sellerUser (đã verify)
    const sellerProfile = await SellerProfile.create({
      userId: sellerUser._id,
      status: 'verified',
      legalName: 'ABC Tech Co., Ltd',
      businessType: 'business',
      taxId: '0123456789',
      contact: {
        phone: '0909-000-111',
        email: sellerUser.email,
      },
      payoutAccount: {
        method: 'bank',
        bankName: 'ACB',
        accountNumberMasked: '******6789',
        accountHolder: 'ABC Tech Co., Ltd',
      },
      verificationLevel: 1,
      reviewNote: 'Auto-verified for seed data',
    });

    // update user → gắn sellerProfileId
    sellerUser.sellerProfileId = sellerProfile._id;
    await sellerUser.save();

    console.log('🏪 Seeded sellerProfile for:', sellerUser.email);

    // 3.3. Seed store plans
    const plans = await StorePlan.insertMany([
      {
        code: 'STARTER',
        name: 'Starter Store',
        description: 'Gói cơ bản cho người bán nhỏ.',
        monthlyPrice: 7.95,
        yearlyPrice: 4.95 * 12,
        maxActiveListings: 250,
        freeListingsPerMonth: 50,
        discountOnFeesPercent: 0,
        features: ['storefront', 'basic_reports'],
      },
      {
        code: 'BASIC',
        name: 'Basic Store',
        description: 'Gói cho người bán nghiêm túc.',
        monthlyPrice: 27.95,
        yearlyPrice: 21.95 * 12,
        maxActiveListings: 1000,
        freeListingsPerMonth: 250,
        discountOnFeesPercent: 5,
        features: ['storefront', 'promotions', 'basic_reports'],
      },
      {
        code: 'PREMIUM',
        name: 'Premium Store',
        description: 'Gói cho doanh nghiệp lớn.',
        monthlyPrice: 74.95,
        yearlyPrice: 59.95 * 12,
        maxActiveListings: -1,
        freeListingsPerMonth: 1000,
        discountOnFeesPercent: 10,
        features: ['storefront', 'promotions', 'advanced_reports', 'priority_support'],
      },
    ]);

    const starterPlan = plans.find((p) => p.code === 'STARTER');
    console.log('📦 Seeded store plans:', plans.map((p) => p.code));

    // 3.4. Seed category
    const [electronicsCategory, fashionCategory] = await Category.insertMany([
      {
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        path: [],
        isLeaf: false,
      },
      {
        name: 'Headphones',
        slug: 'headphones',
        parentId: null, // bạn có thể set parent là electronicsCategory._id nếu muốn
        path: [],
        isLeaf: true,
      },
    ]);

    console.log('📚 Seeded categories:', electronicsCategory.name, fashionCategory.name);

    // 3.5. Tạo Store cho sellerProfile với gói STARTER
    const store = await Store.create({
      sellerId: sellerProfile._id,
      name: 'ABC Tech Store',
      slug: 'abc-tech-store',
      logoUrl: 'https://example.com/logo.png',
      bannerUrl: 'https://example.com/banner.png',
      description: 'Cửa hàng chuyên đồ công nghệ.',
      planId: starterPlan._id,
      subscription: {
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 ngày
        autoRenew: true,
        billingCycle: 'monthly',
      },
      tags: ['electronics', 'tech'],
      isPublic: true,
    });

    console.log('🏬 Seeded store:', store.name);

    // 3.6. Business Policies cơ bản cho seller
    const [shippingPolicy, paymentPolicy, returnPolicy] = await BusinessPolicy.insertMany([
      {
        sellerId: sellerProfile._id,
        type: 'shipping',
        name: 'Standard Shipping',
        description: 'Giao hàng tiêu chuẩn 3-7 ngày.',
        config: {
          serviceName: 'Standard',
          estimatedDaysMin: 3,
          estimatedDaysMax: 7,
          fee: 30000,
          freeAbove: 500000,
        },
        isDefault: true,
      },
      {
        sellerId: sellerProfile._id,
        type: 'payment',
        name: 'Default Payment',
        description: 'Thanh toán qua thẻ hoặc ví.',
        config: {
          methods: ['card', 'wallet'],
        },
        isDefault: true,
      },
      {
        sellerId: sellerProfile._id,
        type: 'return',
        name: '30 days return',
        description: 'Đổi trả trong 30 ngày.',
        config: {
          days: 30,
          paidBy: 'buyer',
        },
        isDefault: true,
      },
    ]);

    // gắn policy default vào store
    store.policies = {
      shippingPolicyId: shippingPolicy._id,
      returnPolicyId: returnPolicy._id,
      paymentPolicyId: paymentPolicy._id,
    };
    await store.save();

    console.log('📜 Seeded business policies & linked to store.');

    // 3.7. Seed Inventory + Listings mẫu
    // Sản phẩm 1
    const inventory1 = await InventoryItem.create({
      sellerId: sellerProfile._id,
      storeId: store._id,
      sku: 'HPH-0001',
      title: 'Tai nghe Bluetooth XYZ',
      subtitle: 'Bản tiêu chuẩn',
      description: 'Tai nghe Bluetooth XYZ với pin 20h, chống ồn cơ bản.',
      brand: 'XYZ',
      categoryId: fashionCategory._id,
      condition: 'new',
      itemSpecifics: [
        { name: 'Color', value: 'Black' },
        { name: 'Bluetooth', value: '5.0' },
      ],
      images: [
        { url: 'https://example.com/products/hph-0001-1.png', isPrimary: true },
        { url: 'https://example.com/products/hph-0001-2.png', isPrimary: false },
      ],
      quantityOnHand: 10,
      quantityReserved: 0,
      isArchived: false,
    });

    const listing1 = await Listing.create({
      sellerId: sellerProfile._id,
      storeId: store._id,
      inventoryMode: 'single',
      inventorySku: inventory1.sku,
      title: inventory1.title,
      subtitle: inventory1.subtitle,
      categoryId: inventory1.categoryId,
      condition: inventory1.condition,
      itemSpecifics: inventory1.itemSpecifics,
      listingType: 'fixed_price',
      pricing: {
        currency: 'VND',
        fixedPrice: 299000,
      },
      totalQuantity: inventory1.quantityOnHand,
      shippingPolicyId: shippingPolicy._id,
      returnPolicyId: returnPolicy._id,
      paymentPolicyId: paymentPolicy._id,
      status: 'active',
      startTime: new Date(),
      stats: {
        views: 0,
        watchers: 0,
        soldQuantity: 0,
      },
      isFeatured: false,
      isPromoted: false,
    });

    // Sản phẩm 2
    const inventory2 = await InventoryItem.create({
      sellerId: sellerProfile._id,
      storeId: store._id,
      sku: 'HPH-0002',
      title: 'Tai nghe Bluetooth XYZ Pro',
      subtitle: 'Chống ồn chủ động',
      description: 'Bản Pro với chống ồn chủ động, pin 30h.',
      brand: 'XYZ',
      categoryId: fashionCategory._id,
      condition: 'new',
      itemSpecifics: [
        { name: 'Color', value: 'White' },
        { name: 'Bluetooth', value: '5.3' },
      ],
      images: [
        { url: 'https://example.com/products/hph-0002-1.png', isPrimary: true },
      ],
      quantityOnHand: 5,
      quantityReserved: 0,
      isArchived: false,
    });

    const listing2 = await Listing.create({
      sellerId: sellerProfile._id,
      storeId: store._id,
      inventoryMode: 'single',
      inventorySku: inventory2.sku,
      title: inventory2.title,
      subtitle: inventory2.subtitle,
      categoryId: inventory2.categoryId,
      condition: inventory2.condition,
      itemSpecifics: inventory2.itemSpecifics,
      listingType: 'fixed_price',
      pricing: {
        currency: 'VND',
        fixedPrice: 499000,
      },
      totalQuantity: inventory2.quantityOnHand,
      shippingPolicyId: shippingPolicy._id,
      returnPolicyId: returnPolicy._id,
      paymentPolicyId: paymentPolicy._id,
      status: 'active',
      startTime: new Date(),
      stats: {
        views: 0,
        watchers: 0,
        soldQuantity: 0,
      },
      isFeatured: true,
      isPromoted: false,
    });

    console.log('📦 Seeded inventory & listings: ', {
      inventorySkus: [inventory1.sku, inventory2.sku],
      listingIds: [listing1._id.toString(), listing2._id.toString()],
    });

    // 3.8. Seed Orders
    const now = Date.now();
    const daysAgo = (days) => new Date(now - days * 24 * 60 * 60 * 1000);
    
    const orders = await Order.insertMany([
      {
        orderNumber: '25-09016-24731',
        buyerId: buyerUser._id,
        buyerName: 'Pamela Wilson',
        buyerUsername: 'pammy5501',
        sellerId: sellerProfile._id,
        storeId: store._id,
        listingId: listing1._id,
        listingTitle: 'Das elektrische Kabel 2 Kerne 1mm-1,5mm der weiße oder schwarze Flexibele',
        listingImage: 'https://example.com/products/cable.jpg',
        customSku: 'cable_2',
        pricing: {
          itemPrice: 1.00,
          quantity: 1,
          subtotal: 1.00,
          shippingCost: 0,
          tax: 0,
          total: 1.07,
          currency: 'USD'
        },
        shippingAddress: {
          fullName: 'Pamela Wilson',
          phone: '555-0123',
          street: '123 Main St',
          city: 'Los Angeles',
          postalCode: '32808-1348',
          country: 'United States'
        },
        status: 'awaiting_shipment',
        paymentStatus: 'paid',
        paymentMethod: 'PayPal',
        paymentDate: daysAgo(1),
        purchaseDate: daysAgo(1),
      },
      {
        orderNumber: '25-09016-24732',
        buyerId: buyerUser._id,
        buyerName: 'John Smith',
        buyerUsername: 'johnsmith88',
        sellerId: sellerProfile._id,
        storeId: store._id,
        listingId: listing2._id,
        listingTitle: listing2.title,
        listingImage: 'https://example.com/products/hph-0002-1.png',
        customSku: inventory2.sku,
        pricing: {
          itemPrice: 499000,
          quantity: 1,
          subtotal: 499000,
          shippingCost: 30000,
          tax: 0,
          total: 529000,
          currency: 'VND'
        },
        shippingAddress: {
          fullName: 'John Smith',
          phone: '0909123456',
          street: '456 Tech Ave',
          ward: 'Ward 5',
          district: 'District 1',
          city: 'Ho Chi Minh',
          postalCode: '70000',
          country: 'Vietnam'
        },
        tracking: {
          carrier: 'Giao Hang Nhanh',
          trackingNumber: 'GHN123456789',
          shippedDate: daysAgo(3),
          estimatedDelivery: daysAgo(1),
        },
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        paymentDate: daysAgo(5),
        purchaseDate: daysAgo(5),
      },
      {
        orderNumber: '25-09016-24733',
        buyerId: buyerUser._id,
        buyerName: 'Alice Johnson',
        buyerUsername: 'alice_j',
        sellerId: sellerProfile._id,
        storeId: store._id,
        listingId: listing1._id,
        listingTitle: listing1.title,
        listingImage: 'https://example.com/products/hph-0001-1.png',
        customSku: inventory1.sku,
        pricing: {
          itemPrice: 299000,
          quantity: 2,
          subtotal: 598000,
          shippingCost: 30000,
          tax: 0,
          total: 628000,
          currency: 'VND'
        },
        shippingAddress: {
          fullName: 'Alice Johnson',
          phone: '0912345678',
          street: '789 Market St',
          ward: 'Ward 10',
          district: 'District 3',
          city: 'Ho Chi Minh',
          postalCode: '70000',
          country: 'Vietnam'
        },
        tracking: {
          carrier: 'Vietnam Post',
          trackingNumber: 'VNP987654321',
          shippedDate: daysAgo(10),
          estimatedDelivery: daysAgo(3),
          actualDelivery: daysAgo(2),
        },
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'COD',
        paymentDate: daysAgo(2),
        purchaseDate: daysAgo(12),
      },
      {
        orderNumber: '25-09016-24734',
        buyerId: buyerUser._id,
        buyerName: 'Bob Williams',
        buyerUsername: 'bobw',
        sellerId: sellerProfile._id,
        storeId: store._id,
        listingId: listing2._id,
        listingTitle: listing2.title,
        listingImage: 'https://example.com/products/hph-0002-1.png',
        customSku: inventory2.sku,
        pricing: {
          itemPrice: 499000,
          quantity: 1,
          subtotal: 499000,
          shippingCost: 0,
          tax: 0,
          total: 499000,
          currency: 'VND'
        },
        shippingAddress: {
          fullName: 'Bob Williams',
          phone: '0987654321',
          street: '321 Tech Park',
          ward: 'Ward 2',
          district: 'District 2',
          city: 'Hanoi',
          postalCode: '10000',
          country: 'Vietnam'
        },
        status: 'awaiting_payment',
        paymentStatus: 'pending',
        paymentMethod: 'Bank Transfer',
        purchaseDate: daysAgo(0),
        paymentDueDate: new Date(now + 2 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: '25-09016-24735',
        buyerId: buyerUser._id,
        buyerName: 'Emma Davis',
        buyerUsername: 'emma_d',
        sellerId: sellerProfile._id,
        storeId: store._id,
        listingId: listing1._id,
        listingTitle: listing1.title,
        listingImage: 'https://example.com/products/hph-0001-1.png',
        customSku: inventory1.sku,
        pricing: {
          itemPrice: 299000,
          quantity: 1,
          subtotal: 299000,
          shippingCost: 30000,
          tax: 0,
          total: 329000,
          currency: 'VND'
        },
        shippingAddress: {
          fullName: 'Emma Davis',
          phone: '0909999888',
          street: '555 Oak St',
          ward: 'Ward 7',
          district: 'District 5',
          city: 'Ho Chi Minh',
          postalCode: '70000',
          country: 'Vietnam'
        },
        status: 'cancelled',
        paymentStatus: 'refunded',
        paymentMethod: 'PayPal',
        paymentDate: daysAgo(20),
        purchaseDate: daysAgo(20),
        refundInfo: {
          amount: 329000,
          reason: 'Customer changed mind',
          refundDate: daysAgo(18),
        }
      },
      {
        orderNumber: '25-09016-24736',
        buyerId: buyerUser._id,
        buyerName: 'Michael Brown',
        buyerUsername: 'mikeb',
        sellerId: sellerProfile._id,
        storeId: store._id,
        listingId: listing2._id,
        listingTitle: listing2.title,
        listingImage: 'https://example.com/products/hph-0002-1.png',
        customSku: inventory2.sku,
        pricing: {
          itemPrice: 499000,
          quantity: 1,
          subtotal: 499000,
          shippingCost: 30000,
          tax: 0,
          total: 529000,
          currency: 'VND'
        },
        shippingAddress: {
          fullName: 'Michael Brown',
          phone: '0988777666',
          street: '777 Pine Ave',
          ward: 'Ward 1',
          district: 'District 1',
          city: 'Da Nang',
          postalCode: '50000',
          country: 'Vietnam'
        },
        tracking: {
          carrier: 'Giao Hang Nhanh',
          trackingNumber: 'GHN111222333',
          shippedDate: daysAgo(15),
          estimatedDelivery: daysAgo(12),
        },
        status: 'returned',
        paymentStatus: 'refunded',
        paymentMethod: 'Credit Card',
        paymentDate: daysAgo(16),
        purchaseDate: daysAgo(16),
        returnRequest: {
          requested: true,
          reason: 'Product defective',
          requestDate: daysAgo(13),
          status: 'completed'
        },
        refundInfo: {
          amount: 529000,
          reason: 'Product defective - returned',
          refundDate: daysAgo(10),
        }
      },
      {
        orderNumber: '25-09016-24737',
        buyerId: buyerUser._id,
        buyerName: 'Sarah Miller',
        buyerUsername: 'sarahm',
        sellerId: sellerProfile._id,
        storeId: store._id,
        listingId: listing1._id,
        listingTitle: listing1.title,
        listingImage: 'https://example.com/products/hph-0001-1.png',
        customSku: inventory1.sku,
        pricing: {
          itemPrice: 299000,
          quantity: 1,
          subtotal: 299000,
          shippingCost: 30000,
          tax: 0,
          total: 329000,
          currency: 'VND'
        },
        shippingAddress: {
          fullName: 'Sarah Miller',
          phone: '0977888999',
          street: '888 Elm St',
          ward: 'Ward 3',
          district: 'District 7',
          city: 'Ho Chi Minh',
          postalCode: '70000',
          country: 'Vietnam'
        },
        tracking: {
          carrier: 'Vietnam Post',
          trackingNumber: 'VNP444555666',
          shippedDate: daysAgo(7),
          estimatedDelivery: daysAgo(2),
        },
        status: 'delivery_failed',
        paymentStatus: 'paid',
        paymentMethod: 'COD',
        purchaseDate: daysAgo(8),
        sellerNotes: 'Customer not available at address, multiple delivery attempts failed'
      },
    ]);

    console.log('📋 Seeded orders:', orders.length, 'orders created');

    // 3.9. Seed Reviews
    const ReviewSchema = new Schema(
      {
        orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
        listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
        buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        buyerName: String,
        buyerUsername: String,
        sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', required: true, index: true },
        storeId: { type: Schema.Types.ObjectId, ref: 'Store', index: true },
        rating: { type: Number, required: true, min: 1, max: 5, index: true },
        title: String,
        comment: { type: String, maxlength: 5000 },
        photos: [String],
        status: {
          type: String,
          enum: ['published', 'hidden', 'removed', 'pending_moderation'],
          default: 'published',
          index: true,
        },
        sellerResponse: {
          message: { type: String, maxlength: 5000 },
          respondedAt: Date,
          updatedAt: Date,
        },
        isReported: { type: Boolean, default: false },
        reportedReason: String,
        reportedAt: Date,
        helpfulVotes: { type: Number, default: 0 },
        notHelpfulVotes: { type: Number, default: 0 },
        verifiedPurchase: { type: Boolean, default: true },
        reviewDate: { type: Date, default: Date.now, index: true },
        ipAddress: String,
        deviceInfo: String,
      },
      { timestamps: true }
    );

    const Review = mongoose.model('Review', ReviewSchema);

    // Get delivered orders for reviews
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    
    const reviews = await Review.insertMany([
      {
        orderId: deliveredOrders[0]._id,
        listingId: deliveredOrders[0].listingId,
        buyerId: deliveredOrders[0].buyerId,
        buyerName: deliveredOrders[0].buyerName,
        buyerUsername: deliveredOrders[0].buyerUsername,
        sellerId: sellerProfile._id,
        storeId: store._id,
        rating: 5,
        title: 'Excellent product, fast shipping!',
        comment: 'The headphones arrived quickly and work perfectly. Great sound quality and comfortable to wear. Highly recommend this seller!',
        status: 'published',
        sellerResponse: {
          message: 'Thank you for your positive feedback! We\'re glad you\'re happy with your purchase. If you need any assistance, please don\'t hesitate to contact us.',
          respondedAt: daysAgo(1),
          updatedAt: daysAgo(1),
        },
        helpfulVotes: 12,
        notHelpfulVotes: 0,
        verifiedPurchase: true,
        reviewDate: daysAgo(1),
      },
      {
        orderId: deliveredOrders[1]?._id || orders[2]._id,
        listingId: deliveredOrders[1]?.listingId || orders[2].listingId,
        buyerId: deliveredOrders[1]?.buyerId || orders[2].buyerId,
        buyerName: deliveredOrders[1]?.buyerName || orders[2].buyerName,
        buyerUsername: deliveredOrders[1]?.buyerUsername || orders[2].buyerUsername,
        sellerId: sellerProfile._id,
        storeId: store._id,
        rating: 4,
        title: 'Good quality, but shipping was a bit slow',
        comment: 'The product itself is good quality and matches the description. However, shipping took longer than expected. Overall satisfied with the purchase.',
        status: 'published',
        helpfulVotes: 5,
        notHelpfulVotes: 1,
        verifiedPurchase: true,
        reviewDate: daysAgo(2),
      },
      {
        orderId: orders[1]._id,
        listingId: orders[1].listingId,
        buyerId: orders[1].buyerId,
        buyerName: orders[1].buyerName,
        buyerUsername: orders[1].buyerUsername,
        sellerId: sellerProfile._id,
        storeId: store._id,
        rating: 3,
        title: 'Average product',
        comment: 'The item works but not as good as I expected. The noise cancellation feature is okay but not great. Packaging could be better.',
        status: 'published',
        helpfulVotes: 2,
        notHelpfulVotes: 0,
        verifiedPurchase: true,
        reviewDate: daysAgo(3),
      },
      {
        orderId: orders[0]._id,
        listingId: orders[0].listingId,
        buyerId: orders[0].buyerId,
        buyerName: orders[0].buyerName,
        buyerUsername: orders[0].buyerUsername,
        sellerId: sellerProfile._id,
        storeId: store._id,
        rating: 2,
        title: 'Not satisfied with the product',
        comment: 'The product arrived damaged and the quality is not what was described. Customer service was slow to respond. Would not recommend.',
        status: 'hidden',
        sellerResponse: {
          message: 'We apologize for the inconvenience. We have reached out to you directly to resolve this issue. Please check your messages.',
          respondedAt: daysAgo(0),
          updatedAt: daysAgo(0),
        },
        helpfulVotes: 1,
        notHelpfulVotes: 3,
        verifiedPurchase: true,
        reviewDate: daysAgo(5),
      },
      {
        orderId: orders[2]._id,
        listingId: orders[2].listingId,
        buyerId: orders[2].buyerId,
        buyerName: orders[2].buyerName,
        buyerUsername: orders[2].buyerUsername,
        sellerId: sellerProfile._id,
        storeId: store._id,
        rating: 5,
        title: 'Perfect! Exceeded expectations',
        comment: 'Amazing product quality! Fast shipping and excellent packaging. The seller was very professional and responsive. Will definitely buy again!',
        status: 'published',
        helpfulVotes: 8,
        notHelpfulVotes: 0,
        verifiedPurchase: true,
        reviewDate: daysAgo(4),
      },
    ]);

    console.log('⭐ Seeded reviews:', reviews.length, 'reviews created');

    console.log('✅ DONE SEEDING. Users password = "password123"');
  }

  // -----------------------
  // 4. RUN
  // -----------------------
  seed()
    .then(() => {
      console.log('🎉 Seed finished successfully.');
      return mongoose.disconnect();
    })
    .catch((err) => {
      console.error('❌ Seed error:', err);
      mongoose.disconnect();
    });
