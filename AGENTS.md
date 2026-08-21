The Main theme Color
Background : #f8f8f8
Text Color :#1a1a1a
Text active : #eaae36
Card Background : #ffffff

!! THIS PROJECT IS USING INDONESIAN LANGUAGE !!
On controller every validation need to return error message in Indonesian.
But on Model, table name, column name, and any other function just use English.
And column name makesure like this : firstWord_secondWord_thirdWord_...etc.

Make sure the design is consistent.

So This project is Internal System for Employee and make them feel comfortable to use it.

Every addding new Route also make the seeder to insert that route into database.
And Create seeder for creating new dashboard menu , but its just for if we create the new table, and create the dashbaord menu by the index route that table.
If its done run php artisan db:seed --class={name}Seeder and copy the route seeder to Route Setting Seeder.
After done running the seeder pleace delete it.
Do not create route for existing table or route that already in database.

Every create a migraion for editing table pleace check first if the table is already exists, if the table is exists pleace edit the table using edit migration not create new migration. and help me create a migartion editing table combined with migration create table so as not to multiply files
