export interface ExtractedTableRow {
  cells: [{ colSpan?: number; text?: string }];
}

export default interface ExtractedTable {
  rows: ExtractedTableRow[];
}
