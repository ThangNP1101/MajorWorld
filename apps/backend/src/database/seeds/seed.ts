import { AppDataSource } from "../data-source";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("🌱 Starting database seed...");

    const queryRunner = AppDataSource.createQueryRunner();

    // Seed app_configs
    const existingConfig = await queryRunner.query(`
      SELECT COUNT(*) as count FROM app_configs
    `);
    if (parseInt(existingConfig[0].count) === 0) {
      await queryRunner.query(`
        INSERT INTO app_configs (tap_menu_bg, status_bar_bg, title_bar_bg)
        VALUES ('#9f7575', '#000000', '#FFFFFF')
      `);
      console.log("✅ App config seeded");
    } else {
      console.log("⏭️  App config already exists, skipping");
    }

    // Seed bottom_menus
    const existingMenus = await queryRunner.query(`
      SELECT COUNT(*) as count FROM bottom_menus
    `);
    if (parseInt(existingMenus[0].count) === 0) {
      await queryRunner.query(`
        INSERT INTO bottom_menus (menu_name, connection_url, sort_order, is_active)
        VALUES 
          ('Home', '/', 1, true),
          ('Coupons', '/coupons', 2, true),
          ('Order Inquiry', '/orders', 3, true)
      `);
      console.log("✅ Bottom menus seeded");
    } else {
      console.log("⏭️  Bottom menus already exist, skipping");
    }

    // Seed splash_images
    const existingSplash = await queryRunner.query(`
      SELECT COUNT(*) as count FROM splash_images
    `);
    if (parseInt(existingSplash[0].count) === 0) {
      await queryRunner.query(`
        INSERT INTO splash_images (aspect_ratio, device_type, dimensions)
        VALUES 
          ('9:16', 'Regular smartphones', '1080 x 1920px'),
          ('9:19.5', 'Galaxy S series', '1080 x 2340px'),
          ('9:20', 'iPhone 12/13', '1125 x 2436px'),
          ('9:18', 'Normal full screen', '1080 x 2160px'),
          ('9:21', 'iPhone 14 Pro', '1179 x 2556px'),
          ('9:19', 'Old Android', '1080 x 2280px')
      `);
      console.log("✅ Splash images seeded");
    } else {
      console.log("⏭️  Splash images already exist, skipping");
    }

    // Seed app_features
    const existingFeatures = await queryRunner.query(`
      SELECT COUNT(*) as count FROM app_features
    `);
    if (parseInt(existingFeatures[0].count) === 0) {
      await queryRunner.query(`
        INSERT INTO app_features (
          splash_duration, 
          popup_enabled, 
          popup_cycle_days,
          popup_button_text,
          network_error_message
        )
        VALUES (
          2, 
          true, 
          7,
          'Sign up for alerts',
          'Please check your internet connection'
        )
      `);
      console.log("✅ App features seeded");
    } else {
      console.log("⏭️  App features already exist, skipping");
    }

    await queryRunner.release();

    console.log("🎉 Database seed completed successfully!");
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
