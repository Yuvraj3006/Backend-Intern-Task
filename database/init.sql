


CREATE TABLE users(
    serialNum SERIAL,
    username TEXT,
    useremail TEXT PRIMARY KEY,
    userphone VARCHAR(10),
    userpass TEXT,
);


CREATE TABLE expense (
    serialNum SERIAL,
    username TEXT,
    useremail TEXT REFERENCES users(useremail),
    expense_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expense_amount DECIMAL(10, 2),
    expense_description TEXT DEFAULT NULL,
    issplit BOOL,
    splittype TEXT,
    expense_uuid UUID DEFAULT uuid_generate_v4()
);



CREATE TABLE split_details (
    serialNum SERIAL PRIMARY KEY,
    totalamount DECIMAL(10, 2),
    split_type TEXT,
    split_ways INT,  -- Define data type for split_ways
    split_amount DECIMAL(10, 2)[],  -- Array of split amounts
    split_among TEXT[],  -- Array of user identifiers (could be user emails)
    expense_uuid UUID REFERENCES expense(expense_uuid)  -- Foreign key referencing expense table
);
