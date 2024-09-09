import { db } from '@/utils/firebase';
import { type MetaTypeCreator, getFirelord, ServerTimestamp, DocumentReference } from 'firelord';
import ExtractedTable from '@/shared/extractedTable';
import { User } from './user';

export type Form = MetaTypeCreator<
  {
    name: string | null;
    summary: string | null;
    userDocRef: DocumentReference<User>;
    createdAt: ServerTimestamp;
    type: string | null;
    extracted: {
      text: string | null;
      tables: ExtractedTable[];
    };
    deleted: boolean;
  },
  'forms',
  string
>;

export const form = getFirelord<Form>(db, 'forms');
