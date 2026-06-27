import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const defaults = {
  look: '1',
  cropHeight: 1050,
  cropWidth: 840,
  offsetY: 0,
  offsetX: 0,
  outputHeight: 1402,
  outputWidth: 1122,
};

function readArgs() {
  return process.argv.slice(2).reduce((args, arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');

    if (!key || value === undefined) {
      return args;
    }

    return {
      ...args,
      [key]: value,
    };
  }, {});
}

function toNumber(value, fallback) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

const args = readArgs();
const look = String(args.look ?? defaults.look);
const cropHeight = toNumber(args.height, defaults.cropHeight);
const cropWidth = toNumber(args.width, defaults.cropWidth);
const offsetY = toNumber(args.offsetY, defaults.offsetY);
const offsetX = toNumber(args.offsetX, defaults.offsetX);
const outputHeight = toNumber(args.outputHeight, defaults.outputHeight);
const outputWidth = toNumber(args.outputWidth, defaults.outputWidth);

const source = resolve(`public/images/clothes/originals/${look}.png`);
const output = resolve(`public/images/clothes/${look}.png`);
const temp = resolve(`/tmp/apsis-clothes-${look}-crop.png`);

if (!existsSync(source)) {
  throw new Error(`Missing source image: ${source}`);
}

mkdirSync(dirname(output), { recursive: true });

const cropArgs = [
  '--cropToHeightWidth',
  String(cropHeight),
  String(cropWidth),
];

if (offsetY !== 0 || offsetX !== 0) {
  cropArgs.push('--cropOffset', String(offsetY), String(offsetX));
}

cropArgs.push(source, '--out', temp);

execFileSync('sips', cropArgs, { stdio: 'inherit' });

execFileSync(
  'sips',
  [
    '--resampleHeightWidth',
    String(outputHeight),
    String(outputWidth),
    temp,
    '--out',
    output,
  ],
  { stdio: 'inherit' },
);

console.log(
  [
    `Cropped look ${look}`,
    `source: ${source}`,
    `output: ${output}`,
    `crop: ${cropWidth}x${cropHeight}`,
    `offset: x=${offsetX}, y=${offsetY}`,
    `size: ${outputWidth}x${outputHeight}`,
  ].join('\n'),
);
