// Your React component

import { useEffect } from 'react';
import io from 'socket.io-client';

interface orderid{
    orderID:number;
}

const OrderStatusComponent = ({orderID}:orderid) => {
    useEffect(() => {
        const socket = io('ws://your-backend-domain/ws/order/');
        socket.on('connect', () => {
            socket.emit('subscribe', { order_id: orderID });
        });

        socket.on('update_order_status', (data) => {
            console.log('Order status updated:', data.status);
            // Update your component state with the new order status
        });

        return () => {
            socket.disconnect();
        };
    }, [orderID]);

    return (
        <>order ID:</>
    );
};

export default OrderStatusComponent;

