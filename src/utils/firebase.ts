import { getFirestore } from 'firelord';
import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { functionsRegion } from '@/definitions';
import { getAuth } from 'firebase-admin/auth';

const app = initializeApp();

setGlobalOptions({ region: functionsRegion });

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
