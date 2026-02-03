import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function saveImage(file: File | Blob): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.webp`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore if exists
    }

    await sharp(buffer)
        .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toFile(filepath);

    return `/uploads/${filename}`;
}
