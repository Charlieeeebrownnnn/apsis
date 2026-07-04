import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-15',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const rootDir = process.cwd();

const clothingLookIds = [1, 2, 3, 4, 5, 6, 8, 9, 10];

const lookNames = [
  'Orbital Field 01',
  'Quiet Velocity 02',
  'Light Instrument 03',
  'Weather Drift 04',
  'Ivory Motion 05',
  'Black Field 06',
  'Dust Signal 07',
  'Urban Pressure 08',
  'Low Gravity 09',
];

const materials = [
  'Technical shell / liquid nylon / taped seam',
  'Compressed cotton / weather membrane / soft lining',
  'Reflective surface / nylon twill / orbital cut',
  'Washed graphite textile / layered air pocket',
  'Ivory motion shell / matte hardware / inner mesh',
  'Black field fabric / adjustable contour / raw edge',
  'Dust coated weave / movement vent / hidden closure',
  'Urban race cloth / dry handle / articulated sleeve',
  'Low gravity textile / wind panel / soft structure',
];

const notes = [
  'A garment built for motion without noise.',
  'Runway posture translated into a wearable system.',
  'Light catches the fabric like a moving instrument.',
  'Designed for distance, weather, and quiet speed.',
  'A soft shell that keeps a precise silhouette.',
  'The body moves first; the garment answers later.',
  'Details remain close to the skin and almost hidden.',
  'A city object with field-test proportions.',
  'Quiet volume, controlled drift, practical gravity.',
];

const prices = [
  'NT$ 18,800',
  'NT$ 22,400',
  'NT$ 19,600',
  'NT$ 24,000',
  'NT$ 21,800',
  'NT$ 20,200',
  'NT$ 23,600',
  'NT$ 18,400',
  'NT$ 25,200',
];

function getImagePath(...segments) {
  return path.join(rootDir, 'public', 'images', 'clothes', ...segments);
}

async function uploadImage(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image: ${filePath}`);
  }

  const fileStream = fs.createReadStream(filePath);

  return client.assets.upload('image', fileStream, {
    filename: path.basename(filePath),
    title: label,
  });
}

async function importClothingLooks() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    throw new Error('Missing SANITY_WRITE_TOKEN in .env.local');
  }

  for (const [index, lookId] of clothingLookIds.entries()) {
    const order = index + 1;
    const mainImagePath = getImagePath(`${lookId}-1.png`);
    const detailImagePath = getImagePath(lookId === 1 ? 'new1.png' : `${lookId}.png`);

    const name = lookNames[index];

    console.log(`Uploading images for ${name}...`);

    const [mainImageAsset, detailImageAsset] = await Promise.all([
      uploadImage(mainImagePath, `${name} main image`),
      uploadImage(detailImagePath, `${name} detail image`),
    ]);

    const document = {
      _id: `clothingLook-${lookId}`,
      _type: 'clothingLook',
      order,
      name,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: mainImageAsset._id,
        },
      },
      detailImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: detailImageAsset._id,
        },
      },
      material: materials[index],
      note: notes[index],
      price: prices[index],
    };

    await client.createOrReplace(document);

    console.log(`Imported ${document.name}`);
  }

  console.log('Done importing clothing looks.');
}

importClothingLooks().catch((error) => {
  console.error(error);
  process.exit(1);
});
