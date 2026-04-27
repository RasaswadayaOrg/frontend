const fs = require('fs');
const file = 'src/app/actions/admin.ts';
let code = fs.readFileSync(file, 'utf8');

// The file likely has // Store Owners twice
const parts = code.split("// Store Owners");
if (parts.length > 2) {
  // Take everything before the first one, and just keep one of the Store Owners block
  code = parts[0] + "// Store Owners" + parts[1];
  fs.writeFileSync(file, code);
  console.log("Removed duplicate generic methods");
}
