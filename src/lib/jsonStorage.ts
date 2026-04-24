import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR);
}

/**
 * Save new data to a local JSON file
 */
export async function saveLocal(file: string, data: any) {
  const filePath = path.join(STORAGE_DIR, `${file}.json`);
  let existing = [];
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  const newItem = { ...data, _id: Date.now().toString(), createdAt: new Date() };
  existing.push(newItem);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  return newItem;
}

/**
 * Get all data from a local JSON file
 */
export async function getLocal(file: string) {
  const filePath = path.join(STORAGE_DIR, `${file}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Error reading local file ${file}:`, e);
    return [];
  }
}

/**
 * Update an existing item in a local JSON file
 */
export async function updateLocal(file: string, id: string, data: any) {
  const filePath = path.join(STORAGE_DIR, `${file}.json`);
  if (!fs.existsSync(filePath)) return;
  
  try {
    let existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = existing.findIndex((item: any) => item._id === id || item.id === id);
    
    if (index !== -1) {
      existing[index] = { ...existing[index], ...data, updatedAt: new Date() };
      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    }
  } catch (e) {
    console.error(`Error updating local file ${file}:`, e);
  }
}

/**
 * Delete an item from a local JSON file
 */
export async function deleteLocal(file: string, id: string) {
  const filePath = path.join(STORAGE_DIR, `${file}.json`);
  if (!fs.existsSync(filePath)) return;
  
  try {
    let existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const filtered = existing.filter((item: any) => item._id !== id && item.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
  } catch (e) {
    console.error(`Error deleting from local file ${file}:`, e);
  }
}
