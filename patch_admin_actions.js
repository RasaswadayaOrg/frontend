const fs = require('fs');
const file = 'src/app/actions/admin.ts';
let code = fs.readFileSync(file, 'utf8');

// Copy Organizer actions and replace with Store Owner
const orgCreateRegex = /export async function createOrganizer[\s\S]*?\} catch \(error\) \{[\s\S]*?\}\n}/g;
const orgUpdateRegex = /export async function updateOrganizer[\s\S]*?\} catch \(error\) \{[\s\S]*?\}\n}/g;

const createOrgMatch = code.match(orgCreateRegex);
const updateOrgMatch = code.match(orgUpdateRegex);

if (createOrgMatch && updateOrgMatch) {
  const createStoreOwnerCode = createOrgMatch[0]
    .replace(/createOrganizer/g, "createStoreOwner")
    .replace(/ORGANIZER/g, "STORE_OWNER")
    .replace(/organizer/g, "storeOwner")
    .replace(/Organizer/g, "Store Owner");

  const updateStoreOwnerCode = updateOrgMatch[0]
    .replace(/updateOrganizer/g, "updateStoreOwner")
    .replace(/ORGANIZER/g, "STORE_OWNER")
    .replace(/organizerId/g, "storeOwnerId")
    .replace(/Organizer/g, "Store Owner")
    .replace(/organizer/g, "storeOwner");

  code += "\n\n// Store Owners\n" + createStoreOwnerCode + "\n\n" + updateStoreOwnerCode;
  
  fs.writeFileSync(file, code);
  console.log("Patched actions/admin.ts successfully");
} else {
  console.log("Could not find organizer functions");
}
