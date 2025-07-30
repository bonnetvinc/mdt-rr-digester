import { NextResponse, type NextRequest } from 'next/server';
import { db } from '~/server/db';
import type { RawPassingInput } from '~/types/race-result-output';



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

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RawPassingInput;
        console.log('📩 Received data:', body);
        await saveRawPassing(body);
        return NextResponse.json({ status: 'ok' });
    } catch (err) {
        console.error('❌ Error while saving:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

