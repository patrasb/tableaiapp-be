/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable require-jsdoc */
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { TextractClient, AnalyzeDocumentCommand, Block, Relationship } from '@aws-sdk/client-textract';

import { storage } from '@/utils/firebase';
import ExtractedTable, { ExtractedTableRow } from '@/shared/extractedTable';
import { increment, updateDoc } from 'firelord';
import { form } from '@/models/form';
import { user } from '@/models/user';
import { awsAccessKeyId, awsSecretAccessKey, awsTextractRegion } from '@/definitions';

/** Runs form through AWS, writes the result into the document and deducts the users credit */
export const formProcessTextract = onObjectFinalized({ secrets: [awsAccessKeyId, awsSecretAccessKey] }, async (event) => {
  const { bucket, name, metadata } = event.data;

  if (name.includes('_')) return; // Object is a resized image

  const downloadResponse = await storage.bucket(bucket).file(name).download();
  const Bytes = downloadResponse[0];

  const client = new TextractClient({
    region: awsTextractRegion.value(),
    credentials: {
      accessKeyId: awsAccessKeyId.value(),
      secretAccessKey: awsSecretAccessKey.value(),
    },
  });

  const command = new AnalyzeDocumentCommand({
    Document: { Bytes },
    FeatureTypes: ['TABLES'],
  });

  const result = await client.send(command);

  const tables = extractTables(result.Blocks || []);

  await updateDoc(form.doc(name), {
    extracted: { tables },
  });

  // update credit. Its safe to assume metadata exists due to storage rules
  await updateDoc(user.doc(metadata!.userUid!), {
    availableCredits: increment(-1),
  });

  return;
});

function extractTables(Blocks: Block[]): ExtractedTable[] {
  const getChildRelationships = (Relationships: Relationship[]) =>
    Relationships.filter(({ Type }) => Type === 'CHILD')[0]?.Ids?.map((id) => Blocks.find(({ Id }) => Id === id)!) || [];

  return Blocks.filter(({ BlockType }) => BlockType === 'TABLE').map(({ Relationships }) => {
    const cells = getChildRelationships(Relationships!).filter(({ BlockType }) => BlockType === 'CELL');

    const nRows = Math.max(...cells.map(({ RowIndex }) => RowIndex!));
    const nColumns = Math.max(...cells.map(({ ColumnIndex }) => ColumnIndex!));

    const rows = new Array(nRows).fill(null).map(
      () =>
        ({
          cells: Array(nColumns).fill(null),
        } as ExtractedTableRow),
    );

    cells.forEach(({ RowIndex, ColumnIndex, Relationships }) => {
      rows[RowIndex! - 1]!.cells[ColumnIndex! - 1] = {
        text: Relationships
          ? getChildRelationships(Relationships)
              .filter(({ BlockType }) => BlockType === 'WORD')
              .map(({ Text }) => Text)
              .join(' ')
          : '',
      };
    });

    return { rows };
  });
}
