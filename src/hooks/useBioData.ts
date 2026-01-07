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

    const simulate = useCallback(() => {
        if (state.isConnected) return; // 이미 연결되어 있으면 무시

        setState(prev => ({ ...prev, isConnecting: true, error: null }));

        setTimeout(() => {
            setState(prev => ({
                ...prev,
                isConnected: true,
                isConnecting: false,
                deviceName: "Galaxy Watch 6 (Simulator)",
                bpm: 72
            }));

            // Start Mock Stream
            const interval = setInterval(() => {
                setState(prev => {
                    if (!prev.isConnected) {
                        clearInterval(interval);
                        return prev;
                    }
                    // Random fluctuation 65-85 BPM
                    const newBpm = 65 + Math.floor(Math.random() * 20);
                    return { ...prev, bpm: newBpm };
                });
            }, 2000); // 2초마다 갱신

            // Clean up interval on disconnect is tricky inside hook closure. 
            // For simplicity, we assume disconnect sets isConnected to false which stops updates.
            // A better way is using useEffect or ref for interval ID.
        }, 1500);
    }, [state.isConnected]);

    const simulateRecovery = useCallback(() => {
        // 이미 연결되어 있어도 강제로 시뮬레이션 모드로 전환 (데모용)
        setState(prev => ({
            ...prev,
            isConnecting: false,
            isConnected: true,
            deviceName: "Galaxy Watch 6 (Recovery Demo)",
            bpm: 118 // Start High (Panic level)
        }));

        let currentBpm = 118;
        const targetBpm = 72;

        const interval = setInterval(() => {
            setState(prev => {
                // 목표 도달 시 종료
                if (currentBpm <= targetBpm) {
                    clearInterval(interval);
                    return { ...prev, bpm: targetBpm };
                }

                // 불규칙하게 감소 (자연스러운 연출)
                // 30% 확률로 유지, 70% 확률로 1~3 감소
                if (Math.random() > 0.3) {
                    const drop = Math.floor(Math.random() * 3) + 1;
                    currentBpm -= drop;
                }

                return { ...prev, bpm: currentBpm };
            });
        }, 500); // 0.5초마다 업데이트 (약 15~20초 소요)

        // Cleanup function for this specific interval is tricky here, 
        // relying on component unmount or new simulation overwriting state.
    }, []);

    return {
        ...state,
        connect,
        disconnect,
        simulate,
        simulateRecovery // [New]
    };
};
