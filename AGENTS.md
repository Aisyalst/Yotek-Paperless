!! ALL OF IT ITS IMPORTENT AND FIXED !!

🎨 1. Design & UI Consistency
- Colors: I will strictly use #f8f8f8 (Background), #1a1a1a (Text), #eaae36 (Active Text), and #ffffff (Cards).
- Vibe: Since this is an internal employee system, the UI must feel premium, clean, consistent, and comfortable to use every day.

🗣️ 2. The Language Split (Indonesian vs. English)
- Frontend & User-Facing (Indonesian): Anything the user sees—like UI text, alerts, and specifically Controller validation error messages—must be written in Indonesian.
- Backend & Code (English): All structural code—like Model names, Table names, function names, and variables—must remain in English.
- Database Columns: Column names must be formatted in snake_case (e.g., first_word_second_word).

🛣️ 3. Routes, Menus, and Seeders Workflow
- Route Registration: Every time I create a new Route, I must ensure it is seeded into the database. I will not create duplicate routes if they already exist in the database.
- Dashboard Menus: When a new table/feature is created, I must create a seeder to add its index route to the Dashboard Menu.
- The Seeder Merge Rule: Instead of leaving clutter, the workflow for seeders is: Create it -> Run it (db:seed) -> Copy/Merge its contents into RouteSettingSeeder -> Delete the temporary seeder file.

🗄️ 4. Migration Rules
- Check First: Before editing a table, I must always check if it already exists.
- No File Clutter: If I need to edit an existing table, I will create an alter/edit migration, not a new creation migration. If we are setting up a table and changing our minds during development, I will combine the changes into the existing migration file rather than creating multiple files for the same table.
