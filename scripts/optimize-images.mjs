import sharp from 'sharp'
import { readdir, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')
const dirs = [
  join(root, 'public', 'products'),
  join(root, 'public', 'products', 'bio'),
]

let total = 0, saved = 0

for (const dir of dirs) {
  const files = (await readdir(dir)).filter(f => /\.(jpe?g|png|webp)$/i.test(f))

  for (const file of files) {
    const src = join(dir, file)
    const dest = join(dir, basename(file, extname(file)) + '.webp')

    const { size: before } = await (await import('fs')).promises.stat(src)

    await sharp(src)
      .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest)

    const { size: after } = await (await import('fs')).promises.stat(dest)
    const pct = Math.round((1 - after / before) * 100)
    console.log(`${file} → ${basename(dest)}  ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB  (-${pct}%)`)
    total += before
    saved += before - after
  }
}

console.log(`\nTotal saved: ${(saved/1024/1024).toFixed(1)} MB of ${(total/1024/1024).toFixed(1)} MB (${Math.round(saved/total*100)}%)`)
