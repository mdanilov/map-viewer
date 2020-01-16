import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import * as Handsontable from 'handsontable';

import { FileService, FileProgressCallback } from './file.service';
import { LinkerMap, LinkRecord, SectionType } from '../../common/interfaces/linkermap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'map-viewer';
  filePath: string;
  linkerMap: LinkerMap;
  dataset = [];
  showProgressBar: boolean;

  tableSettings: Handsontable.default.GridSettings = {
    rowHeaders: true,
    colHeaders: true,
    columnSorting: true,
    currentRowClassName: 'currentRow',
    manualColumnResize: true,
    stretchH: 'all',
    minRows: 30,
    preventOverflow: 'horizontal',
    readOnly: true,
    licenseKey: 'non-commercial-and-evaluation',
    disableVisualSelection: 'area',
    fragmentSelection: true, // enable text selection within table
    dataSchema: { name: null, bssSize: null, dataSize: null, textSize: null },
    wordWrap: true, // the text of the cell content is wrapped if it does not fit in the fixed column width
    autoColumnSize: false, // disable setting column widths based on their widest cells
    nestedRows: true,
  };

  constructor(private fileService: FileService, private cd: ChangeDetectorRef) {
    this.showProgressBar = false;
  }

  onSelect() {
    this.loadFile();
  }

  onEnter(value: string) {
    this.loadFile(value);
  }

  calcTotalSectionSizes(record: LinkRecord): Map<SectionType, number> {
    const result = new Map([
      [SectionType.Bss,   0],
      [SectionType.Data,  0],
      [SectionType.Text,  0],
      [SectionType.Other, 0],
    ]);

    record.sections.forEach((section) => {
      result.set(section.type, result.get(section.type) + section.in.size);
    });

    return result;
  }

  prepareDataset(linkerMap: LinkerMap) {
    const fileToArchive = new Map<string, string>();

    linkerMap.processedFiles.forEach((file) => {
      if (file.archiveName) {
        fileToArchive.set(file.name, file.archiveName);
      }
    });

    const dataset = [];
    const archiveRefs = new Map<string, any>();

    linkerMap.linkResult.forEach((record) => {
      const archiveName = fileToArchive.get(record.fileName);
      const totalSize = this.calcTotalSectionSizes(record);
      dataset.push({
        name: archiveName ? archiveName + '(' + record.fileName + ')' : record.fileName,
        bssSize: totalSize.get(SectionType.Bss),
        dataSize: totalSize.get(SectionType.Data),
        textSize: totalSize.get(SectionType.Text),
        otherSize: totalSize.get(SectionType.Other),
      });
    });

    return dataset;
  }

  loadFile(path?: string) {
    this.fileService.loadFile(path,
      (percent) => {
        this.showProgressBar = true;
        this.cd.detectChanges();      // notify angular about view changes
    }).then(fileInfo => {
      this.filePath = fileInfo.path;
      this.dataset = this.prepareDataset(fileInfo.payload as LinkerMap);
      this.showProgressBar = false;
    });
  }
}
