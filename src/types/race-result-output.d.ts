export type RawPassingInput = {
    ID: number;
    PID: number;
    TimingPoint: string;
    Result: number;
    Time: number;
    Invalid: boolean;
    Bib: number;
    Passing: {
        Transponder: string;
        Position: {
            Latitude: number;
            Longitude: number;
            Altitude: number;
            Flag: string;
        };
        Hits: number;
        RSSI: number;
        Battery: number;
        Temperature: number;
        WUC: number;
        LoopID: number;
        Channel: number;
        InternalData: string;
        StatusFlags: number;
        DeviceID: string;
        DeviceName: string;
        OrderID: number;
        Port: number;
        IsMarker: boolean;
        FileNo: number;
        PassingNo: number;
        Customer: number;
        Received: string;
        UTCTime: string;
    };
};