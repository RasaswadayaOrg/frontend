const fs = require('fs');
const file = 'src/app/actions/admin.ts';
let code = fs.readFileSync(file, 'utf8');

const tCreate = `
export async function createStoreOwner(formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const storeOwnerData = {
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    avatarUrl: formData.get('avatarUrl')
  };

  try {
    const res = await fetch(\`\${API_URL}/v1/admin/store-owners\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeOwnerData)
    });

    const data = await res.json();
    if (data.success) {
      revalidatePath('/admin/store-owners');
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Failed to create store owner' };
    }
  } catch (error) {
    console.error('Create store owner error:', error);
    return { success: false, message: 'Failed to create store owner' };
  }
}
`

const tUpdate = `
export async function updateStoreOwner(storeOwnerId: string, formData: FormData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const storeOwnerData = {
    email: formData.get('email'),
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    city: formData.get('city'),
    avatarUrl: formData.get('avatarUrl')
  };

  if (formData.get('password')) {
    (storeOwnerData as any).password = formData.get('password');
  }

  try {
    const res = await fetch(\`\${API_URL}/v1/admin/store-owners/\${storeOwnerId}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeOwnerData)
    });

    const data = await res.json();
    if (data.success) {
      revalidatePath('/admin/store-owners');
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Failed to update store owner' };
    }
  } catch (error) {
    console.error('Update store owner error:', error);
    return { success: false, message: 'Failed to update store owner' };
  }
}
`

code += "\n\n// Store Owners\n" + tCreate + "\n" + tUpdate;
fs.writeFileSync(file, code);
