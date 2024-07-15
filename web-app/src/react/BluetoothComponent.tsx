import React, { useState } from 'react';

const BluetoothComponent: React.FC = () => {
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['battery_service'] }]
            });

            const server = await device.gatt?.connect();

            if (!server) {
                throw new Error('Failed to connect to Bluetooth device');
            }

            const service = await server.getPrimaryService('battery_service');
            const characteristic = await service.getCharacteristic('battery_level');
            const value = await characteristic.readValue();

            console.log('Battery level:', value.getUint8(0));
        } catch (error) {
            console.error('Failed to connect to Bluetooth device:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div>
            <button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? '接続中...' : 'Me-BikeをBluetooth接続'}
            </button>
        </div>
    );
};

export default BluetoothComponent;
