import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from "@/middleware/mongodb";
import Rating from "@/models/Rating";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
    ) => {
    if(req.method == 'GET') {
        try {
            
            const ratings = await Rating.find({});

            return res.status(201).json(ratings);

        } catch (err) {
            console.log(err);
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}

export default connectDB(handler);