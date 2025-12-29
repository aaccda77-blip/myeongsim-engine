import { useState, useRef, useCallback } from 'react';

export interface BioDataState {
    bpm: number;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    deviceName: string | null;
}

export const useBioData = () => {
    const [state, setState] = useState<BioDataState>({
        bpm: 0,
        isConnected: false,
        isConnecting: false,
        error: null,
        deviceName: null
    });

    const deviceRef = useRef<BluetoothDevice | null>(null);
    const serverRef = useRef<BluetoothRemoteGATTServer | null>(null);

    const parseHeartRate = (value: DataView) => {
        // Heart Rate Measurement format (0x2A37)
        // Flag byte (offset 0)
        // Bit 0: 0=UINT8 format, 1=UINT16 format
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        let bpm = 0;
        if (rate16Bits) {
            bpm = value.getUint16(1, true); // Little Endian
        } else {
            bpm = value.getUint8(1);
        }
        return bpm;
    };

    const handleCharacteristicValueChanged = (event: Event) => {
        const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
        if (characteristic.value) {
            const bpm = parseHeartRate(characteristic.value);
            setState(prev => ({ ...prev, bpm }));
        }
    };

    const connect = useCallback(async () => {
        if (typeof navigator.bluetooth === 'undefined') {
            setState(prev => ({ ...prev, error: "Web Bluetooth API is not available in this browser." }));
            return;
        }

        try {
            setState(prev => ({ ...prev, isConnecting: true, error: null }));

            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            });

            deviceRef.current = device;
            device.addEventListener('gattserverdisconnected', onDisconnected);

            const server = await device.gatt?.connect();
            if (!server) throw new Error("GATT Server not found");
            serverRef.current = server;

            const service = await server.getPrimaryService('heart_rate');
            const characteristic = await service.getCharacteristic('heart_rate_measurement');

            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

            setState({
                bpm: 0,
                isConnected: true,
                isConnecting: false,
                error: null,
                deviceName: device.name || 'Unknown Device'
            });

        } catch (error: any) {
            console.error("Bluetooth Connection Error:", error);
            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: error.message || "Failed to connect"
            }));
        }
    }, []);

    const disconnect = useCallback(() => {
        if (deviceRef.current) {
            if (deviceRef.current.gatt?.connected) {
                deviceRef.current.gatt.disconnect();
            }
        }
    }, []);

    const onDisconnected = () => {
        setState(prev => ({ ...prev, isConnected: false, bpm: 0, deviceName: null }));
    };

    return {
        ...state,
        connect,
        disconnect
    };
};
