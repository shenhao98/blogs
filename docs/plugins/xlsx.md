```sh
pnpm i exceljs
```

```js
// 创建工作表
const workbook = new ExcelJS.Workbook()
// 加载外部文件 file:File
await workbook.xlsx.load(await file.arrayBuffer())
// 获取行 传入行和列可获得某一格 不传列默认整行
const row = worksheet.getCell(2, 6)
// 传入列数获取整列
const col = worksheet.getColumn(6)
```

获取到行和列后可以单独操作每个单元格，设置边框、文字样式、字体大小、对齐、居中、宽度等等
