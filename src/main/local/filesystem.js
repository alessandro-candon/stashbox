const fs = require('fs');
const { ipcMain } = require("electron");
const path = require("node:path");

function LocalFilesystem() {
    ipcMain.handle('read-dir', async (event, dirPath, skipHiddenFiles = true) => {
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
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
        })
        .filter(file => !skipHiddenFiles || !file.name.startsWith('.'))
        .sort((a, b) => {
            return a.name.localeCompare(b.name)
        });
    })
}

// Use module.exports to export the function
module.exports = { LocalFilesystem };
