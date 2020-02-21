# MapFileViewer

An Electron based application that shows information extracted from the MAP file generated by the TASKING linker.

![](/images/screenshot.png)

## Getting started

1. Download pre-build executable suitable for your OS from [release page](https://github.com/mdanilov/map-viewer/releases).
2. Run map-viewer.
3. Click the '...' button and open the *.map file produced by the linker.

To build and run from sources use:
```sh
npm install      # install NPM packages (needs to be done only once)
npm run start    # build and run the electron application (see 'scripts' in package.json)
```

## Usage

- Use filter input field to filter the table's content by 'Module' name.
- In settings you can change the filters which are used for text/bss/data section identifications. For example, filter value '.bss, .zbss' could be used to identify sections with names starting with '.(bss|zbss).*'.
- It is possible to sort the columns by clicking the column headers. Location table also supports the multi-column sorting (hold 'Ctrl' + click the column headers).
