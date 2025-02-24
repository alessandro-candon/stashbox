import fs from "fs";
import {ipcMain} from "electron";
import path from "node:path";

export const localFilesystem = {
    local_read_dir: (event, dirPath, skipHiddenFiles = true) => {
        const files = fs.readdirSync(dirPath, {withFileTypes: true});
        return files.map(file => {
            const filePath = path.join(dirPath, file.name);
            const stats = fs.statSync(filePath);
            return {
                name: file.name,
                isDirectory: file.isDirectory(),
                path: filePath,
                size: stats.size,
                extension: path.extname(file.name),
                isHighlighted: false,
                isSelected: false
            };
        }).filter(file => !skipHiddenFiles || !file.name.startsWith('.'))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
}