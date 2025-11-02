
import React from 'react';
import { Consignment, Sale } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface WaybillProps {
    consignment: Consignment;
    sale: Sale; // The sale created from the consignment
}

const Waybill: React.FC<WaybillProps> = ({ consignment, sale }) => {
    const { branches, drivers, trucks } = useAppContext();
    const originBranch = branches.find(b => b.id === consignment.originBranchId);
    const driver = drivers.find(d => d.id === consignment.driverId);
    const truck = trucks.find(t => t.id === consignment.truckId);
    
    return (
        <div className="print-area bg-white text-black p-8 font-sans">
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">WAYBILL / DELIVERY NOTE</h1>
                    <p>No: {consignment.id}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">FlowPay Logistics</h2>
                    <p className="text-sm">{originBranch?.address}</p>
                    <p className="text-sm">{originBranch?.phone}</p>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border border-black p-4">
                    <h3 className="font-bold mb-2">SENDER (CONSIGNOR)</h3>
                    <p>{originBranch?.name}</p>
                    <p>{originBranch?.address}</p>
                    <p>Phone: {originBranch?.phone}</p>
                </div>
                <div className="border border-black p-4">
                    <h3 className="font-bold mb-2">RECEIVER (CONSIGNEE)</h3>
                    <p>{sale.customerName}</p>
                    <p>{consignment.destinationAddress}</p>
                    <p>Phone: [Customer Phone]</p>
                </div>
            </div>

            <table className="w-full border-collapse border border-black mb-8 text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-black p-2 text-left">Item Description</th>
                        <th className="border border-black p-2">Quantity</th>
                        <th className="border border-black p-2 text-right">Unit Price</th>
                        <th className="border border-black p-2 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sale.items.map(item => (
                        <tr key={item.id}>
                            <td className="border border-black p-2">{item.name}</td>
                            <td className="border border-black p-2 text-center">{item.quantity}</td>
                            <td className="border border-black p-2 text-right">{formatCurrency(item.price, 'USD')}</td>
                            <td className="border border-black p-2 text-right">{formatCurrency(item.price * item.quantity, 'USD')}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold">
                        <td colSpan={3} className="border border-black p-2 text-right">GRAND TOTAL</td>
                        <td className="border border-black p-2 text-right">{formatCurrency(sale.amount, 'USD')}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border border-black p-4">
                     <h3 className="font-bold mb-2">TRANSPORT DETAILS</h3>
                     <p>Driver: {driver?.name}</p>
                     <p>Driver's License: {driver?.licenseNumber}</p>
                     <p>Vehicle No: {truck?.licensePlate}</p>
                     <p>Vehicle Model: {truck?.model}</p>
                </div>
                <div className="border border-black p-4">
                    <h3 className="font-bold mb-2">NOTES</h3>
                    <p>{consignment.notes || 'No special instructions.'}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-16 text-sm">
                <div className="text-center">
                    <div className="border-t border-black pt-2 mt-8">Sender's Signature</div>
                </div>
                <div className="text-center">
                     <div className="border-t border-black pt-2 mt-8">Driver's Signature</div>
                </div>
                <div className="text-center">
                     <div className="border-t border-black pt-2 mt-8">Receiver's Signature & Date</div>
                </div>
            </div>
            
        </div>
    );
};

export default Waybill;
