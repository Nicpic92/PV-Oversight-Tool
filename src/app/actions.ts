'use server'
import { db } from '@/db';
import { audits, auditResults } from '@/db/schema';
import * as XLSX from 'xlsx';

export async function processAuditAction(formData: FormData) {
  const file = formData.get('claimFile') as File;
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  // 1. Create Audit Entry
  const [newAudit] = await db.insert(audits).values({
    payer: "MIRRA_CLIENT", 
    totalClaims: data.length,
  }).returning();

  // 2. Map through your logic (Simplification of your V2.1.3 logic)
  const results = data.map((row: any) => ({
    auditId: newAudit.id,
    claimNumber: String(row['Claim Number'] || row['ClaimNumber']),
    category: "READY (INN)", // Insert your comparison logic here
    netPayment: parseFloat(row['TotalNetPaymentAmt'] || 0),
  }));

  // 3. Bulk Insert into Neon
  await db.insert(auditResults).values(results);
  
  return { success: true, auditId: newAudit.id };
}
