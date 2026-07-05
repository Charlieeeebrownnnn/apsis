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

const chairProducts = [
  {
    id: 'orbit-01',
    order: 1,
    name: 'Orbit Chair 01',
    image: 'chair1.png',
    material: 'Smoked polymer shell / brushed alloy base',
    note: 'A low gravity seat study for domestic motion.',
    price: 'NT$ 42,000',
  },
  {
    id: 'orbit-02',
    order: 2,
    name: 'Orbit Chair 02',
    image: 'chair2.webp',
    material: 'Graphite textile / satin black frame',
    note: 'Compressed posture, soft reflection, quiet rotation.',
    price: 'NT$ 39,000',
  },
  {
    id: 'orbit-03',
    order: 3,
    name: 'Orbit Chair 03',
    image: 'chair3.webp',
    material: 'Warm shell / powder coated steel',
    note: 'Built as a calm object inside fast rooms.',
    price: 'NT$ 41,000',
  },
  {
    id: 'orbit-04',
    order: 4,
    name: 'Orbit Chair 04',
    image: 'chair4.webp',
    material: 'Deep fabric / orbital metal joint',
    note: 'A chair that holds light without shouting.',
    price: 'NT$ 45,000',
  },
  {
    id: 'orbit-05',
    order: 5,
    name: 'Orbit Chair 05',
    image: 'chair5.png',
    material: 'Ivory composite / shadow lacquer',
    note: 'Soft geometry with a sharper silhouette.',
    price: 'NT$ 44,000',
  },
  {
    id: 'orbit-06',
    order: 6,
    name: 'Orbit Chair 06',
    image: 'chair6.png',
    material: 'Ash surface / blackened aluminum',
    note: 'An object for pause, repeat, and return.',
    price: 'NT$ 43,000',
  },
  {
    id: 'orbit-07',
    order: 7,
    name: 'Orbit Chair 07',
    image: 'chair7.png',
    material: 'Matte dark shell / polished foot ring',
    note: 'Circular balance with a heavier visual center.',
    price: 'NT$ 47,000',
  },
  {
    id: 'orbit-08',
    order: 8,
    name: 'Orbit Chair 08',
    image: 'chair8.png',
    material: 'Stone textile / smoked steel',
    note: 'Designed for rooms that feel slightly lunar.',
    price: 'NT$ 46,000',
  },
];

function getImagePath(fileName) {
  return path.join(rootDir, 'public', 'images', 'products', fileName);
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

async function importChairProducts() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    throw new Error('Missing SANITY_WRITE_TOKEN in .env.local');
  }

  for (const chair of chairProducts) {
    console.log(`Uploading image for ${chair.name}...`);

    const productImageAsset = await uploadImage(
      getImagePath(chair.image),
      `${chair.name} product image`,
    );

    const document = {
      _id: `chairProduct-${chair.id}`,
      _type: 'chairProduct',
      order: chair.order,
      name: chair.name,
      slug: {
        _type: 'slug',
        current: chair.id,
      },
      productImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: productImageAsset._id,
        },
      },
      material: chair.material,
      note: chair.note,
      price: chair.price,
      spinFramePath: '/images/chair-spin/frame-',
      spinFrameCount: 240,
    };

    await client.createOrReplace(document);

    console.log(`Imported ${document.name}`);
  }

  console.log('Done importing chair products.');
}

importChairProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});
