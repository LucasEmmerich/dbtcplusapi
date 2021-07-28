import { Request, Response } from "express";

class GlucoseRecordController {
    list(request: Request, response: Response) {
        return response.json('test');
    }
}

export default GlucoseRecordController;