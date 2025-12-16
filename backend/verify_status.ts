
import { InvoiceStatus } from './src/entities/invoice-master.entity';

console.log('Checking InvoiceStatus enum...');
if (InvoiceStatus.PENDING === 'pending' &&
    InvoiceStatus.APPROVED === 'approved' &&
    InvoiceStatus.DECLINED === 'declined' &&
    InvoiceStatus.PAID === 'paid' &&
    !('CLEAR' in InvoiceStatus)) {
    console.log('SUCCESS: InvoiceStatus is correct.');
} else {
    console.error('FAILURE: InvoiceStatus is incorrect:', InvoiceStatus);
    process.exit(1);
}
