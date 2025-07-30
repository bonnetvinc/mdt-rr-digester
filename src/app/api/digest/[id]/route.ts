import type { NextApiRequest, NextApiResponse } from 'next';

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

async function saveRawPassing(input: RawPassingInput) {
    return db.rawPassing.create({
        data: {
            id: input.ID,
            pid: input.PID,
            timingPoint: input.TimingPoint,
            result: input.Result,
            time: input.Time,
            invalid: input.Invalid,
            bib: input.Bib,
            transponder: input.Passing.Transponder,
            hits: input.Passing.Hits,
            rssi: input.Passing.RSSI,
            battery: input.Passing.Battery,
            temperature: input.Passing.Temperature,
            wuc: input.Passing.WUC,
            loopId: input.Passing.LoopID,
            channel: input.Passing.Channel,
            internalData: input.Passing.InternalData,
            statusFlags: input.Passing.StatusFlags,
            deviceId: input.Passing.DeviceID,
            deviceName: input.Passing.DeviceName,
            orderId: input.Passing.OrderID,
            port: input.Passing.Port,
            isMarker: input.Passing.IsMarker,
            fileNo: input.Passing.FileNo,
            passingNo: input.Passing.PassingNo,
            customer: input.Passing.Customer,
            received: new Date(input.Passing.Received),
            utcTime: new Date(input.Passing.UTCTime),
            latitude: input.Passing.Position.Latitude,
            longitude: input.Passing.Position.Longitude,
            altitude: input.Passing.Position.Altitude,
            flag: input.Passing.Position.Flag
        }
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const body = req.body as RawPassingInput;
            console.log('📩 Received data:', body);
            await saveRawPassing(body);
            res.status(200).json({ status: 'ok' });
        } catch (err) {
            console.error('❌ Error while saving:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'GET') {
        res.status(200).json({ status: 'ok' });
    } else {
        res.setHeader('Allow', 'GET, POST');
        res.status(405).end('Method Not Allowed');
    }
}
