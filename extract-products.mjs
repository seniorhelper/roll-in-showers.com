import fs from 'node:fs';

const source = fs.readFileSync('../../upload/Pasted text (2)(1).txt', 'utf8');
const blocks = source.match(/<li class="grid__item">[\s\S]*?<\/li>/g) || [];
const decode = value => value
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&#39;/g, "'")
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const excluded = new Set([
  '36-x-36-single-piece-curbed-shower-5-25-curb-height-smooth-finish-walls-pan-only',
  '60-x-33-single-piece-5-curbed-shower-kit-4-tile-design-center-drain',
  '60-x-48-curbed-multi-piece-shower-pan-walls-package'
]);

const products = [];
for (const block of blocks) {
  const storePath = block.match(/href="(\/products\/[^"#?]+)"/)?.[1];
  const image = block.match(/<img[\s\S]*?\ssrc="([^"]+)"/)?.[1];
  const titleMatch = block.match(/class="full-unstyled-link"[\s\S]*?>\s*([\s\S]*?)\s*<\/a>/)?.[1];
  if (!storePath || !image || !titleMatch) continue;
  const handle = storePath.split('/').pop();
  if (excluded.has(handle)) continue;
  const title = decode(titleMatch);
  const dimensions = title.match(/(\d+)\s*(?:"|x|X|×)\s*(?:x|X|×)?\s*(\d+)/);
  const width = dimensions?.[1] || null;
  const depth = dimensions?.[2] || null;
  const isPan = /\bpan\b/i.test(title) && !/package|system/i.test(title);
  const isCorner = /corner|neo angle/i.test(title);
  const isPackage = /package|system|full/i.test(title) && !isPan;
  const shortName = title
    .replace(/\s*\|\s*/g, ' — ')
    .replace(/\s+/g, ' ')
    .trim();
  const note = isPackage
    ? `A ${width && depth ? `${width} × ${depth}-inch ` : ''}multi-piece shower package. Review the live listing for included walls, accessories, drain configuration, finish, and current availability.`
    : `A ${width && depth ? `${width} × ${depth}-inch ` : ''}${isCorner ? 'corner ' : ''}barrier-free shower base. Confirm the threshold profile, drain position, rough opening, and installation instructions before ordering.`;
  products.push({
    slug: `products/${handle}`,
    handle,
    title: shortName,
    width,
    depth,
    kind: isPackage ? 'Complete shower package' : 'Shower pan',
    corner: isCorner,
    href: `https://showers4less.com${storePath}`,
    img: `${image.startsWith('//') ? 'https:' : ''}${image}`.replace(/&amp;/g, '&'),
    note
  });
}

fs.writeFileSync('products-data.json', `${JSON.stringify(products, null, 2)}\n`);
console.log(`Extracted ${products.length} relevant products.`);
