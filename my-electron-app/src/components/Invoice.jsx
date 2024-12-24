import React, { useEffect, useState ,forwardRef} from 'react'
import QRCode from 'qrcode';
import dateFormatter from '../../utils/DateFormatter';



const Invoice = forwardRef(({ data }, ref) => {
    console.log(data);
    const upiURL = `upi://pay?pa=sarmavasu-2@okhdfcbank&pn=Amrit Dey&am=${data.Amount}&cu=INR`;
    const [qr,setQR] = useState('');

    useEffect(()=>{
        QRCode.toDataURL(upiURL, (err,url)=>{
            if(err){
                console.error('Error generating QR Code : ',err);
            }else{
                console.log("QR Code url : ",url);
                setQR(url);
            }
        });
    },[]);

    

    return (
        <div ref={ref} className='bg-white w-full h-auto text-gray-950 p-5'>
            <div className='bg-gray-100 h-full p-4 pt-24'>
                <h1 className='text-5xl text-center font-bold text-blue-600 mb-4'>Telugu Satram Welcomes you</h1>
                <p className='text-center'>Pracheen Shree Ram Mandir, Uttarakhand 249401</p>
                <p className='text-center'>9634717899, sarmavasu@gmail.com</p>
                <div className='mt-10'>
                    <h2 className='text-blue-600 text-center font-bold mb-5'>Invoice Details</h2>
                    <div className='flex gap-20 justify-evenly border border-blue-600 py-4'>
                        <div>
                            <h3 className='font-bold'>
                                Bill to :
                            </h3>
                            <p>
                                {data.Customer.Name}, {data.Customer.Phone}, {data.Customer.Email}
                            </p>
                            <h3 className='font-bold'>
                                Billing Address:
                            </h3>
                            <p>
                                {data.Customer.Address}
                            </p>
                        </div>
                        <div>
                            <h3 className='font-bold'>
                                Invoice No.
                            </h3>
                            <p>{data.invoiceNumber}</p>
                            <h3 className='font-bold'>
                                Check In :
                            </h3>
                            <p>
                                {dateFormatter(data.CheckIn)}
                            </p>
                            <h3 className='font-bold'>
                                Check Out :
                            </h3>
                            <p>
                                {dateFormatter(data.CheckOut)}
                            </p>
                        </div>

                    </div>
                    <div class="container mt-4 mx-auto p-4 border-gray-600">
                        <table class="min-w-full bg-white border ">
                            <thead>
                                <tr>
                                    <th class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Room Number</th>
                                    <th class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Type (AC/Non AC)</th>
                                    <th class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Price (in Rs)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.Rooms.map((room) => {
                                    return (
                                        <tr>
                                            <td class="py-2 px-4 border-b border-gray-400 text-sm text-gray-700">{room.roomNumber}</td>
                                            <td class="py-2 px-4 border-b border-gray-400 text-sm text-gray-700">{room.type}</td>
                                            <td class="py-2 px-4 border-b border-gray-400 text-sm text-gray-700">{room.price}</td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" class="py-2 px-4 border-t border-gray-200 text-right text-sm font-semibold text-gray-600">Total</td>
                                    <td class="py-2 px-4 border-t border-gray-200 text-sm font-semibold text-gray-700">{data.Amount} /- Rs</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {!data.PaymentDetails.status?<div className='flex gap-4'>
                    <img src={qr} alt="UPI Payment QR Code" />
                    <div>
                        <h3 className='font-bold'>Bank Details</h3>
                        <p>State Bank of India</p>
                        <p>Acc Holder Name : VASUDEVA SARMA GANTELA</p>
                        <p>Acc Type : Current</p>
                        <p>IFSC : SBIN0012849</p>
                        <p>sarmavasu-2@okhdfcbank</p>
                    </div>
                    </div>:<div className='px-4 font-bold'>Amount fully paid via {data.PaymentDetails.method} {data.PaymentDetails.method!=='Cash' && <p>with transaction ID - {data.PaymentDetails.transactionId}</p>}
                    
                    <div>Authorized Signatory</div>
                    <img  className={'size-16'} src={'./src/assets/sign.png'} alt="Image of authorised signature"/>
                    Shri Vasudeva Sarma Gantela <br></br>(Chairperson, Sri Goutammi Nityaannadana Trust)
                    </div>}

                </div>

            </div>
            **This is an auto-generated invoice and does not require a signature for validation        </div>
    )
});


export default Invoice;