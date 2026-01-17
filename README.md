PySchemaGuard – VS Code Extension

PySchemaGuard is a Visual Studio Code extension that provides live, schema-aware SQL validation for Python files.

It highlights SQL-related semantic errors directly in the editor using:

Red underlines for errors

Yellow underlines for warnings

Hover tooltips with suggestions

✨ Features

Live SQL validation inside Python files

Invalid table and column detection

Intelligent fuzzy suggestions

Datatype mismatch warnings

Supports SELECT, INSERT, UPDATE, DELETE, DROP, TRUNCATE

Static analysis only (no SQL execution)

🧠 How It Works

The extension:

Detects changes in Python files

Executes the PySchemaGuard backend in the workspace

Parses structured JSON diagnostics

Displays editor underlines and tooltips

The extension itself:

Does not connect to the database

Does not contain validation logic

Acts as a thin integration layer

✅ Requirements

Python 3.8 or later

Backend repository present in workspace

Python dependencies installed:

py -m pip install -r requirements.txt


A valid schema.json file

📁 Required Workspace Structure

The opened workspace must contain the backend:

your-project/
├── src/
│   └── cli.py
├── schema.json
├── requirements.txt
└── your_code.py

▶️ Usage

Install the extension from Marketplace or VSIX

Open a workspace containing the backend

Open a Python file with SQL queries

Edit the file to trigger validation

View underlines and hover messages

⚠️ Notes

Validation triggers on file changes

Complex SQL (nested queries, alias-heavy joins) may have limited support

Schema must be regenerated if database changes

🛠️ Troubleshooting
No underlines visible

Ensure a file edit occurred

Ensure backend exists in workspace

Ensure Python dependencies are installed

ModuleNotFoundError

Run:

py -m pip install -r requirements.txt

📄 License

MIT License